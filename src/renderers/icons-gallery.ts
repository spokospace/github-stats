import type { Theme } from '../svg/theme';
import { TECH_ICONS } from '../svg/theme';
import { renderIcon } from './icon';

const UI_ICONS = {
  'Basics': ['bolt', 'star', 'rocket', 'sparkles', 'trophy', 'heart'],
  'Navigation & Status': ['map-pin', 'globe', 'eye', 'link', 'home'],
  'Common Actions': ['check', 'x', 'plus', 'minus', 'download', 'upload', 'copy', 'trash'],
  'Information': ['info', 'warning', 'bell'],
  'Organization': ['folder', 'file', 'list', 'bookmark', 'calendar', 'chart-bar'],
  'Workspace': ['code', 'terminal', 'database', 'git-branch', 'book', 'bug'],
  'Security': ['lock', 'shield', 'key', 'gear', 'user', 'users', 'building', 'target', 'briefcase', 'mail', 'cloud'],
};

const TECH_CATEGORIES = {
  'Frameworks & Languages': ['Laravel', 'Vue', 'Astro', 'React', 'TypeScript', 'PHP', 'Node.js', 'Python', 'Next.js', 'Nuxt', 'Svelte', 'Angular', 'Remix', 'Solid', 'Express', 'NestJS', 'FastAPI', 'Django', 'Flask', 'Symfony', 'Rails', 'Ruby', 'Go', 'Rust', 'Kotlin', 'Swift', '.NET'],
  'Databases': ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Prisma', 'Supabase', 'Firebase'],
  'Build & Testing': ['Vite', 'Webpack', 'GraphQL', 'Jest', 'Vitest', 'ESLint', 'Storybook', 'Figma', 'Turbopack', 'Turborepo', 'pnpm', 'Yarn', 'Rollup', 'Babel', 'esbuild', 'Playwright', 'Cypress'],
  'Cloud & Hosting': ['AWS', 'Azure', 'GCP', 'Cloudflare', 'Cloudflare Workers', 'Heroku', 'Railway', 'Render', 'DigitalOcean'],
  'Infrastructure': ['Kubernetes', 'Nginx', 'Linux', 'GitHub Actions', 'Terraform', 'Ansible', 'Grafana', 'Prometheus', 'RabbitMQ', 'Elasticsearch'],
  'Other': ['Docker', 'Git', 'UnoCSS', 'Bun', 'Deno', 'Strapi', 'Sanity', 'Hono', 'tRPC', 'Drizzle', 'Flutter', 'Dart', 'Electron', 'Tauri', 'WebAssembly', 'Solidity', 'MDX'],
};

export function renderIconsGallery(baseUrl: string, theme: Theme): string {
  const iconSize = 28;
  const primaryColor = theme.primary;

  const uiIconsHtml = Object.entries(UI_ICONS).map(([category, icons]) => `
    <div class="icon-section">
      <h3>${category}</h3>
      <table class="icon-table">
        <tbody>
          ${icons.map(name => {
            const svg = renderIcon(name, primaryColor, iconSize);
            const circleSvg = renderIcon(name, primaryColor, 32, true);
            return svg ? `
              <tr>
                <td class="icon-preview">${svg}</td>
                <td class="icon-circle-preview">${circleSvg}</td>
                <td class="icon-name-cell"><code>${name}</code></td>
                <td class="icon-usage"><code>&lt;img src="${baseUrl}/icon?name=${name}&amp;color=${primaryColor.replace('#', '')}" /&gt;</code></td>
              </tr>
            ` : '';
          }).join('')}
        </tbody>
      </table>
    </div>
  `).join('');

  const techIconsHtml = Object.entries(TECH_CATEGORIES).map(([category, techs]) => `
    <div class="icon-section">
      <h3>${category}</h3>
      <table class="icon-table">
        <tbody>
          ${techs.map(tech => {
            const svg = renderIcon(tech, primaryColor, iconSize);
            return svg ? `
              <tr>
                <td class="icon-preview">${svg}</td>
                <td class="icon-name-cell"><code>${tech}</code></td>
                <td class="icon-usage"><code>&lt;img src="${baseUrl}/icon?name=${tech}&amp;color=${primaryColor.replace('#', '')}" /&gt;</code></td>
              </tr>
            ` : `<tr><td colspan="3" style="color: var(--muted); font-size: 12px;">${tech} — not found</td></tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>github-stats Icons Gallery — spoko.space</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: ${theme.bg};
      --card: ${theme.card};
      --border: ${theme.border};
      --primary: ${theme.primary};
      --text: ${theme.text};
      --muted: ${theme.muted};
      --radius: ${theme.radius}px;
    }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 15px;
      line-height: 1.6;
      min-height: 100vh;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 48px 24px;
    }

    header {
      margin-bottom: 48px;
    }

    h1 {
      font-size: 2rem;
      margin-bottom: 8px;
    }

    h1 span { color: var(--primary); }

    header p {
      color: var(--muted);
      font-size: 1rem;
    }

    h2 {
      font-size: 1.5rem;
      margin: 48px 0 24px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--border);
    }

    h3 {
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--muted);
      margin: 24px 0 16px;
    }

    .icon-section {
      margin-bottom: 32px;
    }

    .icon-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
    }

    .icon-table tr {
      border-bottom: 1px solid var(--border);
      transition: background 0.2s;
    }

    .icon-table tr:hover {
      background: var(--card);
    }

    .icon-table td {
      padding: 12px;
      vertical-align: middle;
    }

    .icon-preview {
      width: 50px;
      text-align: center;
      flex-shrink: 0;
    }

    .icon-preview svg {
      display: block;
      margin: 0 auto;
    }

    .icon-circle-preview {
      width: 50px;
      text-align: center;
      display: none;
    }

    .icon-circle-preview svg {
      display: block;
      margin: 0 auto;
    }

    @media (min-width: 768px) {
      .icon-circle-preview {
        display: table-cell;
      }
    }

    .icon-name-cell {
      width: 120px;
      flex-shrink: 0;
      font-weight: 500;
    }

    .icon-name-cell code {
      background: var(--bg);
      padding: 4px 8px;
    }

    .icon-usage {
      color: var(--muted);
      font-size: 12px;
      word-break: break-all;
    }

    .icon-usage code {
      background: var(--bg);
      padding: 2px 4px;
      font-size: 11px;
    }

    .usage {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 24px;
      margin: 32px 0;
    }

    .usage-title {
      font-weight: 600;
      margin-bottom: 8px;
    }

    code {
      background: var(--bg);
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
      font-size: 13px;
    }

    pre {
      background: var(--bg);
      padding: 16px;
      border-radius: var(--radius);
      overflow-x: auto;
      margin-top: 8px;
      border: 1px solid var(--border);
    }

    pre code {
      background: none;
      padding: 0;
    }

    a {
      color: var(--primary);
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    footer {
      margin-top: 64px;
      padding-top: 24px;
      border-top: 1px solid var(--border);
      color: var(--muted);
      font-size: 13px;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>github<span>-stats</span> Icons Gallery</h1>
      <p>44 UI icons + 50+ tech stack icons for your GitHub projects</p>
    </header>

    <section>
      <h2>UI Icons (Phosphor thin)</h2>
      <p style="color: var(--muted); margin-bottom: 24px;">44 icons organized by category — click to copy usage code</p>
      ${uiIconsHtml}
    </section>

    <section>
      <h2>Tech Stack Icons (50+)</h2>
      <p style="color: var(--muted); margin-bottom: 24px;">Official brand colors from simple-icons & @iconify-icons/logos</p>
      ${techIconsHtml}
    </section>

    <section class="usage">
      <div class="usage-title">Usage in your README</div>
      <p style="margin-bottom: 12px;">Bare icon:</p>
      <pre><code>&lt;img height="14" src="${baseUrl}/icon?name=bolt&amp;color=0d87cd" align="absmiddle" /&gt; Your text</code></pre>

      <p style="margin: 16px 0 12px;">Circle variant:</p>
      <pre><code>&lt;img height="40" src="${baseUrl}/icon?name=rocket&amp;color=0d87cd&amp;circle=1&amp;size=40" /&gt;</code></pre>

      <p style="margin: 16px 0 12px;">With opacity:</p>
      <pre><code>&lt;img height="40" src="${baseUrl}/icon?name=star&amp;color=5fe06a&amp;circle=1&amp;size=40&amp;opacity=0.15" /&gt;</code></pre>
    </section>

    <footer>
      github-stats — <a href="https://github.com/spokospace/github-stats">View on GitHub</a> —
      <a href="${baseUrl}/">API Docs</a>
    </footer>
  </div>
</body>
</html>`;
}
