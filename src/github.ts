import type { LangData, StatsData, StreakData, RepoData, ContribData } from './types';

const GH = 'https://api.github.com/graphql';

async function gql(token: string, query: string, variables = {}): Promise<any> {
  const res = await fetch(GH, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'spokospace-github-stats',
    },
    body: JSON.stringify({ query, variables }),
  });
  const json: any = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);
  return json.data;
}

// ── Languages ────────────────────────────────────────────────────────────────

const LANG_IGNORE = new Set(['HTML', 'CSS', 'SCSS', 'MDX', 'Markdown', 'Shell', 'Dockerfile', 'Batchfile']);

// repositoryOwner works for both users AND organizations
const REPOS_QUERY = `
query($login: String!, $after: String) {
  owner: repositoryOwner(login: $login) {
    repositories(first: 100, after: $after, ownerAffiliations: OWNER) {
      pageInfo { hasNextPage endCursor }
      nodes {
        name
        isFork
        languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
          edges { size node { name } }
        }
      }
    }
  }
}
`;

async function fetchRepoLanguages(token: string, login: string): Promise<LangData> {
  const totals: LangData = {};
  let after: string | null = null;
  do {
    const data = await gql(token, REPOS_QUERY, { login, after });
    const { nodes, pageInfo } = data.owner.repositories;
    for (const repo of nodes) {
      if (repo.isFork) continue;
      for (const edge of repo.languages.edges) {
        const lang = edge.node.name;
        if (!LANG_IGNORE.has(lang)) {
          totals[lang] = (totals[lang] ?? 0) + edge.size;
        }
      }
    }
    after = pageInfo.hasNextPage ? pageInfo.endCursor : null;
  } while (after);
  return totals;
}

export async function fetchLanguages(token: string, logins: string[]): Promise<LangData> {
  const results = await Promise.all(logins.map(login => fetchRepoLanguages(token, login)));
  const merged: LangData = {};
  for (const result of results) {
    for (const [lang, bytes] of Object.entries(result)) {
      merged[lang] = (merged[lang] ?? 0) + bytes;
    }
  }
  return Object.fromEntries(
    Object.entries(merged).sort(([, a], [, b]) => b - a).slice(0, 10)
  );
}

// ── Stats ─────────────────────────────────────────────────────────────────────
// Stats only work for user accounts (not orgs), so we use logins[0] = spokospace

const STATS_QUERY = `
query($login: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $login) {
    repositories(first: 100, ownerAffiliations: OWNER, isFork: false) {
      nodes { stargazerCount forkCount watchers { totalCount } }
      totalCount
    }
    contributionsCollection(from: $from, to: $to) {
      totalCommitContributions
      totalPullRequestContributions
      totalPullRequestReviewContributions
      totalIssueContributions
      totalRepositoryContributions
    }
    pullRequests(states: MERGED) { totalCount }
    issues(states: CLOSED) { totalCount }
    openIssues: issues(states: OPEN) { totalCount }
    repositoryDiscussions { totalCount }
    repositoryDiscussionComments(onlyAnswers: true) { totalCount }
    followers { totalCount }
    createdAt
  }
}
`;

export async function fetchStats(token: string, logins: string[]): Promise<StatsData> {
  const now = new Date();
  const from = new Date(now.getFullYear(), 0, 1).toISOString();
  const to = now.toISOString();
  // Only query user accounts (logins[0] = spokospace)
  const userLogins = [logins[0]];
  const results = await Promise.all(userLogins.map(login => gql(token, STATS_QUERY, { login, from, to })));

  let totalCommits = 0, totalPRs = 0, mergedPRs = 0, totalIssues = 0, closedIssues = 0;
  let totalStars = 0, totalForks = 0, totalRepos = 0, totalWatchers = 0;
  let followers = 0, contributions = 0, discussionsStarted = 0, discussionsAnswered = 0, reviewedPRs = 0;
  let createdAt = now.toISOString();

  for (const data of results) {
    const u = data.user;
    const repos = u.repositories.nodes;
    totalRepos += u.repositories.totalCount;
    for (const r of repos) {
      totalStars += r.stargazerCount;
      totalForks += r.forkCount;
      totalWatchers += r.watchers.totalCount;
    }
    const c = u.contributionsCollection;
    totalCommits += c.totalCommitContributions;
    totalPRs += c.totalPullRequestContributions;
    reviewedPRs += c.totalPullRequestReviewContributions;
    totalIssues += c.totalIssueContributions;
    contributions += c.totalCommitContributions + c.totalPullRequestContributions + c.totalIssueContributions;
    mergedPRs += u.pullRequests.totalCount;
    closedIssues += u.issues.totalCount;
    followers += u.followers.totalCount;
    discussionsStarted += u.repositoryDiscussions.totalCount;
    discussionsAnswered += u.repositoryDiscussionComments.totalCount;
    if (u.createdAt < createdAt) createdAt = u.createdAt;
  }

  const yearsOnGH = Math.floor((Date.now() - new Date(createdAt).getTime()) / (365.25 * 864e5));

  return {
    totalCommits, totalPRs, mergedPRs, reviewedPRs,
    totalIssues, closedIssues,
    totalStars, totalForks, totalRepos, totalWatchers,
    followers, contributions, discussionsStarted, discussionsAnswered,
    yearsOnGH,
  };
}

// ── Streak ───────────────────────────────────────────────────────────────────
// Streak uses contributionsCollection — user only (spokospace)

const STREAK_QUERY = `
query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
          }
        }
      }
    }
  }
}
`;

export async function fetchStreak(token: string, logins: string[]): Promise<StreakData> {
  const data = await gql(token, STREAK_QUERY, { login: logins[0] });
  const cal = data.user.contributionsCollection.contributionCalendar;
  const days = cal.weeks.flatMap((w: any) => w.contributionDays);

  let currentStreak = 0, longestStreak = 0, streak = 0;
  let lastDate = '';

  for (const day of days) {
    if (day.contributionCount > 0) {
      streak++;
      if (streak > longestStreak) longestStreak = streak;
    } else {
      streak = 0;
    }
    lastDate = day.date;
  }

  // Current streak: count backwards from today
  const today = new Date().toISOString().slice(0, 10);
  const reverseDays = [...days].reverse();
  for (const day of reverseDays) {
    if (day.date > today) continue;
    if (day.contributionCount > 0) {
      currentStreak++;
    } else {
      break;
    }
  }

  return {
    currentStreak,
    longestStreak,
    totalContributions: cal.totalContributions,
    lastContribution: lastDate,
  };
}

// ── Repos ────────────────────────────────────────────────────────────────────

const FEATURED_REPOS_QUERY = `
query($login: String!) {
  owner: repositoryOwner(login: $login) {
    repositories(first: 6, ownerAffiliations: OWNER, orderBy: { field: STARGAZERS, direction: DESC }, privacy: PUBLIC) {
      nodes {
        name
        description
        stargazerCount
        forkCount
        primaryLanguage { name }
        url
        isPrivate
      }
    }
  }
}
`;

function mapRepo(r: any, login: string): RepoData[number] {
  return {
    name: r.name,
    description: r.description ?? '',
    stars: r.stargazerCount,
    forks: r.forkCount,
    language: r.primaryLanguage?.name ?? 'Unknown',
    url: r.url,
    isPrivate: r.isPrivate,
    owner: login,
  };
}

export async function fetchRepos(token: string, logins: string[]): Promise<RepoData> {
  const results = await Promise.all(
    logins.map(async login => {
      const data = await gql(token, FEATURED_REPOS_QUERY, { login });
      return data.owner.repositories.nodes.map((r: any) => mapRepo(r, login));
    })
  );
  return results.flat().sort((a, b) => b.stars - a.stars).slice(0, 6);
}

// ── Contributions calendar ───────────────────────────────────────────────────
// Contribution calendar — user only (spokospace)

const CONTRIB_QUERY = `
query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
            color
          }
        }
      }
    }
  }
}
`;

export async function fetchContributions(token: string, logins: string[]): Promise<ContribData> {
  const data = await gql(token, CONTRIB_QUERY, { login: logins[0] });
  const cal = data.user.contributionsCollection.contributionCalendar;
  return {
    total: cal.totalContributions,
    weeks: cal.weeks,
  };
}
