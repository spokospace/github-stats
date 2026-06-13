import type { StatsData } from '../types';
import type { Theme } from '../svg/theme';
import { DEFAULT_THEME } from '../svg/theme';
import { svgWrapper, sectionTitle, text, formatNumber } from '../svg/utils';

export function renderStats(s: StatsData, theme: Theme = DEFAULT_THEME): string {
  const W = 460, P = 20;
  const titleY = P + 14;
  const H = 220;

  const items = [
    { label: 'Total Commits', value: formatNumber(s.totalCommits), color: theme.primary },
    { label: 'Pull Requests', value: formatNumber(s.totalPRs), color: '#22c55e' },
    { label: 'PRs Merged', value: formatNumber(s.mergedPRs), color: '#16a34a' },
    { label: 'PRs Reviewed', value: formatNumber(s.reviewedPRs), color: '#4ade80' },
    { label: 'Issues Opened', value: formatNumber(s.totalIssues), color: '#f59e0b' },
    { label: 'Issues Closed', value: formatNumber(s.closedIssues), color: '#d97706' },
    { label: 'Total Stars', value: formatNumber(s.totalStars), color: '#fbbf24' },
    { label: 'Total Forks', value: formatNumber(s.totalForks), color: '#fb923c' },
    { label: 'Repositories', value: formatNumber(s.totalRepos), color: theme.primary },
    { label: 'Followers', value: formatNumber(s.followers), color: '#a78bfa' },
    { label: 'Contributions', value: formatNumber(s.contributions), color: '#34d399' },
    { label: 'Discussions', value: formatNumber(s.discussionsStarted), color: '#60a5fa' },
  ];

  const COLS = 3;
  const COL_W = (W - P * 2) / COLS;
  const ROW_H = 44;
  const gridY = titleY + 18;

  const grid = items.map((item, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const x = P + col * COL_W;
    const y = gridY + row * ROW_H;
    return `
<rect x="${x + 2}" y="${y}" width="${COL_W - 8}" height="${ROW_H - 6}" rx="6" fill="${theme.bgCard}"/>
<rect x="${x + 2}" y="${y}" width="3" height="${ROW_H - 6}" rx="1.5" fill="${item.color}" opacity="0.7"/>
${text(x + 12, y + 16, item.value, { size: 16, weight: '700', fill: item.color }, theme)}
${text(x + 12, y + 30, item.label, { size: 9, fill: theme.textMuted }, theme)}`;
  }).join('');

  const inner = `
${sectionTitle(P, titleY, 'GitHub Stats', theme)}
${grid}`;

  return svgWrapper(W, H, inner, 'GitHub Stats', theme);
}
