import type { StatsData } from '../types';
import type { Theme } from '../svg/theme';
import { THEME } from '../svg/theme';
import { svgWrapper, sectionTitle, text, formatNumber } from '../svg/utils';

interface TrophyDef {
  title: string;
  thresholds: [string, number, string][];
}

const TIER_NAMES: Record<string, string> = {
  SSS: 'Legend', SS: 'Epic', S: 'Pro', A: 'Skilled', B: 'Novice', C: 'Beginner',
};

const TROPHIES: TrophyDef[] = [
  { title: 'Commits',       thresholds: [['SSS',2000,'#fbbf24'],['SS',1000,'#f59e0b'],['S',500,'#0d87cd'],['A',200,'#22c55e'],['B',50,'#7a9cc0'],['C',1,'#4a6a8a']] },
  { title: 'Pull Requests', thresholds: [['SSS',500,'#fbbf24'],['SS',200,'#f59e0b'],['S',100,'#0d87cd'],['A',50,'#22c55e'],['B',10,'#7a9cc0'],['C',1,'#4a6a8a']] },
  { title: 'Issues',        thresholds: [['SSS',300,'#fbbf24'],['SS',100,'#f59e0b'],['S',50,'#0d87cd'],['A',20,'#22c55e'],['B',5,'#7a9cc0'],['C',1,'#4a6a8a']] },
  { title: 'Stars',         thresholds: [['SSS',500,'#fbbf24'],['SS',200,'#f59e0b'],['S',50,'#0d87cd'],['A',20,'#22c55e'],['B',5,'#7a9cc0'],['C',1,'#4a6a8a']] },
  { title: 'Followers',     thresholds: [['SSS',1000,'#fbbf24'],['SS',200,'#f59e0b'],['S',100,'#0d87cd'],['A',30,'#22c55e'],['B',10,'#7a9cc0'],['C',1,'#4a6a8a']] },
  { title: 'Repos',         thresholds: [['SSS',100,'#fbbf24'],['SS',50,'#f59e0b'],['S',20,'#0d87cd'],['A',10,'#22c55e'],['B',5,'#7a9cc0'],['C',1,'#4a6a8a']] },
];

function getTier(value: number, thresholds: [string, number, string][], t: Theme): { tier: string; name: string; color: string; level: number } {
  for (let i = 0; i < thresholds.length; i++) {
    const [tier, min, color] = thresholds[i];
    if (value >= min) return { tier, name: TIER_NAMES[tier] ?? tier, color, level: thresholds.length - i };
  }
  return { tier: '—', name: '—', color: t.textDim, level: 0 };
}

export function renderTrophies(s: StatsData, theme: Theme = THEME): string {
  const W = 460, P = 20;
  const titleY = P + 14;
  const values = [s.totalCommits, s.totalPRs, s.totalIssues, s.totalStars, s.followers, s.totalRepos];
  const COLS = 3;
  const CARD_W = (W - P * 2 - 8) / COLS;
  const CARD_H = 82;
  const GAP = 8;
  const rows = Math.ceil(TROPHIES.length / COLS);
  const H = titleY + 18 + rows * (CARD_H + GAP) + P;

  const cards = TROPHIES.map((t, i) => {
    const { name, color, level } = getTier(values[i], t.thresholds, theme);
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const x = P + col * (CARD_W + GAP);
    const y = titleY + 18 + row * (CARD_H + GAP);
    const cx = x + CARD_W / 2;

    const MAX = 6;
    const dotSpacing = 10;
    const dotsStartX = cx - ((MAX - 1) * dotSpacing) / 2;
    const dotsY = y + 60;
    const dots = Array.from({ length: MAX }, (_, di) => {
      const filled = di < level;
      return filled
        ? `<circle cx="${(dotsStartX + di * dotSpacing).toFixed(1)}" cy="${dotsY}" r="2.5" fill="${color}"/>`
        : `<circle cx="${(dotsStartX + di * dotSpacing).toFixed(1)}" cy="${dotsY}" r="2.5" fill="none" stroke="${color}" stroke-width="0.8" opacity="0.3"/>`;
    }).join('');

    return `
    <rect x="${x}" y="${y}" width="${CARD_W}" height="${CARD_H}" rx="8" fill="${theme.bgCard}"/>
    <rect x="${x}" y="${y}" width="${CARD_W}" height="${CARD_H}" rx="8" fill="none" stroke="${color}" stroke-width="1" opacity="0.3"/>
    <circle cx="${cx}" cy="${y + 18}" r="11" fill="${color}" opacity="0.12"/>
    ${text(cx, y + 22, '★', { size: 14, weight: '700', fill: color, anchor: 'middle' }, theme)}
    ${text(cx, y + 40, formatNumber(values[i]), { size: 14, weight: '700', fill: color, anchor: 'middle' }, theme)}
    ${dots}
    ${text(cx, y + 74, t.title, { size: 9, fill: theme.textMuted, anchor: 'middle' }, theme)}`;
  }).join('');

  return svgWrapper(W, H, sectionTitle(P, titleY, 'Trophies', theme) + cards, 'Trophies', theme);
}
