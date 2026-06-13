import {
  siLaravel, siVuedotjs, siAstro, siTypescript, siTailwindcss,
  siPhp, siNodedotjs, siWordpress, siPython, siReact, siDocker,
  siGit, siUnocss, siJavascript, siCss, siSass, siHtml5,
} from 'simple-icons';

// spoko.space color palette & shared design tokens
// All colors can be overridden via URL query params:
//   ?bg=030620&primary=0d87cd&text=e5ecf6&radius=10

export interface Theme {
  bg: string;
  bgCard: string;
  bgBar: string;
  border: string;
  primary: string;
  primaryDark: string;
  text: string;
  textMuted: string;
  textDim: string;
  success: string;
  warning: string;
  danger: string;
  radius: number;
  font: string;
}

// Default (spoko.space dark)
export const DEFAULT_THEME: Theme = {
  bg: '#030620',
  bgCard: '#060d24',
  bgBar: '#0d1a2e',
  border: '#0d2a4a',
  primary: '#0d87cd',
  primaryDark: '#0a6ca4',
  text: '#e5ecf6',
  textMuted: '#7a9cc0',
  textDim: '#4a6a8a',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  radius: 10,
  font: 'ui-sans-serif,system-ui,sans-serif',
};

// Build a theme from URL search params, falling back to defaults
// Supported params: bg, card, bar, border, primary, text, muted, dim, radius
export function buildTheme(params: URLSearchParams): Theme {
  const p = (key: string, fallback: string) => {
    const v = params.get(key);
    return v ? (v.startsWith('#') ? v : '#' + v) : fallback;
  };
  const primary = p('primary', DEFAULT_THEME.primary);
  return {
    bg: p('bg', DEFAULT_THEME.bg),
    bgCard: p('card', DEFAULT_THEME.bgCard),
    bgBar: p('bar', DEFAULT_THEME.bgBar),
    border: p('border', DEFAULT_THEME.border),
    primary,
    primaryDark: p('primaryDark', DEFAULT_THEME.primaryDark),
    text: p('text', DEFAULT_THEME.text),
    textMuted: p('muted', DEFAULT_THEME.textMuted),
    textDim: p('dim', DEFAULT_THEME.textDim),
    success: p('success', DEFAULT_THEME.success),
    warning: p('warning', DEFAULT_THEME.warning),
    danger: p('danger', DEFAULT_THEME.danger),
    radius: parseInt(params.get('radius') ?? '') || DEFAULT_THEME.radius,
    font: params.get('font') ?? DEFAULT_THEME.font,
  };
}

// Backwards-compatible default export for renderers that don't need customisation
export const THEME = DEFAULT_THEME;

// Language bar colors — popular languages use official simple-icons brand colors,
// less common languages fall back to GitHub Linguist palette.
export const LANG_COLORS: Record<string, string> = {
  TypeScript: `#${siTypescript.hex}`,
  JavaScript: `#${siJavascript.hex}`,
  PHP:        `#${siPhp.hex}`,
  Vue:        `#${siVuedotjs.hex}`,
  Astro:      `#${siAstro.hex}`,
  Python:     `#${siPython.hex}`,
  CSS:        `#${siCss.hex}`,
  SCSS:       `#${siSass.hex}`,
  HTML:       `#${siHtml5.hex}`,
  React:      `#${siReact.hex}`,
  'Node.js':  `#${siNodedotjs.hex}`,
  Node:       `#${siNodedotjs.hex}`,
  Laravel:    `#${siLaravel.hex}`,
  WordPress:  `#${siWordpress.hex}`,
  Docker:     `#${siDocker.hex}`,
  Tailwind:   `#${siTailwindcss.hex}`,
  // GitHub Linguist colors for languages not in simple-icons
  MDX:    '#1B1F24',
  Blade:  '#F05340',
  Shell:  '#89E051',
  Ruby:   '#CC342D',
  Go:     '#00ADD8',
  Rust:   '#DEA584',
  Java:   '#B07219',
  'C#':   '#178600',
  'C++':  '#F34B7D',
  Swift:  '#FA7343',
  Kotlin: '#A97BFF',
  Dart:   '#00B4AB',
  Svelte: '#FF3E00',
  Angular:'#DD0031',
  default:'#0d87cd',
};

export function langColor(lang: string): string {
  return LANG_COLORS[lang] ?? LANG_COLORS.default;
}

// Tech stack icons — sourced from simple-icons (MIT), viewBox 0 0 24 24
export const TECH_ICONS: Record<string, { path: string; color: string }> = {
  'Laravel':    { path: siLaravel.path,     color: `#${siLaravel.hex}` },
  'Vue':        { path: siVuedotjs.path,    color: `#${siVuedotjs.hex}` },
  'Astro':      { path: siAstro.path,       color: `#${siAstro.hex}` },
  'TypeScript': { path: siTypescript.path,  color: `#${siTypescript.hex}` },
  'Tailwind':   { path: siTailwindcss.path, color: `#${siTailwindcss.hex}` },
  'PHP':        { path: siPhp.path,         color: `#${siPhp.hex}` },
  'Node.js':    { path: siNodedotjs.path,   color: `#${siNodedotjs.hex}` },
  'WordPress':  { path: siWordpress.path,   color: `#${siWordpress.hex}` },
  'Python':     { path: siPython.path,      color: `#${siPython.hex}` },
  'React':      { path: siReact.path,       color: `#${siReact.hex}` },
  'Docker':     { path: siDocker.path,      color: `#${siDocker.hex}` },
  'Git':        { path: siGit.path,         color: `#${siGit.hex}` },
  'UnoCSS':     { path: siUnocss.path,      color: `#${siUnocss.hex}` },
};
