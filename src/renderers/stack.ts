import type { Theme } from '../svg/theme';
import { DEFAULT_THEME, TECH_ICONS, langColor } from '../svg/theme';
import { svgWrapper, sectionTitle, chip } from '../svg/utils';

export function renderStack(techs: string[], theme: Theme = DEFAULT_THEME): string {
  const W = 460, P = 20;
  const CHIP_H = 24;
  const CHIP_GAP_X = 8;
  const CHIP_GAP_Y = 8;
  const MAX_W = W - P * 2;
  const titleY = P + 14;
  const ICON = 14, ICON_GAP = 5, PAD_X = 8;

  const rows: Array<Array<{ label: string; w: number }>> = [[]];
  for (const tech of techs) {
    const hasIcon = !!TECH_ICONS[tech];
    const chipW = PAD_X * 2 + (hasIcon ? ICON + ICON_GAP : 0) + tech.length * 7.2;
    const currentRow = rows[rows.length - 1];
    const rowW = currentRow.reduce((s, c) => s + c.w + CHIP_GAP_X, 0);
    if (currentRow.length > 0 && rowW + chipW > MAX_W) {
      rows.push([{ label: tech, w: chipW }]);
    } else {
      currentRow.push({ label: tech, w: chipW });
    }
  }

  const gridY = titleY + 18;
  const H = gridY + rows.length * (CHIP_H + CHIP_GAP_Y) + P - CHIP_GAP_Y;

  let chips = '';
  rows.forEach((row, ri) => {
    let cx = P;
    const cy = gridY + ri * (CHIP_H + CHIP_GAP_Y);
    row.forEach(({ label, w }) => {
      const icon = TECH_ICONS[label];
      const color = icon?.color ?? langColor(label);
      chips += chip(cx, cy, label, color, icon ?? null, theme);
      cx += w + CHIP_GAP_X;
    });
  });

  const inner = `
${sectionTitle(P, titleY, 'Tech Stack', theme)}
${chips}`;

  return svgWrapper(W, H, inner, 'Tech Stack', theme);
}
