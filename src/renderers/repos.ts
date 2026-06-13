import type { RepoData } from '../types';
import type { Theme } from '../svg/theme';
import { THEME } from '../svg/theme';
import { svgWrapper, sectionTitle, text } from '../svg/utils';

function truncate(str: string, max: number): string {
  return str.length <= max ? str : str.slice(0, max - 1) + '…';
}

function wrapDesc(desc: string, maxChars = 32): [string, string] {
  if (desc.length <= maxChars) return [desc, ''];
  const cut = desc.lastIndexOf(' ', maxChars);
  if (cut < 8) return [desc.slice(0, maxChars) + '…', ''];
  const line1 = desc.slice(0, cut);
  const rest = desc.slice(cut + 1);
  return [line1, rest.length > maxChars ? rest.slice(0, maxChars - 1) + '…' : rest];
}

export function renderRepos(repos: RepoData[], theme: Theme = THEME): string {
  const W = 460, P = 20;
  const titleY = P + 14;
  const COLS = 2;
  const CARD_W = (W - P * 2 - 8) / COLS;
  const CARD_H = 96;
  const GAP = 8;
  const rows = Math.ceil(repos.length / COLS);
  const H = titleY + 18 + rows * (CARD_H + GAP) + P;

  const cards = repos.map((r, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const x = P + col * (CARD_W + GAP);
    const y = titleY + 18 + row * (CARD_H + GAP);
    const rawDesc = r.description ?? 'No description';
    const [line1, line2] = wrapDesc(rawDesc, 34);
    const langDot = r.language ? `<circle cx="${x + 12}" cy="${y + CARD_H - 18}" r="5" fill="${r.languageColor ?? theme.primary}"/>
    ${text(x + 22, y + CARD_H - 13, r.language, { size: 10, fill: theme.textMuted }, theme)}` : '';

    return `
    <rect x="${x}" y="${y}" width="${CARD_W}" height="${CARD_H}" rx="8" fill="${theme.bgCard}"/>
    <rect x="${x}" y="${y}" width="${CARD_W}" height="${CARD_H}" rx="8" fill="none" stroke="${theme.border}" stroke-width="1"/>
    ${text(x + 12, y + 20, truncate(`${r.owner}/${r.name}`, 27), { size: 12, weight: '600', fill: theme.primary }, theme)}
    ${text(x + 12, y + 36, line1, { size: 10, fill: theme.textMuted }, theme)}
    ${text(x + 12, y + 50, line2 || ' ', { size: 10, fill: theme.textMuted }, theme)}
    ${langDot}
    ${text(x + CARD_W - 12, y + CARD_H - 13, '★ ' + r.stars, { size: 10, fill: theme.textMuted, anchor: 'end' }, theme)}`;
  }).join('');

  return svgWrapper(W, H, sectionTitle(P, titleY, 'Featured Repositories', theme) + cards, 'Featured Repositories', theme);
}
