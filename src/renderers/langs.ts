import type { LangData } from '../types';
import { THEME, langColor } from '../svg/theme';
import { svgWrapper, sectionTitle, text, progressBar, formatNumber } from '../svg/utils';

export function renderLangs(langs: LangData, theme = THEME): string {
  const W = 460, P = 20;
  const entries = Object.entries(langs);
  const total = entries.reduce((s, [, v]) => s + v, 0);
  if (!total) return '<svg xmlns="http://www.w3.org/2000/svg"/>';

  const BAR_H = 8;
  const ROW_H = 24;
  const COLS = 2;
  const rows = Math.ceil(entries.length / COLS);
  const titleY = P + 14;
  const barY = titleY + 18;
  const legendY = barY + BAR_H + 18;
  const H = legendY + rows * ROW_H + P;
  const barW = W - P * 2;

  // Segmented bar
  let barX = P;
  const barSegs = entries.map(([lang, bytes]) => {
    const w = Math.max(2, Math.round((bytes / total) * barW));
    const seg = `<rect x="${barX}" y="${barY}" width="${w}" height="${BAR_H}" fill="${langColor(lang)}" rx="2"/>`;
    barX += w;
    return seg;
  }).join('');

  // Legend rows — two columns with explicit gap so pct text and circle don't collide
  const COL_GAP = 24;
  const colW = (barW - COL_GAP) / COLS;
  const legend = entries.map(([lang, bytes], i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const x = P + col * (colW + COL_GAP);
    const y = legendY + row * ROW_H;
    const pct = ((bytes / total) * 100).toFixed(1) + '%';
    return `<circle cx="${x + 6}" cy="${y + 4}" r="5" fill="${langColor(lang)}"/>
${text(x + 16, y + 8, lang, { size: 11 })}
${text(x + colW - 2, y + 8, pct, { size: 11, fill: theme.textMuted, anchor: 'end' }, theme)}`;

  }).join('');

  const inner = `
${sectionTitle(P, titleY, 'Most Used Languages', theme)}
<rect x="${P}" y="${barY}" width="${barW}" height="${BAR_H}" rx="4" fill="${theme.bgBar}"/>
${barSegs}
${legend}`;

  return svgWrapper(W, H, inner, 'Most Used Languages', theme);
}

// theme-aware
