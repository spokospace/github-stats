// spoko.space color palette & shared design tokens

export const THEME = {
  bg:          '#030620',
  bgCard:      '#060d24',
  bgBar:       '#0d1a2e',
  border:      '#0d2a4a',
  primary:     '#0d87cd',
  primaryDark: '#0a6ca4',
  text:        '#e5ecf6',
  textMuted:   '#7a9cc0',
  textDim:     '#4a6a8a',
  success:     '#22c55e',
  warning:     '#f59e0b',
  danger:      '#ef4444',
  radius:      10,
  font:        'ui-sans-serif,system-ui,sans-serif',
} as const;

export const LANG_COLORS: Record<string, string> = {
  TypeScript:   '#3178C6',
  JavaScript:   '#F7DF1E',
  PHP:          '#777BB4',
  Vue:          '#4FC08D',
  Astro:        '#FF5D01',
  Python:       '#3776AB',
  CSS:          '#1572B6',
  SCSS:         '#CC6699',
  HTML:         '#E34F26',
  MDX:          '#1B1F24',
  Blade:        '#F05340',
  Shell:        '#89E051',
  Ruby:         '#CC342D',
  Go:           '#00ADD8',
  Rust:         '#DEA584',
  Java:         '#B07219',
  'C#':         '#178600',
  'C++':        '#F34B7D',
  Swift:        '#FA7343',
  Kotlin:       '#A97BFF',
  Dart:         '#00B4AB',
  Svelte:       '#FF3E00',
  default:      '#0d87cd',
};

export function langColor(lang: string): string {
  return LANG_COLORS[lang] ?? LANG_COLORS.default;
}
