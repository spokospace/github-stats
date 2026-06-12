import type { ContribData } from '../types';
import { THEME } from '../svg/theme';
import { svgWrapper, sectionTitle, text } from '../svg/utils';

const LEVEL_COLORS = ['#0d1a2e', '#0a4a7a', '#0a6ca4', '#0d87cd', '#4db8f0'];

export function renderContrib(data: ContribData): string {
  const CELL = 11, GAP = 2, STEP = CELL + GAP;
  const weeks = data.weeks;
  const W = weeks.length * STEP + 40 + 20;
  const P = 20;
  const titleY = P + 14;
  const gridY = titleY + 20;
  const H = gridY + 7 * STEP + 30;

  const days = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
  const dayLabels = days.map((d, i) =>
    d ? text(P, gridY + i * STEP + CELL - 1, d, { size: 9, fill: THEME.textDim }) : ''
  ).join('');

  const cells = weeks.map((week, wi) =>
    week.days.map((day, di) =>
      `<rect x="${P + 28 + wi * STEP}" y="${gridY + di * STEP}" width="${CELL}" height="${CELL}" rx="2" fill="${LEVEL_COLORS[day.level]}" opacity="${day.count === 0 ? '1' : '1'}">
        <title>${day.date}: ${day.count} contributions</title>
      </rect>`
    ).join('')
  ).join('');

  const totalText = text(P + 28, H - 8, `${data.totalContributions} contributions this year`, { size: 10, fill: THEME.textMuted });

  const inner = `
  ${sectionTitle(P, titleY, 'Contribution Graph')}
  ${dayLabels}
  ${cells}
  ${totalText}`;

  return svgWrapper(W, H, inner, 'Contribution Graph');
}
