import { THEME } from './theme';

export function svgWrapper(width: number, height: number, inner: string, title?: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img"${title ? ` aria-label="${title}"` : ''}>
  <rect width="${width}" height="${height}" rx="${THEME.radius}" fill="${THEME.bg}"/>
  <rect x="0" y="0" width="${width}" height="${height}" rx="${THEME.radius}" fill="none" stroke="${THEME.border}" stroke-width="1"/>
  ${inner}
</svg>`;
}

export function sectionTitle(x: number, y: number, label: string): string {
  return `<rect x="${x}" y="${y - 12}" width="3" height="14" rx="1.5" fill="${THEME.primary}"/>
  <text x="${x + 10}" y="${y}" fill="${THEME.text}" font-size="13" font-weight="600" font-family="${THEME.font}">${label}</text>`;
}

export function text(x: number, y: number, content: string, opts: {
  size?: number; weight?: string; fill?: string; anchor?: string; opacity?: number;
} = {}): string {
  const { size = 12, weight = 'normal', fill = THEME.text, anchor = 'start', opacity } = opts;
  const opacityAttr = opacity !== undefined ? ` opacity="${opacity}"` : '';
  return `<text x="${x}" y="${y}" fill="${fill}" font-size="${size}" font-weight="${weight}" font-family="${THEME.font}" text-anchor="${anchor}"${opacityAttr}>${esc(content)}</text>`;
}

export function esc(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function progressBar(x: number, y: number, width: number, height: number, pct: number, color: string): string {
  const filled = Math.max(2, Math.round(width * Math.min(pct, 1)));
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${height / 2}" fill="${THEME.bgBar}"/>
  <rect x="${x}" y="${y}" width="${filled}" height="${height}" rx="${height / 2}" fill="${color}"/>`;
}

export function badge(x: number, y: number, label: string, color: string): string {
  const w = label.length * 7 + 16;
  return `<rect x="${x}" y="${y - 11}" width="${w}" height="16" rx="8" fill="${color}" opacity="0.15"/>
  <rect x="${x}" y="${y - 11}" width="${w}" height="16" rx="8" fill="none" stroke="${color}" stroke-width="1" opacity="0.4"/>
  ${text(x + w / 2, y, label, { size: 10, fill: color, anchor: 'middle' })}`;
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'k';
  return String(n);
}

export function statBlock(x: number, y: number, label: string, value: string | number, color = THEME.primary): string {
  return `${text(x, y, String(value), { size: 22, weight: '700', fill: color })}
  ${text(x, y + 16, String(label), { size: 10, fill: THEME.textMuted })}`;
}
