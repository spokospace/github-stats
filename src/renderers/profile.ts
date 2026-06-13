import type { StatsData, StreakData } from '../types';
import type { Theme } from '../svg/theme';
import { THEME } from '../svg/theme';
import { svgWrapper, sectionTitle, text, formatNumber, progressBar } from '../svg/utils';

function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

function starField(count: number, x1: number, y1: number, color: string): string {
  const rng = makeRng(0xc0ffee42);
  return Array.from({ length: count }, () => {
    const x = (rng() * x1).toFixed(1);
    const y = (rng() * y1).toFixed(1);
    const r = (rng() * 1.0 + 0.2).toFixed(1);
    const op = rng() * 0.35 + 0.12;
    const twinkle = rng() < 0.25;
    const dur = (3 + rng() * 6).toFixed(1);
    const begin = (rng() * 9).toFixed(1);
    const opStr = op.toFixed(2);
    const dimStr = (op * 0.42).toFixed(2);
    if (twinkle) {
      return `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity="${opStr}"><animate attributeName="opacity" values="${opStr};${dimStr};${opStr}" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/></circle>`;
    }
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity="${opStr}"/>`;
  }).join('');
}

interface OrbDot { r: number; startDeg: number; dur: string; size: number; fill: string; id: string; label: string; value: string; }

function renderOrbDot(cx: number, cy: number, d: OrbDot): string {
  const from = `${d.startDeg} ${cx} ${cy}`;
  const to = `${d.startDeg + 360} ${cx} ${cy}`;
  return `<g>
    <animateTransform attributeName="transform" type="rotate" from="${from}" to="${to}" dur="${d.dur}" repeatCount="indefinite"/>
    <circle class="odot odot-${d.id}" cx="${cx + d.r}" cy="${cy}" r="8" fill="transparent"/>
    <circle cx="${cx + d.r}" cy="${cy}" r="${d.size}" fill="${d.fill}" filter="url(#pglow)" style="pointer-events:none"/>
  </g>`;
}

function renderOrbLabel(cx: number, y: number, d: OrbDot): string {
  return `<g class="olabel olabel-${d.id}">
    <text x="${cx}" y="${y}" text-anchor="middle" font-family="ui-monospace,SFMono-Regular,monospace"><tspan font-size="7" fill="${d.fill}" opacity="0.6" letter-spacing="1">${d.label.toUpperCase()} </tspan><tspan font-size="12" font-weight="700" fill="${d.fill}">${d.value}</tspan></text>
  </g>`;
}

function dotR(raw: number, max: number): number {
  return 2.2 + Math.min(1, raw / max) * 3.0;
}

function cursorUrl(color: string): string {
  const c = color.replace('#', '%23');
  const svg = `%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Cline x1='10' y1='0' x2='10' y2='20' stroke='${c}' stroke-width='1.5'/%3E%3Cline x1='0' y1='10' x2='20' y2='10' stroke='${c}' stroke-width='1.5'/%3E%3Ccircle cx='10' cy='10' r='3' fill='none' stroke='${c}' stroke-width='1'/%3E%3C/svg%3E`;
  return `url("data:image/svg+xml,${svg}") 10 10, crosshair`;
}

function radarSweep(cx: number, cy: number, r: number, color: string): string {
  const toRad = (d: number) => d * Math.PI / 180;
  const px = (d: number) => (cx + r * Math.cos(toRad(d))).toFixed(2);
  const py = (d: number) => (cy + r * Math.sin(toRad(d))).toFixed(2);
  const sec = (a1: number, a2: number, op: string) =>
    `<path d="M ${cx} ${cy} L ${px(a1)} ${py(a1)} A ${r} ${r} 0 0 0 ${px(a2)} ${py(a2)} Z" fill="${color}" opacity="${op}"/>`;
  return `<g filter="url(#pglow)" style="pointer-events:none">
    <animateTransform attributeName="transform" type="rotate" from="0 ${cx} ${cy}" to="360 ${cx} ${cy}" dur="5s" repeatCount="indefinite"/>
    ${sec(  0, -12, '0.28')}
    ${sec(-12, -24, '0.18')}
    ${sec(-24, -36, '0.11')}
    ${sec(-36, -48, '0.06')}
    ${sec(-48, -60, '0.03')}
    <line x1="${cx}" y1="${cy}" x2="${px(0)}" y2="${py(0)}" stroke="${color}" stroke-width="1.6" opacity="0.9"/>
    <circle cx="${px(0)}" cy="${py(0)}" r="2.5" fill="${color}" opacity="0.9"/>
  </g>`;
}

export function renderProfile(s: StatsData, streak: StreakData, theme: Theme = THEME, hide: Set<string> = new Set(), avatar = false): string {
  const W = 460, H = 200;
  const CX = 356, CY = 100; // orbital center
  const AVATAR_R = 26;

  const stars = starField(55, W, H, 'white');

  const avatarClip = avatar && s.avatarUrl
    ? `<clipPath id="avClip"><circle cx="${CX}" cy="${CY}" r="${AVATAR_R}"/></clipPath>`
    : '';

  const styles = `<style>
    @keyframes glow-core { 0%,100%{opacity:.95}50%{opacity:.45} }
    .pcore { animation: glow-core 2.5s ease-in-out infinite; }
    .olabel { opacity:0; pointer-events:none; transition:opacity .15s; }
    .odot { cursor:${cursorUrl(theme.primary)}; }
    svg:has(.odot-streak:hover)   .olabel-streak,
    svg:has(.odot-commits:hover)  .olabel-commits,
    svg:has(.odot-prs:hover)      .olabel-prs,
    svg:has(.odot-stars:hover)    .olabel-stars,
    svg:has(.odot-repos:hover)    .olabel-repos,
    svg:has(.odot-followers:hover).olabel-followers { opacity:1; }
  </style>`;

  const defs = `<defs>
    <radialGradient id="pbg" cx="${CX}" cy="${CY}" r="92" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${theme.primary}" stop-opacity=".13"/>
      <stop offset="100%" stop-color="${theme.bg}" stop-opacity="0"/>
    </radialGradient>
    <filter id="pglow" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <clipPath id="orbClip"><circle cx="${CX}" cy="${CY}" r="76"/></clipPath>
    ${avatarClip}
  </defs>`;

  // Center piece: avatar image or glowing core
  const center = avatar && s.avatarUrl
    ? `<image href="${s.avatarUrl}" x="${CX - AVATAR_R}" y="${CY - AVATAR_R}" width="${AVATAR_R * 2}" height="${AVATAR_R * 2}" clip-path="url(#avClip)" opacity=".92"/>
  <circle cx="${CX}" cy="${CY}" r="${AVATAR_R}" fill="none" stroke="${theme.primary}" stroke-width="1.5" opacity=".7"/>
  <circle cx="${CX}" cy="${CY}" r="${AVATAR_R + 4}" fill="none" stroke="${theme.primary}" stroke-width=".6" stroke-dasharray="3,3" opacity=".4"/>`
    : `<circle class="pcore" cx="${CX}" cy="${CY}" r="11" fill="${theme.primary}" filter="url(#pglow)"/>
  <circle cx="${CX}" cy="${CY}" r="5" fill="white" opacity=".95"/>`;

  const D = 54; // 76 * cos(45°) ≈ 53.7
  const gOff = Array.from({ length: 12 }, (_, i) => -80 + i * 16);
  const gridBg = `<g clip-path="url(#orbClip)" opacity="0.07">
    ${gOff.map(d => `<line x1="${CX + d}" y1="${CY - 76}" x2="${CX + d}" y2="${CY + 76}" stroke="${theme.primary}" stroke-width="0.5"/>`).join('')}
    ${gOff.map(d => `<line x1="${CX - 76}" y1="${CY + d}" x2="${CX + 76}" y2="${CY + d}" stroke="${theme.primary}" stroke-width="0.5"/>`).join('')}
  </g>`;

  const dots: OrbDot[] = [
    { r: 30, startDeg: 0,   dur: '28s', size: dotR(streak.currentStreak, 60),   fill: '#a78bfa',        id: 'streak',    label: 'Streak',       value: `${streak.currentStreak} days` },
    { r: 53, startDeg: 0,   dur: '48s', size: dotR(s.totalCommits, 1500), fill: theme.primary,    id: 'commits',   label: 'Commits',      value: formatNumber(s.totalCommits) },
    { r: 53, startDeg: 180, dur: '48s', size: dotR(s.totalPRs, 200),     fill: theme.success,    id: 'prs',       label: 'Pull Requests', value: formatNumber(s.totalPRs) },
    { r: 76, startDeg: 0,   dur: '75s', size: dotR(s.totalStars, 500),   fill: theme.warning,    id: 'stars',     label: 'Stars',        value: formatNumber(s.totalStars) },
    { r: 76, startDeg: 120, dur: '75s', size: dotR(s.totalRepos, 50),    fill: theme.textMuted,  id: 'repos',     label: 'Repos',        value: String(s.totalRepos) },
    { r: 76, startDeg: 240, dur: '75s', size: dotR(s.followers, 200),    fill: theme.textMuted,  id: 'followers', label: 'Followers',    value: String(s.followers) },
  ];
  const dotsSvg = dots.map(d => renderOrbDot(CX, CY, d)).join('');
  const labelsSvg = dots.map(d => renderOrbLabel(CX, H - 8, d)).join('');

  const orb = `
  <rect x="${CX - 92}" y="${CY - 92}" width="196" height="196" rx="98" fill="url(#pbg)"/>
  ${gridBg}
  <line x1="${CX - 76}" y1="${CY}" x2="${CX + 76}" y2="${CY}" stroke="${theme.primary}" stroke-width="0.4" opacity="0.18"/>
  <line x1="${CX}" y1="${CY - 76}" x2="${CX}" y2="${CY + 76}" stroke="${theme.primary}" stroke-width="0.4" opacity="0.18"/>
  <line x1="${CX - D}" y1="${CY - D}" x2="${CX + D}" y2="${CY + D}" stroke="${theme.primary}" stroke-width="0.4" opacity="0.12"/>
  <line x1="${CX + D}" y1="${CY - D}" x2="${CX - D}" y2="${CY + D}" stroke="${theme.primary}" stroke-width="0.4" opacity="0.12"/>
  <circle cx="${CX}" cy="${CY}" r="30" fill="none" stroke="${theme.primary}" stroke-width="1.2" opacity=".45"/>
  <circle cx="${CX}" cy="${CY}" r="53" fill="none" stroke="${theme.primary}" stroke-width=".8" opacity=".28"/>
  <circle cx="${CX}" cy="${CY}" r="76" fill="none" stroke="${theme.primary}" stroke-width=".5" opacity=".18"/>
  <g clip-path="url(#orbClip)" filter="url(#pglow)">
    <circle cx="${CX}" cy="${CY}" r="0" fill="none" stroke="${theme.primary}" stroke-width="2">
      <animate attributeName="r" from="0" to="76" dur="3s" begin="0s" repeatCount="indefinite" calcMode="spline" keyTimes="0;1" keySplines="0.4 0 0.6 1"/>
      <animate attributeName="opacity" values="0.65;0.25;0" keyTimes="0;0.6;1" dur="3s" begin="0s" repeatCount="indefinite"/>
      <animate attributeName="stroke-width" from="2.5" to="0.4" dur="3s" begin="0s" repeatCount="indefinite" calcMode="spline" keyTimes="0;1" keySplines="0.4 0 0.6 1"/>
    </circle>
    <circle cx="${CX}" cy="${CY}" r="0" fill="none" stroke="${theme.primary}" stroke-width="2">
      <animate attributeName="r" from="0" to="76" dur="3s" begin="1.5s" repeatCount="indefinite" calcMode="spline" keyTimes="0;1" keySplines="0.4 0 0.6 1"/>
      <animate attributeName="opacity" values="0.65;0.25;0" keyTimes="0;0.6;1" dur="3s" begin="1.5s" repeatCount="indefinite"/>
      <animate attributeName="stroke-width" from="2.5" to="0.4" dur="3s" begin="1.5s" repeatCount="indefinite" calcMode="spline" keyTimes="0;1" keySplines="0.4 0 0.6 1"/>
    </circle>
  </g>
  ${dotsSvg}
  ${radarSweep(CX, CY, 76, theme.primary)}
  ${center}
  ${labelsSvg}`;

  const divX = 242;
  const divider = `<line x1="${divX}" y1="14" x2="${divX}" y2="${H - 14}" stroke="${theme.border}" stroke-width="1"/>`;

  const STAT_X = 22;
  const STAT_W = 196; // label→value width; right edge at x=218
  const STAT_START = 54;
  const STAT_ROW_H = 24;

  const STAT_MAX: Record<string, number> = {
    commits: 1500, stars: 500, prs: 200, repos: 50,
    followers: 200, streak: 60, contributions: 1000,
  };

  const ALL_STATS = [
    { key: 'commits',       label: 'Commits',       val: formatNumber(s.totalCommits),            raw: s.totalCommits,            color: theme.primary },
    { key: 'stars',         label: 'Stars',         val: formatNumber(s.totalStars),              raw: s.totalStars,              color: theme.warning },
    { key: 'prs',           label: 'Pull Requests', val: formatNumber(s.totalPRs),                raw: s.totalPRs,                color: theme.success },
    { key: 'repos',         label: 'Repos',         val: String(s.totalRepos),                    raw: s.totalRepos,              color: theme.textMuted },
    { key: 'followers',     label: 'Followers',     val: String(s.followers),                     raw: s.followers,               color: theme.textMuted },
    { key: 'streak',        label: 'Streak',        val: streak.currentStreak + ' days',          raw: streak.currentStreak,      color: '#a78bfa' },
    { key: 'contributions', label: 'Contributions', val: formatNumber(streak.totalContributions), raw: streak.totalContributions, color: theme.primary },
  ];
  const visibleStats = ALL_STATS.filter(st => !hide.has(st.key));
  const statBlocks = visibleStats.map((st, i) => {
    const y = STAT_START + i * STAT_ROW_H;
    const pct = Math.min(1, st.raw / (STAT_MAX[st.key] ?? 100));
    return `
  ${text(STAT_X, y, st.label.toUpperCase(), { size: 7.5, fill: theme.textDim, font: 'ui-monospace,SFMono-Regular,monospace' }, theme)}
  ${text(STAT_X + STAT_W, y, st.val, { size: 13, weight: '700', fill: st.color, anchor: 'end' }, theme)}
  ${progressBar(STAT_X, y + 4, STAT_W, 3, pct, st.color, theme, 0.75)}`;
  }).join('');

  const weekly = streak.weeklyContributions ?? [];
  const barChart = (() => {
    if (!weekly.length) return '';
    const maxVal = Math.max(...weekly, 1);
    const BAR_W = 6, BAR_GAP = 2, BAR_MAX_H = 10;
    const by = H - 10;
    return weekly.map((v, i) => {
      const bh = Math.max(2, Math.round(v / maxVal * BAR_MAX_H));
      const op = (0.3 + (v / maxVal) * 0.55).toFixed(2);
      return `<rect x="${STAT_X + i * (BAR_W + BAR_GAP)}" y="${by - bh}" width="${BAR_W}" height="${bh}" rx="1" fill="${theme.primary}" opacity="${op}"/>`;
    }).join('');
  })();

  const statsEl = `
  ${sectionTitle(20, 34, 'GitHub Profile', theme)}
  ${s.login ? text(STAT_X + STAT_W, 34, `@${s.login}`, { size: 9, fill: theme.textMuted, anchor: 'end', font: 'ui-monospace,SFMono-Regular,monospace' }, theme) : ''}
  ${statBlocks}
  ${barChart}`;

  const L = 20, T = 2, OR = 76, CP = 14;
  const CL = CX - OR - CP, CR = CX + OR + CP;
  const CT = CY - OR - CP, CB = CY + OR + CP;
  const c = theme.primary;
  const corners = `<g>
    <animate attributeName="opacity" values="0.45;1;0.45" dur="2.5s" repeatCount="indefinite"/>
    <line x1="${CL}" y1="${CT}" x2="${CL+L}" y2="${CT}" stroke="${c}" stroke-width="${T}" stroke-linecap="round"/>
    <line x1="${CL}" y1="${CT}" x2="${CL}" y2="${CT+L}" stroke="${c}" stroke-width="${T}" stroke-linecap="round"/>
    <line x1="${CR}" y1="${CT}" x2="${CR-L}" y2="${CT}" stroke="${c}" stroke-width="${T}" stroke-linecap="round"/>
    <line x1="${CR}" y1="${CT}" x2="${CR}" y2="${CT+L}" stroke="${c}" stroke-width="${T}" stroke-linecap="round"/>
    <line x1="${CL}" y1="${CB}" x2="${CL+L}" y2="${CB}" stroke="${c}" stroke-width="${T}" stroke-linecap="round"/>
    <line x1="${CL}" y1="${CB}" x2="${CL}" y2="${CB-L}" stroke="${c}" stroke-width="${T}" stroke-linecap="round"/>
    <line x1="${CR}" y1="${CB}" x2="${CR-L}" y2="${CB}" stroke="${c}" stroke-width="${T}" stroke-linecap="round"/>
    <line x1="${CR}" y1="${CB}" x2="${CR}" y2="${CB-L}" stroke="${c}" stroke-width="${T}" stroke-linecap="round"/>
  </g>`;

  return svgWrapper(W, H, `${styles}${defs}${stars}${divider}${statsEl}${orb}${corners}`, 'GitHub Profile', theme);
}
