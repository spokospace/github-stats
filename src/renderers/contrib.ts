import type { ContribData } from '../types';
import type { Theme } from '../svg/theme';
import { DEFAULT_THEME } from '../svg/theme';
import { svgWrapper, sectionTitle, text } from '../svg/utils';

const LEVEL_COLORS = ['#0d1a2e', '#0a4a7a', '#0a6ca4', '#0d87cd', '#4db8f0'];

function getLevel(count: number): number {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 10) return 3;
  return 4;
}

export function renderContrib(data: ContribData, theme: Theme = DEFAULT_THEME): string {
  const W = 460, P = 20;
  const CELL = 6, GAP = 1, STEP = CELL + GAP;
  const LABEL_W = 24;
  const gridW = W - P * 2 - LABEL_W;
  const weeks = data.weeks ?? [];
  const titleY = P + 14;
  const gridY = titleY + 20;
  const H = gridY + 7 * STEP + 30;

  const dayNames = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
  const dayLabels = dayNames.map((d, i) =>
    d ? text(P, gridY + i * STEP + CELL - 1, d, { size: 8, fill: theme.textMuted }, theme) : ''
  ).join('');

  const weekStep = weeks.length > 1 ? gridW / (weeks.length - 1) : STEP;

  const cells = weeks.map((week: any, wi: number) => {
    const days = week.contributionDays ?? [];
    return days.map((day: any, di: number) => {
      const count = day.contributionCount ?? 0;
      const level = getLevel(count);
      return `<rect x="${P + LABEL_W + Math.round(wi * weekStep)}" y="${gridY + di * STEP}" width="${CELL}" height="${CELL}" rx="1" fill="${LEVEL_COLORS[level]}"><title>${day.date}: ${count} contributions</title></rect>`;
    }).join('');
  }).join('');

  const totalText = text(P, H - 8, `${data.total ?? 0} contributions this year`, { size: 10, fill: theme.textMuted }, theme);

  const inner = `
${sectionTitle(P, titleY, 'Contribution Graph', theme)}
${dayLabels}
${cells}
${totalText}`;

  return svgWrapper(W, H, inner, 'Contribution Graph', theme);
}

// theme support v2
