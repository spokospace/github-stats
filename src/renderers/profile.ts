import type { StatsData, StreakData } from '../types';
import type { Theme } from '../svg/theme';
import { THEME } from '../svg/theme';
import { svgWrapper, text, formatNumber, statBlock } from '../svg/utils';

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
    const op = (rng() * 0.35 + 0.12).toFixed(2);
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity="${op}"/>`;
  }).join('');
}

function orbitDot(cx: number, cy: number, r: number, startDeg: number, dur: string, dotR: number, fill: string): string {
  const from = `${startDeg} ${cx} ${cy}`;
  const to = `${startDeg + 360} ${cx} ${cy}`;
  return `<g><animateTransform attributeName="transform" type="rotate" from="${from}" to="${to}" dur="${dur}" repeatCount="indefinite"/>
  <circle cx="${cx + r}" cy="${cy}" r="${dotR}" fill="${fill}"/></g>`;
}

export function renderProfile(s: StatsData, streak: StreakData, theme: Theme = THEME): string {
  const W = 460, H = 200;
  const CX = 356, CY = 100; // orbital center

  const stars = starField(55, W, H, 'white');

  const styles = `<style>
    @keyframes pulse-ring {
      0%,100% { opacity: .5; } 50% { opacity: .12; }
    }
    @keyframes glow-core {
      0%,100% { opacity: .95; } 50% { opacity: .45; }
    }
    .pr1 { animation: pulse-ring 3.5s ease-in-out infinite; }
    .pr2 { animation: pulse-ring 3.5s ease-in-out infinite .85s; }
    .pr3 { animation: pulse-ring 3.5s ease-in-out infinite 1.7s; }
    .pcore { animation: glow-core 2.5s ease-in-out infinite; }
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
  </defs>`;

  const orb = `
  <rect x="${CX - 92}" y="${CY - 92}" width="196" height="196" rx="98" fill="url(#pbg)"/>
  <circle class="pr1" cx="${CX}" cy="${CY}" r="30" fill="none" stroke="${theme.primary}" stroke-width="1.2"/>
  <circle class="pr2" cx="${CX}" cy="${CY}" r="53" fill="none" stroke="${theme.primary}" stroke-width=".8"/>
  <circle class="pr3" cx="${CX}" cy="${CY}" r="76" fill="none" stroke="${theme.primary}" stroke-width=".5"/>
  ${orbitDot(CX, CY, 30, 0, '9s', 3.5, theme.primary)}
  ${orbitDot(CX, CY, 53, 0, '16s', 2.8, theme.success)}
  ${orbitDot(CX, CY, 53, 180, '16s', 2.8, theme.success)}
  ${orbitDot(CX, CY, 76, 0, '25s', 2.2, theme.warning)}
  ${orbitDot(CX, CY, 76, 120, '25s', 2.2, theme.warning)}
  ${orbitDot(CX, CY, 76, 240, '25s', 2.2, theme.warning)}
  <circle class="pcore" cx="${CX}" cy="${CY}" r="11" fill="${theme.primary}" filter="url(#pglow)"/>
  <circle cx="${CX}" cy="${CY}" r="5" fill="white" opacity=".95"/>`;

  const divX = 242;
  const divider = `<line x1="${divX}" y1="14" x2="${divX}" y2="${H - 14}" stroke="${theme.border}" stroke-width="1"/>`;

  const C1 = 22, C2 = 136;
  const R1 = 62, R2 = 108, R3 = 154;

  const statsEl = `
  ${text(C1, 32, 'GITHUB STATS', { size: 9.5, fill: theme.primary, font: 'ui-monospace,SFMono-Regular,monospace' }, theme)}
  <rect x="${C1}" y="37" width="198" height="1" fill="${theme.border}"/>
  ${statBlock(C1, R1, 'Commits', formatNumber(s.totalCommits), theme.primary, theme)}
  ${statBlock(C2, R1, 'Stars', '★ ' + formatNumber(s.totalStars), theme.warning, theme)}
  ${statBlock(C1, R2, 'Pull Requests', formatNumber(s.totalPRs), theme.success, theme)}
  ${statBlock(C2, R2, 'Streak', streak.currentStreak + ' days', '#a78bfa', theme)}
  ${statBlock(C1, R3, 'Contributions', formatNumber(streak.totalContributions), theme.primary, theme)}
  ${statBlock(C2, R3, 'Repos', String(s.totalRepos), theme.textMuted, theme)}`;

  return svgWrapper(W, H, `${styles}${defs}${stars}${divider}${statsEl}${orb}`, 'GitHub Profile', theme);
}
