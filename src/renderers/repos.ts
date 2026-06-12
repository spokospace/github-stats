import type { RepoData } from '../types';
import { THEME } from '../svg/theme';
import { svgWrapper, sectionTitle, text, esc } from '../svg/utils';

export function renderRepos(repos: RepoData[]): string {
  const W = 460, P = 20;
  const titleY = P + 14;
  const COLS = 2;
  const CARD_W = (W - P * 2 - 8) / COLS;
  const CARD_H = 88;
  const GAP = 8;
  const rows = Math.ceil(repos.length / COLS);
  const H = titleY + 18 + rows * (CARD_H + GAP) + P;

  const cards = repos.map((r, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const x = P + col * (CARD_W + GAP);
    const y = titleY + 18 + row * (CARD_H + GAP);
    const desc = r.description ? (r.description.length > 52 ? r.description.slice(0, 49) + '...' : r.description) : 'No description';
    const langDot = r.language ? `<circle cx="${x + 12}" cy="${y + CARD_H - 18}" r="5" fill="${r.languageColor ?? THEME.primary}"/>
    ${text(x + 22, y + CARD_H - 13, r.language, { size: 10, fill: THEME.textMuted })}` : '';

    return `
    <rect x="${x}" y="${y}" width="${CARD_W}" height="${CARD_H}" rx="8" fill="${THEME.bgCard}"/>
    <rect x="${x}" y="${y}" width="${CARD_W}" height="${CARD_H}" rx="8" fill="none" stroke="${THEME.border}" stroke-width="1"/>
    ${text(x + 12, y + 20, `${r.owner}/${r.name}`, { size: 12, weight: '600', fill: THEME.primary })}
    ${text(x + 12, y + 36, esc(desc), { size: 10, fill: THEME.textMuted })}
    ${langDot}
    ${text(x + CARD_W - 12, y + CARD_H - 13, '★ ' + r.stars, { size: 10, fill: THEME.textMuted, anchor: 'end' })}`;
  }).join('');

  return svgWrapper(W, H, sectionTitle(P, titleY, 'Featured Repositories') + cards, 'Featured Repositories');
}
