import {
  siLaravel, siVuedotjs, siAstro, siTypescript, siTailwindcss,
  siPhp, siNodedotjs, siWordpress, siPython, siReact, siDocker,
  siGit, siUnocss, siJavascript, siCss, siSass, siHtml5, siMdx,
  siNextdotjs, siNuxt, siSvelte, siAngular, siRemix, siSolid,
  siExpress, siNestjs, siFastapi, siDjango, siFlask, siSymfony, siRubyonrails, siRuby,
  siGo, siRust, siKotlin, siSwift, siDotnet,
  siMysql, siPostgresql, siMongodb, siRedis, siSqlite, siPrisma, siSupabase, siFirebase,
  siVercel, siNetlify, siKubernetes, siNginx, siLinux, siGithubactions,
  siVite, siWebpack, siGraphql, siJest, siVitest, siFigma, siStorybook, siEslint,
  siBun, siDeno, siStrapi, siSanity,
  // JS ecosystem
  siTurborepo, siPnpm, siYarn, siRollupdotjs, siBabel, siEsbuild, siCypress,
  // CSS / UI
  siRadixui, siShadcnui, siFramer, siBootstrap, siMui, siAntdesign, siChakraui, siDaisyui,
  // Backend / infra
  siHono, siTrpc, siDrizzle, siTerraform, siAnsible,
  siGrafana, siPrometheus, siRabbitmq, siElasticsearch,
  // Cloud / hosting
  siGooglecloud, siCloudflare, siRailway, siRender, siDigitalocean,
  // Mobile / other
  siFlutter, siDart, siElectron, siTauri, siWebassembly, siSolidity,
} from 'simple-icons';
import { default as logosAws } from '@iconify-icons/logos/aws';
import { default as logosAzureIcon } from '@iconify-icons/logos/azure-icon';
import { default as logosHerokuIcon } from '@iconify-icons/logos/heroku-icon';
import { default as logosTurbopackIcon } from '@iconify-icons/logos/turbopack-icon';
import { default as logosPlaywright } from '@iconify-icons/logos/playwright';
import { default as logosCloudflareWorkersIcon } from '@iconify-icons/logos/cloudflare-workers-icon';
import { normalizeHex } from './utils';

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
  chamfer: number;
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
  chamfer: 0,
  font: 'ui-sans-serif,system-ui,sans-serif',
};

// Build a theme from URL search params, falling back to defaults
// Supported params: bg, card, bar, border, primary, text, muted, dim, radius
export function buildTheme(params: URLSearchParams): Theme {
  const base = NAMED_THEMES[params.get('theme') ?? ''] ?? DEFAULT_THEME;
  const p = (key: string, fallback: string) => normalizeHex(params.get(key), fallback);
  const primary = p('primary', base.primary);
  return {
    bg: p('bg', base.bg),
    bgCard: p('card', base.bgCard),
    bgBar: p('bar', base.bgBar),
    border: p('border', base.border),
    primary,
    primaryDark: p('primaryDark', base.primaryDark),
    text: p('text', base.text),
    textMuted: p('muted', base.textMuted),
    textDim: p('dim', base.textDim),
    success: p('success', base.success),
    warning: p('warning', base.warning),
    danger: p('danger', base.danger),
    radius: parseInt(params.get('radius') ?? '') || base.radius,
    chamfer: parseInt(params.get('chamfer') ?? '') || base.chamfer,
    font: params.get('font') ?? base.font,
  };
}

export const LIGHT_THEME: Theme = {
  bg: '#ffffff',
  bgCard: '#f6f8fa',
  bgBar: '#eef2f6',
  border: '#d0d7de',
  primary: '#0d87cd',
  primaryDark: '#0a6ca4',
  text: '#1a2332',
  textMuted: '#506680',
  textDim: '#8090a0',
  success: '#16a34a',
  warning: '#d97706',
  danger: '#dc2626',
  radius: 10,
  chamfer: 0,
  font: 'ui-sans-serif,system-ui,sans-serif',
};

export const NAMED_THEMES: Record<string, Theme> = {
  dark: DEFAULT_THEME,
  light: LIGHT_THEME,
  tokyonight: {
    bg: '#1a1b27', bgCard: '#24283b', bgBar: '#2c3155', border: '#1f2335',
    primary: '#7aa2f7', primaryDark: '#5c8ee0',
    text: '#c0caf5', textMuted: '#9aa5ce', textDim: '#565f89',
    success: '#9ece6a', warning: '#e0af68', danger: '#f7768e',
    radius: 10, chamfer: 0, font: 'ui-sans-serif,system-ui,sans-serif',
  },
  dracula: {
    bg: '#282a36', bgCard: '#313442', bgBar: '#3c4064', border: '#44475a',
    primary: '#bd93f9', primaryDark: '#9d74d4',
    text: '#f8f8f2', textMuted: '#6272a4', textDim: '#44475a',
    success: '#50fa7b', warning: '#ffb86c', danger: '#ff5555',
    radius: 10, chamfer: 0, font: 'ui-sans-serif,system-ui,sans-serif',
  },
  'github-dark': {
    bg: '#0d1117', bgCard: '#161b22', bgBar: '#21262d', border: '#30363d',
    primary: '#58a6ff', primaryDark: '#3785e0',
    text: '#c9d1d9', textMuted: '#8b949e', textDim: '#484f58',
    success: '#3fb950', warning: '#d29922', danger: '#f85149',
    radius: 10, chamfer: 0, font: 'ui-sans-serif,system-ui,sans-serif',
  },
  nord: {
    bg: '#2e3440', bgCard: '#3b4252', bgBar: '#434c5e', border: '#4c566a',
    primary: '#88c0d0', primaryDark: '#5e9ab0',
    text: '#eceff4', textMuted: '#d8dee9', textDim: '#7b88a1',
    success: '#a3be8c', warning: '#ebcb8b', danger: '#bf616a',
    radius: 10, chamfer: 0, font: 'ui-sans-serif,system-ui,sans-serif',
  },
  radical: {
    bg: '#141321', bgCard: '#1e1c30', bgBar: '#282639', border: '#383838',
    primary: '#fe428e', primaryDark: '#d4226e',
    text: '#a9fef7', textMuted: '#717491', textDim: '#434761',
    success: '#79ff97', warning: '#f8d847', danger: '#ff5555',
    radius: 10, chamfer: 0, font: 'ui-sans-serif,system-ui,sans-serif',
  },
  synthwave: {
    bg: '#2b213a', bgCard: '#352a4e', bgBar: '#3f3060', border: '#6b4d8a',
    primary: '#ff6ac1', primaryDark: '#d44d9c',
    text: '#f4f4f7', textMuted: '#a699d0', textDim: '#7257a3',
    success: '#72f1b8', warning: '#fede5d', danger: '#fe4450',
    radius: 10, chamfer: 0, font: 'ui-sans-serif,system-ui,sans-serif',
  },
  catppuccin: {
    bg: '#1e1e2e', bgCard: '#313244', bgBar: '#45475a', border: '#585b70',
    primary: '#cba6f7', primaryDark: '#a882d8',
    text: '#cdd6f4', textMuted: '#a6adc8', textDim: '#6c7086',
    success: '#a6e3a1', warning: '#f9e2af', danger: '#f38ba8',
    radius: 10, chamfer: 0, font: 'ui-sans-serif,system-ui,sans-serif',
  },
  gruvbox: {
    bg: '#282828', bgCard: '#3c3836', bgBar: '#504945', border: '#665c54',
    primary: '#fabd2f', primaryDark: '#d49e1d',
    text: '#ebdbb2', textMuted: '#a89984', textDim: '#7c6f64',
    success: '#b8bb26', warning: '#fe8019', danger: '#cc241d',
    radius: 10, chamfer: 0, font: 'ui-sans-serif,system-ui,sans-serif',
  },
  aura: {
    bg: '#15141b', bgCard: '#1c1b26', bgBar: '#252432', border: '#3d375e',
    primary: '#a277ff', primaryDark: '#7d58d4',
    text: '#edecee', textMuted: '#9590ac', textDim: '#6a6480',
    success: '#61ffca', warning: '#ffca85', danger: '#ff6767',
    radius: 10, chamfer: 0, font: 'ui-sans-serif,system-ui,sans-serif',
  },
  discord: {
    bg: '#2c2f33', bgCard: '#36393f', bgBar: '#424549', border: '#202225',
    primary: '#5865f2', primaryDark: '#3c47c8',
    text: '#dcddde', textMuted: '#96989d', textDim: '#72767d',
    success: '#3ba55c', warning: '#faa61a', danger: '#ed4245',
    radius: 10, chamfer: 0, font: 'ui-sans-serif,system-ui,sans-serif',
  },
};

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

// Tech stack icons. simple-icons (MIT) are single 24x24 paths we recolor.
// @iconify-icons/logos entries are full multi-color SVG bodies (raw=true) with
// their own native viewBox — embed as-is, do not recolor or force a 24x24 box.
export type TechIcon = { path: string; color: string; viewBox?: string; raw?: boolean };

// simple-icons whose brand color is pure black (#000000) are invisible on dark
// card backgrounds. Promote them to white so the glyph stays readable.
const iconColor = (hex: string) => `#${hex === '000000' ? 'ffffff' : hex}`;

// Inner SVG markup + viewBox for a tech icon, encoding the simple-icons vs
// multi-color-logo distinction in one place. raw logos keep their own body and
// native viewBox (and ignore color); simple-icons are a single recolored 24x24 path.
export function techIconBody(icon: TechIcon, color: string): { viewBox: string; inner: string } {
  return icon.raw
    ? { viewBox: icon.viewBox!, inner: icon.path }
    : { viewBox: '0 0 24 24', inner: `<path d="${icon.path}" fill="${color}"/>` };
}
export const TECH_ICONS: Record<string, TechIcon> = {
  'Laravel':    { path: siLaravel.path,     color: iconColor(siLaravel.hex)},
  'Vue':        { path: siVuedotjs.path,    color: iconColor(siVuedotjs.hex)},
  'Astro':      { path: siAstro.path,       color: iconColor(siAstro.hex)},
  'TypeScript': { path: siTypescript.path,  color: iconColor(siTypescript.hex)},
  'Tailwind':   { path: siTailwindcss.path, color: iconColor(siTailwindcss.hex)},
  'PHP':        { path: siPhp.path,         color: iconColor(siPhp.hex)},
  'Node.js':    { path: siNodedotjs.path,   color: iconColor(siNodedotjs.hex)},
  'WordPress':  { path: siWordpress.path,   color: iconColor(siWordpress.hex)},
  'Python':     { path: siPython.path,      color: iconColor(siPython.hex)},
  'React':      { path: siReact.path,       color: iconColor(siReact.hex)},
  'Docker':     { path: siDocker.path,      color: iconColor(siDocker.hex)},
  'Git':        { path: siGit.path,         color: iconColor(siGit.hex)},
  'UnoCSS':     { path: siUnocss.path,      color: iconColor(siUnocss.hex)},
  'JavaScript': { path: siJavascript.path,   color: iconColor(siJavascript.hex)},
  'CSS':        { path: siCss.path,          color: iconColor(siCss.hex)},
  'HTML':       { path: siHtml5.path,        color: iconColor(siHtml5.hex)},
  'SCSS':       { path: siSass.path,         color: iconColor(siSass.hex)},
  // JS frameworks
  'Next.js':    { path: siNextdotjs.path,    color: iconColor(siNextdotjs.hex)},
  'Nuxt':       { path: siNuxt.path,         color: iconColor(siNuxt.hex)},
  'Svelte':     { path: siSvelte.path,       color: iconColor(siSvelte.hex)},
  'Angular':    { path: siAngular.path,      color: iconColor(siAngular.hex)},
  'Remix':      { path: siRemix.path,        color: iconColor(siRemix.hex)},
  'Solid':      { path: siSolid.path,        color: iconColor(siSolid.hex)},
  // Backend frameworks
  'Express':    { path: siExpress.path,      color: iconColor(siExpress.hex)},
  'NestJS':     { path: siNestjs.path,       color: iconColor(siNestjs.hex)},
  'FastAPI':    { path: siFastapi.path,      color: iconColor(siFastapi.hex)},
  'Django':     { path: siDjango.path,       color: iconColor(siDjango.hex)},
  'Flask':      { path: siFlask.path,        color: iconColor(siFlask.hex)},
  'Symfony':    { path: siSymfony.path,      color: iconColor(siSymfony.hex)},
  'Rails':      { path: siRubyonrails.path,  color: iconColor(siRubyonrails.hex)},
  // Languages
  'Ruby':       { path: siRuby.path,         color: iconColor(siRuby.hex)},
  'Go':         { path: siGo.path,           color: iconColor(siGo.hex)},
  'Rust':       { path: siRust.path,         color: iconColor(siRust.hex)},
  'Kotlin':     { path: siKotlin.path,       color: iconColor(siKotlin.hex)},
  'Swift':      { path: siSwift.path,        color: iconColor(siSwift.hex)},
  '.NET':       { path: siDotnet.path,       color: iconColor(siDotnet.hex)},
  // Databases
  'MySQL':      { path: siMysql.path,        color: iconColor(siMysql.hex)},
  'PostgreSQL': { path: siPostgresql.path,   color: iconColor(siPostgresql.hex)},
  'MongoDB':    { path: siMongodb.path,      color: iconColor(siMongodb.hex)},
  'Redis':      { path: siRedis.path,        color: iconColor(siRedis.hex)},
  'SQLite':     { path: siSqlite.path,       color: iconColor(siSqlite.hex)},
  'Prisma':     { path: siPrisma.path,       color: iconColor(siPrisma.hex)},
  'Supabase':   { path: siSupabase.path,     color: iconColor(siSupabase.hex)},
  'Firebase':   { path: siFirebase.path,     color: iconColor(siFirebase.hex)},
  // Cloud & DevOps
  'Vercel':     { path: siVercel.path,       color: iconColor(siVercel.hex)},
  'Netlify':    { path: siNetlify.path,      color: iconColor(siNetlify.hex)},
  'Kubernetes': { path: siKubernetes.path,   color: iconColor(siKubernetes.hex)},
  'Nginx':      { path: siNginx.path,        color: iconColor(siNginx.hex)},
  'Linux':      { path: siLinux.path,        color: iconColor(siLinux.hex)},
  'GitHub Actions': { path: siGithubactions.path, color: iconColor(siGithubactions.hex)},
  // Build tools & testing
  'Vite':       { path: siVite.path,         color: iconColor(siVite.hex)},
  'Webpack':    { path: siWebpack.path,      color: iconColor(siWebpack.hex)},
  'GraphQL':    { path: siGraphql.path,      color: iconColor(siGraphql.hex)},
  'Jest':       { path: siJest.path,         color: iconColor(siJest.hex)},
  'Vitest':     { path: siVitest.path,       color: iconColor(siVitest.hex)},
  'ESLint':     { path: siEslint.path,       color: iconColor(siEslint.hex)},
  'Storybook':  { path: siStorybook.path,    color: iconColor(siStorybook.hex)},
  'Figma':      { path: siFigma.path,        color: iconColor(siFigma.hex)},
  // Runtimes & CMS
  'Bun':        { path: siBun.path,          color: iconColor(siBun.hex)},
  'Deno':       { path: siDeno.path,         color: iconColor(siDeno.hex)},
  'Strapi':     { path: siStrapi.path,       color: iconColor(siStrapi.hex)},
  'Sanity':     { path: siSanity.path,       color: iconColor(siSanity.hex)},
  'MDX':        { path: siMdx.path,          color: iconColor(siMdx.hex)},
  // JS ecosystem (build, package managers, testing)
  'Turbopack':  { path: logosTurbopackIcon.body, color: '#000000', viewBox: '0 0 256 293', raw: true },
  'Turborepo':  { path: siTurborepo.path,    color: iconColor(siTurborepo.hex)},
  'pnpm':       { path: siPnpm.path,         color: iconColor(siPnpm.hex)},
  'Yarn':       { path: siYarn.path,         color: iconColor(siYarn.hex)},
  'Rollup':     { path: siRollupdotjs.path,  color: iconColor(siRollupdotjs.hex)},
  'Babel':      { path: siBabel.path,        color: iconColor(siBabel.hex)},
  'esbuild':    { path: siEsbuild.path,      color: iconColor(siEsbuild.hex)},
  'Playwright': { path: logosPlaywright.body, color: '#2EAD33', viewBox: '0 0 256 192', raw: true },
  'Cypress':    { path: siCypress.path,      color: iconColor(siCypress.hex)},
  // CSS / UI frameworks & component libraries
  'Radix UI':   { path: siRadixui.path,      color: iconColor(siRadixui.hex)},
  'shadcn/ui':  { path: siShadcnui.path,     color: iconColor(siShadcnui.hex)},
  'Framer Motion': { path: siFramer.path,    color: iconColor(siFramer.hex)},
  'Bootstrap':  { path: siBootstrap.path,    color: iconColor(siBootstrap.hex)},
  'MUI':        { path: siMui.path,          color: iconColor(siMui.hex)},
  'Ant Design': { path: siAntdesign.path,    color: iconColor(siAntdesign.hex)},
  'Chakra UI':  { path: siChakraui.path,     color: iconColor(siChakraui.hex)},
  'daisyUI':    { path: siDaisyui.path,      color: iconColor(siDaisyui.hex)},
  // Backend frameworks & tools
  'Hono':       { path: siHono.path,         color: iconColor(siHono.hex)},
  'tRPC':       { path: siTrpc.path,         color: iconColor(siTrpc.hex)},
  'Drizzle':    { path: siDrizzle.path,      color: iconColor(siDrizzle.hex)},
  'Terraform':  { path: siTerraform.path,    color: iconColor(siTerraform.hex)},
  'Ansible':    { path: siAnsible.path,      color: iconColor(siAnsible.hex)},
  // Monitoring & orchestration
  'Grafana':    { path: siGrafana.path,      color: iconColor(siGrafana.hex)},
  'Prometheus': { path: siPrometheus.path,   color: iconColor(siPrometheus.hex)},
  'RabbitMQ':   { path: siRabbitmq.path,     color: iconColor(siRabbitmq.hex)},
  'Elasticsearch': { path: siElasticsearch.path, color: iconColor(siElasticsearch.hex)},
  // Cloud & hosting providers
  'AWS':        { path: logosAws.body,       color: '#FF9900', viewBox: '0 0 256 153', raw: true },
  'Azure':      { path: logosAzureIcon.body, color: '#0078D4', viewBox: '0 0 256 199', raw: true },
  'GCP':        { path: siGooglecloud.path,  color: iconColor(siGooglecloud.hex)},
  'Cloudflare': { path: siCloudflare.path,   color: iconColor(siCloudflare.hex)},
  'Cloudflare Workers': { path: logosCloudflareWorkersIcon.body, color: '#F38020', viewBox: '0 0 256 231', raw: true },
  'Heroku':     { path: logosHerokuIcon.body, color: '#430098', viewBox: '0 0 256 285', raw: true },
  'Railway':    { path: siRailway.path,      color: iconColor(siRailway.hex)},
  'Render':     { path: siRender.path,       color: iconColor(siRender.hex)},
  'DigitalOcean': { path: siDigitalocean.path, color: iconColor(siDigitalocean.hex)},
  // Mobile & other platforms
  'Flutter':    { path: siFlutter.path,      color: iconColor(siFlutter.hex)},
  'Dart':       { path: siDart.path,         color: iconColor(siDart.hex)},
  'Electron':   { path: siElectron.path,     color: iconColor(siElectron.hex)},
  'Tauri':      { path: siTauri.path,        color: iconColor(siTauri.hex)},
  'WebAssembly': { path: siWebassembly.path, color: iconColor(siWebassembly.hex)},
  'Solidity':   { path: siSolidity.path,     color: iconColor(siSolidity.hex)},
};

// Lowercase + slug lookup for renderIcon. Built here so any renderer can import
// it and get alias resolution for free without reimplementing the mapping.
function buildTechIconsLower(): Record<string, TechIcon> {
  const map: Record<string, TechIcon> = {};
  for (const [key, icon] of Object.entries(TECH_ICONS)) {
    const lower = key.toLowerCase();
    map[lower] = icon;
    // Auto-derive slug by stripping punctuation: next.js→nextjs, node.js→nodejs,
    // shadcn/ui→shadcnui, GitHub Actions→githubactions, Framer Motion→framermotion …
    const slug = lower.replace(/[.\s/]/g, '');
    if (slug !== lower) map[slug] = icon;
  }
  // Explicit aliases for names that differ beyond punctuation stripping
  for (const [alias, canonical] of Object.entries({
    tailwindcss: 'tailwind',
    rubyonrails: 'rails',
    vuejs:       'vue',
    reactjs:     'react',
    next:        'next.js',
    node:        'node.js',
    dotnet:      '.net',
  })) {
    if (map[canonical]) map[alias] = map[canonical];
  }
  return map;
}
export const TECH_ICONS_LOWER = buildTechIconsLower();
