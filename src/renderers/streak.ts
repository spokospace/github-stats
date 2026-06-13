import type { StreakData } from '../types';
import { THEME } from '../svg/theme';
import { svgWrapper, sectionTitle, text, formatNumber } from '../svg/utils';

function fmtDate(d: string): string {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function renderStreak(s: StreakData, theme = THEME): string {
  const W = 460, P = 20;
  const titleY = P + 14;
  const H = 140;

  const COLS = 3;
  const COL_W = (W - P * 2) / COLS;
  const blockY = titleY + 22;

  const blocks = [
    {
      big: formatNumber(s.totalContributions),
      label: 'Total Contributions',
      sub: s.firstContribution ? `Since ${fmtDate(s.firstContribution)}` : '—',
      color: theme.primary,
    },
    {
      big: String(s.currentStreak),
      label: 'Current Streak',
      sub: s.currentStreak > 0 && s.currentStreakStart && s.currentStreakEnd ? `${fmtDate(s.currentStreakStart)} – ${fmtDate(s.currentStreakEnd)}` : 'No active streak',
      color: '#22c55e',
    },
    {
      big: String(s.longestStreak),
      label: 'Longest Streak',
      sub: s.longestStreak > 0 && s.longestStreakStart && s.longestStreakEnd ? `${fmtDate(s.longestStreakStart)} – ${fmtDate(s.longestStreakEnd)}` : '—',
      color: '#f59e0b',
    },
  ];

  const grid = blocks.map((b, i) => {
    const x = P + i * COL_W;
    const cx = x + COL_W / 2;
    return `
    <rect x="${x + 2}" y="${blockY}" width="${COL_W - 8}" height="82" rx="8" fill="${theme.bgCard}"/>
    ${text(cx, blockY + 32, b.big, { size: 28, weight: '700', fill: b.color, anchor: 'middle' }, theme)}
    ${text(cx, blockY + 50, b.label, { size: 11, fill: theme.text, anchor: 'middle' }, theme)}
    ${text(cx, blockY + 66, b.sub, { size: 9, fill: theme.textMuted, anchor: 'middle' }, theme)}`;
  }).join('');

  const inner = `
  ${sectionTitle(P, titleY, 'Contribution Streak')}
  ${grid}`;

  return svgWrapper(W, H, inner, 'Contribution Streak', theme);
}
