import type { StatsData } from '../types';
import { THEME } from '../svg/theme';
import { svgWrapper, sectionTitle, text } from '../svg/utils';

interface Trophy {
  title: string;
  value: number;
  thresholds: [string, number, string][]; // [tier, min, color]
}

const TROPHIES: Omit<Trophy, 'value'>[] = [
  { title: 'Commits',      thresholds: [['SSS',2000,'#fbbf24'],['SS',1000,'#f59e0b'],['S',500,'#0d87cd'],['A',200,'#22c55e'],['B',50,'#7a9cc0'],['C',1,'#4a6a8a']] },
  { title: 'Pull Requests',thresholds: [['SSS',500,'#fbbf24'],['SS',200,'#f59e0b'],['S',100,'#0d87cd'],['A',50,'#22c55e'],['B',10,'#7a9cc0'],['C',1,'#4a6a8a']] },
  { title: 'Issues',       thresholds: [['SSS',300,'#fbbf24'],['SS',100,'#f59e0b'],['S',50,'#0d87cd'],['A',20,'#22c55e'],['B',5,'#7a9cc0'],['C',1,'#4a6a8a']] },
  { title: 'Stars',        thresholds: [['SSS',500,'#fbbf24'],['SS',200,'#f59e0b'],['S',50,'#0d87cd'],['A',20,'#22c55e'],['B',5,'#7a9cc0'],['C',1,'#4a6a8a']] },
  { title: 'Followers',    thresholds: [['SSS',1000,'#fbbf24'],['SS',200,'#f59e0b'],['S',100,'#0d87cd'],['A',30,'#22c55e'],['B',10,'#7a9cc0'],['C',1,'#4a6a8a']] },
  { title: 'Repos',        thresholds: [['SSS',100,'#fbbf24'],['SS',50,'#f59e0b'],['S',20,'#0d87cd'],['A',10,'#22c55e'],['B',5,'#7a9cc0'],['C',1,'#4a6a8a']] },
];

import type { Theme } from '../svg/theme';

function getTier(value: number, thresholds: [string, number, string][], t: Theme): { tier: string; color: string } {
  for (const [tier, min, color] of thresholds) {
    if (value >= min) return { tier, color };
  }
  return { tier: '—', color: t.textDim };
}

export function renderTrophies(s: StatsData, theme: Theme = THEME): string {
  const W = 460, P = 20;
  const titleY = P + 14;
  const values = [s.totalCommits, s.totalPRs, s.totalIssues, s.totalStars, s.followers, s.totalRepos];
  const COLS = 3;
  const CARD_W = (W - P * 2 - 8) / COLS;
  const CARD_H = 72;
  const GAP = 8;
  const rows = Math.ceil(TROPHIES.length / COLS);
  const H = titleY + 18 + rows * (CARD_H + GAP) + P;

  const cards = TROPHIES.map((t, i) => {
    const { tier, color } = getTier(values[i], t.thresholds as [string,number,string][], theme);
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const x = P + col * (CARD_W + GAP);
    const y = titleY + 18 + row * (CARD_H + GAP);
    const cx = x + CARD_W / 2;
    return `
    <rect x="${x}" y="${y}" width="${CARD_W}" height="${CARD_H}" rx="8" fill="${theme.bgCard}"/>
    <rect x="${x}" y="${y}" width="${CARD_W}" height="${CARD_H}" rx="8" fill="none" stroke="${color}" stroke-width="1" opacity="0.3"/>
    <circle cx="${cx}" cy="${y + 22}" r="12" fill="${color}" opacity="0.12"/>
    ${text(cx, y + 26, '★', { size: 15, weight: '700', fill: color, anchor: 'middle' }, theme)}
    ${text(cx, y + 45, tier, { size: 13, weight: '700', fill: color, anchor: 'middle' }, theme)}
    ${text(cx, y + 59, t.title, { size: 9, fill: theme.textMuted, anchor: 'middle' }, theme)}`;
  }).join('');

  return svgWrapper(W, H, sectionTitle(P, titleY, 'Trophies', theme) + cards, 'Trophies', theme);
}

// theme support
