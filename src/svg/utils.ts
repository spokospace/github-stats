import type { Theme, TechIcon } from './theme';
import { THEME as DEFAULT } from './theme';

// All util functions accept an optional theme param; fallback to DEFAULT

export function svgWrapper(w: number, h: number, inner: string, title?: string, t: Theme = DEFAULT): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img"${title ? ` aria-label="${title}"` : ''}>
<rect width="${w}" height="${h}" rx="${t.radius}" fill="${t.bg}"/>
<rect x="0" y="0" width="${w}" height="${h}" rx="${t.radius}" fill="none" stroke="${t.border}" stroke-width="1"/>
${inner}
</svg>`;
}

export function sectionTitle(x: number, y: number, label: string, t: Theme = DEFAULT): string {
  return `<rect x="${x}" y="${y - 12}" width="3" height="14" rx="1.5" fill="${t.primary}"/>
<text x="${x + 10}" y="${y}" fill="${t.text}" font-size="13" font-weight="600" font-family="${t.font}">${label}</text>`;
}

export function text(x: number, y: number, content: string, opts: {
  size?: number; weight?: string; fill?: string; anchor?: string; opacity?: number; font?: string;
} = {}, t: Theme = DEFAULT): string {
  const { size = 12, weight = 'normal', fill = t.text, anchor = 'start', opacity, font } = opts;
  const op = opacity !== undefined ? ` opacity="${opacity}"` : '';
  return `<text x="${x}" y="${y}" fill="${fill}" font-size="${size}" font-weight="${weight}" font-family="${font ?? t.font}" text-anchor="${anchor}"${op}>${esc(content)}</text>`;
}

export function esc(s: string): string {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

const SVG_KEYWORDS = new Set(['transparent', 'none', 'currentcolor']);

export function normalizeHex(v: string | null | undefined, fallback: string): string {
  if (!v) return fallback;
  if (SVG_KEYWORDS.has(v.toLowerCase()) || v.startsWith('#')) return v;
  return '#' + v;
}

function luminance(hex: string): number {
  if (!hex.startsWith('#')) return 0;
  const n = parseInt(hex.replace('#', ''), 16);
  const [r, g, b] = [n >> 16, (n >> 8) & 0xff, n & 0xff]
    .map(c => { const s = c / 255; return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(hex1: string, hex2: string): number {
  const l1 = luminance(hex1), l2 = luminance(hex2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

function a11yColor(fg: string, bg: string, fallback: string): string {
  return contrastRatio(fg, bg) >= 4.5 ? fg : fallback;
}

export function progressBar(x: number, y: number, width: number, height: number, pct: number, color: string, t: Theme = DEFAULT, opacity = 1): string {
  const filled = Math.max(2, Math.round(width * Math.min(pct, 1)));
  const op = opacity < 1 ? ` opacity="${opacity}"` : '';
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${height / 2}" fill="${t.bgBar}"/>
<rect x="${x}" y="${y}" width="${filled}" height="${height}" rx="${height / 2}" fill="${color}"${op}/>`;
}

export function badge(x: number, y: number, label: string, color: string, t: Theme = DEFAULT): string {
  const w = label.length * 7 + 16;
  return `<rect x="${x}" y="${y - 11}" width="${w}" height="16" rx="8" fill="${color}" opacity="0.15"/>
<rect x="${x}" y="${y - 11}" width="${w}" height="16" rx="8" fill="none" stroke="${color}" stroke-width="1" opacity="0.4"/>
${text(x + w / 2, y, label, { size: 10, fill: color, anchor: 'middle' }, t)}`;
}

// spoko.space-style chip: colored icon + monospace label on dark pill
export function chip(x: number, y: number, label: string, color: string, icon: TechIcon | null, t: Theme = DEFAULT): string {
  const ICON = 14, PAD_X = 8, PAD_Y = 5, GAP = icon ? 5 : 0;
  const textW = label.length * 7.2;
  const w = PAD_X * 2 + (icon ? ICON + GAP : 0) + textW;
  const h = ICON + PAD_Y * 2;
  let iconEl = '';
  if (icon?.raw) {
    // Multi-color logo body with its own viewBox — embed in a nested svg that scales to fit.
    iconEl = `<svg x="${x + PAD_X}" y="${y + PAD_Y}" width="${ICON}" height="${ICON}" viewBox="${icon.viewBox}">${icon.path}</svg>`;
  } else if (icon) {
    iconEl = `<g transform="translate(${x + PAD_X},${y + PAD_Y}) scale(${ICON / 24})"><path d="${icon.path}" fill="${color}"/></g>`;
  }
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${t.bgCard}" stroke="${color}" stroke-width="0.75" stroke-opacity="0.4"/>
${iconEl}
${text(x + PAD_X + (icon ? ICON + GAP : 0), y + h / 2 + 4, label, { size: 11, fill: t.text, font: 'ui-monospace,SFMono-Regular,monospace' }, t)}`;
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'k';
  return String(n);
}

export function statBlock(x: number, y: number, label: string, value: string | number, color = DEFAULT.primary, t: Theme = DEFAULT): string {
  return `${text(x, y, String(value), { size: 22, weight: '700', fill: color }, t)}
${text(x, y + 16, String(label), { size: 10, fill: t.textMuted }, t)}`;
}
