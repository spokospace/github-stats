// Shared catalog of icon names grouped by category — the single source of truth
// for the docs page (src/doc.ts) and the icons gallery (src/renderers/icons-gallery.ts).
// Names must match the keys of ICONS (src/renderers/icon.ts) and TECH_ICONS (src/svg/theme.ts).
export type IconGroup = { title: string; names: string[] };

export const UI_ICON_GROUPS: IconGroup[] = [
  { title: 'Basics',                 names: ['bolt', 'star', 'rocket', 'sparkles', 'trophy', 'heart'] },
  { title: 'Navigation & Status',    names: ['map-pin', 'globe', 'eye', 'link', 'home'] },
  { title: 'Common Actions',         names: ['check', 'x', 'plus', 'minus', 'download', 'upload', 'copy', 'trash'] },
  { title: 'Information & Warnings', names: ['info', 'warning', 'bell'] },
  { title: 'Organization',           names: ['folder', 'file', 'list', 'bookmark', 'calendar', 'chart-bar'] },
  { title: 'Workspace',              names: ['code', 'terminal', 'database', 'git-branch', 'book', 'bug'] },
  { title: 'Security & Control',     names: ['lock', 'shield', 'key', 'gear', 'user', 'users', 'building', 'target', 'briefcase', 'mail', 'cloud'] },
];

export const TECH_ICON_GROUPS: IconGroup[] = [
  { title: 'Frameworks & Languages', names: ['Laravel', 'Vue', 'Astro', 'React', 'TypeScript', 'PHP', 'Node.js', 'Python', 'Next.js', 'Nuxt', 'Svelte', 'Angular', 'Remix', 'Solid', 'Express', 'NestJS', 'FastAPI', 'Django', 'Flask', 'Symfony', 'Rails', 'Ruby', 'Go', 'Rust', 'Kotlin', 'Swift', '.NET'] },
  { title: 'Databases',              names: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Prisma', 'Supabase', 'Firebase'] },
  { title: 'Build & Testing',        names: ['Vite', 'Webpack', 'GraphQL', 'Jest', 'Vitest', 'ESLint', 'Storybook', 'Figma', 'Turbopack', 'Turborepo', 'pnpm', 'Yarn', 'Rollup', 'Babel', 'esbuild', 'Playwright', 'Cypress'] },
  { title: 'Cloud & Hosting',        names: ['AWS', 'Azure', 'GCP', 'Cloudflare', 'Cloudflare Workers', 'Heroku', 'Railway', 'Render', 'DigitalOcean'] },
  { title: 'Infrastructure',         names: ['Kubernetes', 'Nginx', 'Linux', 'GitHub Actions', 'Terraform', 'Ansible', 'Grafana', 'Prometheus', 'RabbitMQ', 'Elasticsearch'] },
  { title: 'Other',                  names: ['Docker', 'Git', 'UnoCSS', 'Bun', 'Deno', 'Strapi', 'Sanity', 'Hono', 'tRPC', 'Drizzle', 'Flutter', 'Dart', 'Electron', 'Tauri', 'WebAssembly', 'Solidity', 'MDX'] },
];
