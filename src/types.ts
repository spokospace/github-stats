export interface Env {
  GITHUB_TOKEN: string;
  KV: KVNamespace;
  CACHE_BUST_TOKEN: string;
}

export interface LangData {
  [lang: string]: number; // bytes
}

export interface StatsData {
  totalCommits: number;
  totalPRs: number;
  mergedPRs: number;
  totalIssues: number;
  closedIssues: number;
  totalStars: number;
  totalForks: number;
  totalRepos: number;
  totalWatchers: number;
  followers: number;
  contributions: number; // this year
  discussionsStarted: number;
  discussionsAnswered: number;
  reviewedPRs: number;
  yearsOnGH?: number;
  avatarUrl?: string;
  login?: string;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalContributions: number;
  lastContribution?: string;
  firstContribution?: string;
  currentStreakStart?: string;
  currentStreakEnd?: string;
  longestStreakStart?: string;
  longestStreakEnd?: string;
  weeklyContributions?: number[];
}

export interface RepoData {
  name: string;
  owner: string;
  description: string | null;
  stars: number;
  forks: number;
  watchers: number;
  language: string | null;
  languageColor: string | null;
  isPrivate: boolean;
  topics: string[];
  url: string;
  updatedAt: string;
}

export interface TrophyData {
  totalStars: number;
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  followers: number;
  totalRepos: number;
  contributions: number;
  experience: number; // account age in years
}

export interface ContribDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ContribData {
  weeks: Array<{ contributionDays: ContribDay[] }>;
  total: number;
}
