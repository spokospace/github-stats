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

const REPOS_QUERY = `
query($login: String!, $isSelf: Boolean!, $after: String) {
  user: repositoryOwner(login: $login) {
    repositories(first: 100, after: $after, ownerAffiliations: OWNER, privacy: null) {
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
  viewer @include(if: $isSelf) { login }
}
`;

async function fetchRepoLanguages(token: string, login: string, isSelf: boolean): Promise<LangData> {
  const totals: LangData = {};
  let after: string | null = null;

  do {
    const data = await gql(token, REPOS_QUERY, { login, isSelf, after });
    const { nodes, pageInfo } = data.user.repositories;

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
  const results = await Promise.all(
    logins.map((login, i) => fetchRepoLanguages(token, login, i === 0))
  );
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

  const results = await Promise.all(logins.map(login => gql(token, STATS_QUERY, { login, from, to })));

  let totalCommits = 0, totalPRs = 0, mergedPRs = 0, totalIssues = 0, closedIssues = 0;
  let totalStars = 0, totalForks = 0, totalRepos = 0, totalWatchers = 0;
  let followers = 0, contributions = 0, discussionsStarted = 0, discussionsAnswered = 0, reviewedPRs = 0;
  let createdAt = now.toISOString();

  for (const data of results) {
    const u = data.user;
    const cc = u.contributionsCollection;
    totalCommits    += cc.totalCommitContributions;
    totalPRs        += cc.totalPullRequestContributions;
    reviewedPRs     += cc.totalPullRequestReviewContributions;
    totalIssues     += cc.totalIssueContributions;
    contributions   += cc.totalCommitContributions + cc.totalPullRequestContributions + cc.totalIssueContributions;
    mergedPRs       += u.pullRequests.totalCount;
    closedIssues    += u.issues.totalCount;
    totalRepos      += u.repositories.totalCount;
    discussionsStarted  += u.repositoryDiscussions.totalCount;
    discussionsAnswered += u.repositoryDiscussionComments.totalCount;
    followers       = Math.max(followers, u.followers.totalCount);
    if (u.createdAt < createdAt) createdAt = u.createdAt;

    for (const repo of u.repositories.nodes) {
      totalStars    += repo.stargazerCount;
      totalForks    += repo.forkCount;
      totalWatchers += repo.watchers.totalCount;
    }
  }

  const experience = Math.floor((now.getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24 * 365));

  return {
    totalCommits, totalPRs, mergedPRs, totalIssues, closedIssues,
    totalStars, totalForks, totalRepos, totalWatchers,
    followers, contributions, discussionsStarted, discussionsAnswered,
    reviewedPRs, experience,
  } as any;
}

// ── Streak ────────────────────────────────────────────────────────────────────

const CONTRIB_QUERY = `
query($login: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $login) {
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays { date contributionCount contributionLevel }
        }
      }
    }
  }
}
`;

export async function fetchStreak(token: string, login: string): Promise<StreakData> {
  const now = new Date();
  // fetch last 2 years to cover longest streak
  const from = new Date(now.getFullYear() - 1, 0, 1).toISOString();
  const to = now.toISOString();

  const data = await gql(token, CONTRIB_QUERY, { login, from, to });
  const cal = data.user.contributionsCollection.contributionCalendar;
  const days: Array<{ date: string; count: number }> = [];

  for (const week of cal.weeks) {
    for (const day of week.contributionDays) {
      days.push({ date: day.date, count: day.contributionCount });
    }
  }

  // Calculate streaks
  let currentStreak = 0, longestStreak = 0, tempStreak = 0;
  let currentStreakStart = '', currentStreakEnd = '', longestStreakStart = '', longestStreakEnd = '';
  let tempStart = '';
  let firstContribution = '';

  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    if (day.count > 0) {
      if (!firstContribution) firstContribution = day.date;
      if (tempStreak === 0) tempStart = day.date;
      tempStreak++;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
        longestStreakStart = tempStart;
        longestStreakEnd = day.date;
      }
    } else {
      tempStreak = 0;
    }
  }

  // Current streak from today backwards
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].count > 0) {
      currentStreak++;
      currentStreakEnd = currentStreakEnd || days[i].date;
      currentStreakStart = days[i].date;
    } else if (currentStreak > 0) break;
  }

  return {
    currentStreak,
    longestStreak,
    currentStreakStart,
    currentStreakEnd,
    longestStreakStart,
    longestStreakEnd,
    totalContributions: cal.totalContributions,
    firstContribution,
  };
}

// ── Repos ─────────────────────────────────────────────────────────────────────

const FEATURED_REPOS_QUERY = `
query($login: String!) {
  user(login: $login) {
    pinnedItems(first: 6, types: REPOSITORY) {
      nodes {
        ... on Repository {
          name owner { login } description stargazerCount forkCount
          watchers { totalCount }
          primaryLanguage { name color }
          isPrivate repositoryTopics(first: 5) { nodes { topic { name } } }
          url updatedAt
        }
      }
    }
    repositories(first: 6, orderBy: { field: STARGAZERS, direction: DESC }, ownerAffiliations: OWNER, isFork: false) {
      nodes {
        name owner { login } description stargazerCount forkCount
        watchers { totalCount }
        primaryLanguage { name color }
        isPrivate repositoryTopics(first: 5) { nodes { topic { name } } }
        url updatedAt
      }
    }
  }
}
`;

export async function fetchRepos(token: string, login: string): Promise<RepoData[]> {
  const data = await gql(token, FEATURED_REPOS_QUERY, { login });
  const u = data.user;
  const pinned = u.pinnedItems.nodes;
  const top = u.repositories.nodes;
  const seen = new Set<string>();
  const repos: RepoData[] = [];

  const mapRepo = (r: any): RepoData => ({
    name: r.name,
    owner: r.owner.login,
    description: r.description,
    stars: r.stargazerCount,
    forks: r.forkCount,
    watchers: r.watchers.totalCount,
    language: r.primaryLanguage?.name ?? null,
    languageColor: r.primaryLanguage?.color ?? null,
    isPrivate: r.isPrivate,
    topics: r.repositoryTopics.nodes.map((n: any) => n.topic.name),
    url: r.url,
    updatedAt: r.updatedAt,
  });

  for (const r of [...pinned, ...top]) {
    if (!seen.has(r.name)) { seen.add(r.name); repos.push(mapRepo(r)); }
    if (repos.length >= 6) break;
  }
  return repos;
}

// ── Contribution Calendar ─────────────────────────────────────────────────────

export async function fetchContributions(token: string, login: string): Promise<ContribData> {
  const now = new Date();
  const from = new Date(now.getFullYear(), 0, 1).toISOString();
  const to = now.toISOString();
  const data = await gql(token, CONTRIB_QUERY, { login, from, to });
  const cal = data.user.contributionsCollection.contributionCalendar;

  const levelMap: Record<string, 0 | 1 | 2 | 3 | 4> = {
    NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4,
  };

  return {
    totalContributions: cal.totalContributions,
    weeks: cal.weeks.map((w: any) => ({
      days: w.contributionDays.map((d: any) => ({
        date: d.date,
        count: d.contributionCount,
        level: levelMap[d.contributionLevel] ?? 0,
      })),
    })),
  };
}
