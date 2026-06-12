import type { ContribData } from '../types';
import { THEME } from '../svg/theme';
import { svgWrapper, sectionTitle, text } from '../svg/utils';

const LEVEL_COLORS = ['#0d1a2e', '#0a4a7a', '#0a6ca4', '#0d87cd', '#4db8f0'];

function getLevel(count: number): number {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 10) return 3;
  return 4;
}

export function renderContrib(data: ContribData): string {
  const CELL = 11, GAP = 2, STEP = CELL + GAP;
  // data.weeks is an array of { contributionDays: [{date, contributionCount, color}] }
  const weeks = data.weeks ?? [];
  const W = Math.max(weeks.length * STEP + 40 + 20, 200);
  const P = 20;
  const titleY = P + 14;
  const gridY = titleY + 20;
  const H = gridY + 7 * STEP + 30;

  const dayNames = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
  const dayLabels = dayNames.map((d, i) =>
    d ? text(P, gridY + i * STEP + CELL - 1, d, { size: 9, fill: THEME.textDim }) : ''
  ).join('');

  const cells = weeks.map((week: any, wi: number) => {
    const days = week.contributionDays ?? [];
    return days.map((day: any, di: number) => {
      const count = day.contributionCount ?? 0;
      const level = getLevel(count);
      return `<rect x="${P + 28 + wi * STEP}" y="${gridY + di * STEP}" width="${CELL}" height="${CELL}" rx="2" fill="${LEVEL_COLORS[level]}"><title>${day.date}: ${count} contributions</title></rect>`;
    }).join('');
  }).join('');

  const totalText = text(P + 28, H - 8, `${data.total ?? 0} contributions this year`, { size: 10, fill: THEME.textMuted });

  const inner = `
${sectionTitle(P, titleY, 'Contribution Graph')}
${dayLabels}
${cells}
${totalText}`;

  return svgWrapper(W, H, inner, 'Contribution Graph');
}
