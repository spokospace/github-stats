import { writeFileSync } from 'fs';
import { renderProfile } from './src/renderers/profile';
import { renderStats } from './src/renderers/stats';
import { renderLangs } from './src/renderers/langs';
import { renderRepos } from './src/renderers/repos';
import { DEFAULT_THEME } from './src/svg/theme';

const mockStats = {
  totalCommits: 847,
  totalPRs: 134,
  mergedPRs: 121,
  reviewedPRs: 58,
  totalIssues: 43,
  closedIssues: 38,
  totalStars: 312,
  totalForks: 29,
  totalRepos: 47,
  totalWatchers: 18,
  followers: 92,
  contributions: 612,
  discussionsStarted: 7,
  discussionsAnswered: 14,
  yearsOnGH: 8,
  login: 'spokospace',
};

const mockStreak = {
  currentStreak: 12,
  longestStreak: 34,
  totalContributions: 1204,
  lastContribution: '2026-06-13',
  currentStreakStart: '2026-06-01',
  currentStreakEnd: '2026-06-13',
  longestStreakStart: '2026-01-05',
  longestStreakEnd: '2026-02-07',
  firstContribution: '2018-03-10',
  weeklyContributions: [3,7,5,0,12,8,4,9,6,11,2,14,7,5,9,3,8,11,6,4,10,7,12,5,9,14],
};

const mockLangs = {
  TypeScript: 980000,
  PHP: 650000,
  Vue: 420000,
  JavaScript: 310000,
  Astro: 180000,
  CSS: 90000,
  Python: 70000,
};

const mockRepos = [
  { name: 'github-stats-widget', owner: 'spokospace', description: 'SVG GitHub stats widgets for Cloudflare Workers', stars: 87, forks: 12, language: 'TypeScript', languageColor: '#3178c6', isPrivate: false, url: '#', watchers: 5, topics: [], updatedAt: '2026-06-01' },
  { name: 'my-very-long-repository-name-here', owner: 'spokospace', description: 'A project with a really long description that needs to be properly truncated and wrapped across multiple lines to test layout', stars: 34, forks: 5, language: 'Vue', languageColor: '#41b883', isPrivate: false, url: '#', watchers: 2, topics: [], updatedAt: '2026-05-20' },
  { name: 'portfolio', owner: 'spokospace', description: 'Personal portfolio website', stars: 21, forks: 3, language: 'Astro', languageColor: '#ff5a03', isPrivate: false, url: '#', watchers: 1, topics: [], updatedAt: '2026-05-15' },
  { name: 'laravel-starter', owner: 'polo-blue', description: 'Laravel boilerplate with auth, roles and Filament admin panel out of the box', stars: 18, forks: 7, language: 'PHP', languageColor: '#4f5d95', isPrivate: false, url: '#', watchers: 3, topics: [], updatedAt: '2026-04-10' },
];

const profile = renderProfile(mockStats as any, mockStreak as any, DEFAULT_THEME, new Set(['contributions', 'streak']));
const stats = renderStats(mockStats as any, DEFAULT_THEME);
const langs = renderLangs(mockLangs, DEFAULT_THEME);
const repos = renderRepos(mockRepos as any, DEFAULT_THEME);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>github-stats preview</title>
<style>
  body { background: #030620; font-family: sans-serif; padding: 32px; display: flex; flex-direction: column; gap: 24px; }
  h2 { color: #0d87cd; margin: 0 0 8px; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; }
  .widget { display: inline-block; }
</style>
</head>
<body>
  <div class="widget"><h2>/profile</h2>${profile}</div>
  <div class="widget"><h2>/stats</h2>${stats}</div>
  <div class="widget"><h2>/langs</h2>${langs}</div>
  <div class="widget"><h2>/repos</h2>${repos}</div>
</body>
</html>`;

writeFileSync('preview.html', html);
console.log('Written: preview.html');
