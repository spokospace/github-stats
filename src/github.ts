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
    login
    avatarUrl(size: 120)
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
  const { user: u } = await gql(token, STATS_QUERY, { login: logins[0], from, to });

  const repos = u.repositories.nodes;
  let totalStars = 0, totalForks = 0, totalWatchers = 0;
  for (const r of repos) {
    totalStars += r.stargazerCount;
    totalForks += r.forkCount;
    totalWatchers += r.watchers.totalCount;
  }

  const c = u.contributionsCollection;
  const totalCommits = c.totalCommitContributions;
  const totalPRs = c.totalPullRequestContributions;
  const reviewedPRs = c.totalPullRequestReviewContributions;
  const totalIssues = c.totalIssueContributions;
  const contributions = totalCommits + totalPRs + totalIssues;

  const yearsOnGH = Math.floor((Date.now() - new Date(u.createdAt).getTime()) / (365.25 * 864e5));

  return {
    totalCommits, totalPRs, mergedPRs: u.pullRequests.totalCount, reviewedPRs,
    totalIssues, closedIssues: u.issues.totalCount,
    totalStars, totalForks, totalRepos: u.repositories.totalCount, totalWatchers,
    followers: u.followers.totalCount, contributions,
    discussionsStarted: u.repositoryDiscussions.totalCount,
    discussionsAnswered: u.repositoryDiscussionComments.totalCount,
    yearsOnGH, avatarUrl: u.avatarUrl as string | undefined, login: u.login as string | undefined,
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

  // Forward pass: longest streak + first contribution
  let longestStreak = 0, streak = 0;
  let firstContribution: string | undefined, tempStart = '', longestStreakStart: string | undefined, longestStreakEnd: string | undefined;

  for (const day of days) {
    if (day.contributionCount > 0) {
      if (!firstContribution) firstContribution = day.date;
      if (streak === 0) tempStart = day.date;
      streak++;
      if (streak >= longestStreak) {
        longestStreak = streak;
        longestStreakStart = tempStart;
        longestStreakEnd = day.date;
      }
    } else {
      streak = 0;
    }
  }

  // Current streak: walk backwards from today
  // Skip today if it has no contributions yet (day not over)
  const today = new Date().toISOString().slice(0, 10);
  let currentStreak = 0, currentStreakStart: string | undefined, currentStreakEnd: string | undefined;

  for (let i = days.length - 1; i >= 0; i--) {
    const day = days[i];
    if (day.date === today && day.contributionCount === 0) continue;
    if (day.contributionCount > 0) {
      if (currentStreak === 0) currentStreakEnd = day.date;
      currentStreak++;
      currentStreakStart = day.date;
    } else {
      break;
    }
  }

  const weeklyContributions = cal.weeks
    .slice(-26)
    .map((w: any) => w.contributionDays.reduce((s: number, d: any) => s + d.contributionCount, 0));

  return {
    currentStreak,
    longestStreak,
    totalContributions: cal.totalContributions,
    lastContribution: days[days.length - 1]?.date,
    firstContribution,
    currentStreakStart,
    currentStreakEnd,
    longestStreakStart,
    longestStreakEnd,
    weeklyContributions,
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

function mapRepo(r: any, login: string): RepoData {
  return {
    name: r.name,
    description: r.description ?? '',
    stars: r.stargazerCount,
    forks: r.forkCount,
    language: r.primaryLanguage?.name ?? 'Unknown',
    url: r.url,
    isPrivate: r.isPrivate,
    owner: login,
    watchers: 0,
    languageColor: null,
    topics: [],
    updatedAt: '',
  };
}

export async function fetchRepos(token: string, logins: string[]): Promise<RepoData[]> {
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
