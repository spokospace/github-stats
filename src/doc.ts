export function renderDoc(baseUrl: string): string {
  const endpoints = [
    { path: '/langs',    desc: 'Top 10 languages by bytes — segmented bar + legend',       preview: true },
    { path: '/stats',    desc: 'Commits, PRs, stars, issues, forks — stat grid',            preview: true },
    { path: '/streak',   desc: 'Current streak, longest streak, total contributions',       preview: true },
    { path: '/repos',    desc: 'Top 6 repos by stars — 2-column cards',                    preview: true },
    { path: '/contrib',  desc: 'Full-year contribution heatmap (GitHub-style calendar)',    preview: true },
    { path: '/trophies', desc: 'Achievement trophies — C to SSS tier based on stats',      preview: true },
    { path: '/profile',  desc: 'Animated profile card — stats + orbital space animation',   preview: true },
    { path: '/stack',    desc: 'Tech stack chips — pass ?techs=Laravel,Vue,TypeScript',    preview: true },
  ];

  const themeParams = [
    { param: 'theme',    type: 'str', default: 'dark',   desc: 'Base palette — <code>light</code> or <code>dark</code> (default). Applies full light/dark preset; all other params override on top.' },
    { param: 'bg',       type: 'hex', default: '030620', desc: 'Main background color' },
    { param: 'card',     type: 'hex', default: '060d24', desc: 'Card/chip background' },
    { param: 'bar',      type: 'hex', default: '0d1a2e', desc: 'Progress bar background' },
    { param: 'border',   type: 'hex', default: '0d2a4a', desc: 'Border color' },
    { param: 'primary',  type: 'hex', default: '0d87cd', desc: 'Accent / highlight color' },
    { param: 'text',     type: 'hex', default: 'e5ecf6', desc: 'Primary text color' },
    { param: 'muted',    type: 'hex', default: '7a9cc0', desc: 'Secondary text color' },
    { param: 'dim',      type: 'hex', default: '4a6a8a', desc: 'Tertiary / dim text color' },
    { param: 'radius',   type: 'px',  default: '10',     desc: 'Corner radius in pixels' },
    { param: 'font',     type: 'str', default: 'ui-sans-serif,system-ui,sans-serif', desc: 'Font family' },
  ];

  const previewRow = (ep: typeof endpoints[0]) => `
    <div class="preview-item">
      <div class="preview-label"><code>${ep.path}</code></div>
      <div class="preview-desc">${ep.desc}</div>
      <div class="preview-img">
        <img src="${baseUrl}${ep.path}" alt="${ep.path} widget" loading="lazy">
      </div>
    </div>`;

  const themeRow = (p: typeof themeParams[0]) => `
    <tr>
      <td><code>?${p.param}</code></td>
      <td><span class="badge">${p.type}</span></td>
      <td><code>${p.default}</code></td>
      <td>${p.desc}</td>
    </tr>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>github-stats — spoko.space</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg:       #030620;
      --bg-card:  #060d24;
      --bg-bar:   #0d1a2e;
      --border:   #0d2a4a;
      --primary:  #0d87cd;
      --text:     #e5ecf6;
      --muted:    #7a9cc0;
      --dim:      #4a6a8a;
      --radius:   10px;
      --font:     ui-sans-serif, system-ui, sans-serif;
      --mono:     ui-monospace, SFMono-Regular, Menlo, monospace;
    }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--font);
      font-size: 15px;
      line-height: 1.6;
      min-height: 100vh;
    }

    a { color: var(--primary); text-decoration: none; }
    a:hover { text-decoration: underline; }

    code, pre {
      font-family: var(--mono);
      font-size: 13px;
      background: var(--bg-bar);
      border-radius: 4px;
      padding: 2px 6px;
    }

    pre {
      padding: 16px 20px;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      overflow-x: auto;
      line-height: 1.5;
    }

    pre code { background: none; padding: 0; }

    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 0 24px;
    }

    /* ── Header ─────────────────────────────────────── */
    header {
      border-bottom: 1px solid var(--border);
      padding: 48px 0 36px;
    }

    header h1 {
      font-size: 2rem;
      font-weight: 700;
      color: var(--text);
      letter-spacing: -0.5px;
    }

    header h1 span { color: var(--primary); }

    header p {
      color: var(--muted);
      margin-top: 8px;
      font-size: 1rem;
    }

    .header-links {
      margin-top: 16px;
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 7px 16px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
      border: 1px solid var(--border);
      background: var(--bg-card);
      color: var(--text);
      cursor: pointer;
    }

    .btn-primary {
      background: var(--primary);
      border-color: var(--primary);
      color: #fff;
    }

    /* ── Sections ───────────────────────────────────── */
    main { padding: 48px 0 80px; }

    section + section { margin-top: 64px; }

    h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text);
      margin-bottom: 24px;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--border);
    }

    h3 {
      font-size: 1rem;
      font-weight: 600;
      color: var(--muted);
      margin: 24px 0 8px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-size: 11px;
    }

    /* ── Endpoint previews ──────────────────────────── */
    .preview-grid {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .preview-item {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      overflow: hidden;
    }

    .preview-item .preview-label {
      padding: 14px 20px 0;
      font-size: 1rem;
    }

    .preview-item .preview-desc {
      padding: 4px 20px 14px;
      color: var(--muted);
      font-size: 13px;
    }

    .preview-img {
      padding: 0 20px 20px;
      overflow-x: auto;
    }

    .preview-img img {
      display: block;
      max-width: 100%;
      border-radius: 6px;
    }

    /* ── Tables ─────────────────────────────────────── */
    .table-wrap { overflow-x: auto; }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
    }

    th {
      text-align: left;
      padding: 10px 16px;
      background: var(--bg-bar);
      color: var(--muted);
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid var(--border);
    }

    td {
      padding: 10px 16px;
      border-bottom: 1px solid var(--border);
      vertical-align: top;
      color: var(--text);
    }

    tr:last-child td { border-bottom: none; }

    .badge {
      display: inline-block;
      padding: 1px 7px;
      border-radius: 4px;
      font-size: 11px;
      font-family: var(--mono);
      background: var(--bg-bar);
      color: var(--muted);
      border: 1px solid var(--border);
    }

    /* ── Deploy steps ───────────────────────────────── */
    .steps {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .step {
      display: flex;
      gap: 16px;
    }

    .step-num {
      flex-shrink: 0;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: var(--primary);
      color: #fff;
      font-size: 13px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 2px;
    }

    .step-body { flex: 1; }
    .step-body p { color: var(--muted); margin-bottom: 8px; font-size: 14px; }

    /* ── Footer ─────────────────────────────────────── */
    footer {
      border-top: 1px solid var(--border);
      padding: 24px 0;
      color: var(--dim);
      font-size: 13px;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>github<span>-stats</span></h1>
      <p>Dynamic SVG stats widgets for GitHub profiles — built on Cloudflare Workers + KV</p>
      <div class="header-links">
        <a class="btn btn-primary" href="https://github.com/spokospace/github-stats">GitHub</a>
        <a class="btn" href="${baseUrl}/stack">Try /stack →</a>
      </div>
    </header>

    <main>
      <section id="endpoints">
        <h2>Endpoints</h2>
        <div class="preview-grid">
          ${endpoints.map(previewRow).join('')}
        </div>
      </section>

      <section id="usage">
        <h2>Usage</h2>
        <p style="color:var(--muted);margin-bottom:16px">Embed any widget directly in a GitHub README:</p>
        <pre><code>![langs](${baseUrl}/langs)
![stats](${baseUrl}/stats)
![streak](${baseUrl}/streak)
![repos](${baseUrl}/repos)
![contrib](${baseUrl}/contrib)
![trophies](${baseUrl}/trophies)
![stack](${baseUrl}/stack?techs=Laravel,Vue,TypeScript,Astro)</code></pre>

        <h3>Stack endpoint</h3>
        <pre><code>${baseUrl}/stack?techs=Laravel,Vue,TypeScript,Tailwind,PHP,Node.js,WordPress</code></pre>
      </section>

      <section id="theme">
        <h2>Theme Params</h2>
        <p style="color:var(--muted);margin-bottom:16px">All endpoints accept these URL query params. Hex values without the <code>#</code> prefix.</p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Param</th>
                <th>Type</th>
                <th>Default</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              ${themeParams.map(themeRow).join('')}
            </tbody>
          </table>
        </div>

        <h3>Examples</h3>
        <pre><code>${baseUrl}/langs?theme=light
${baseUrl}/langs?bg=0d1117&primary=58a6ff&text=c9d1d9&radius=6</code></pre>
      </section>

      <section id="deploy">
        <h2>Fork &amp; Deploy</h2>
        <div class="steps">
          <div class="step">
            <div class="step-num">1</div>
            <div class="step-body">
              <p>Fork the repo and clone it locally</p>
              <pre><code>git clone https://github.com/your-username/github-stats
cd github-stats
npm install</code></pre>
            </div>
          </div>
          <div class="step">
            <div class="step-num">2</div>
            <div class="step-body">
              <p>Create a GitHub personal access token with <code>read:user</code> and <code>repo</code> scopes, then add it as a Wrangler secret</p>
              <pre><code>npx wrangler secret put GITHUB_TOKEN</code></pre>
            </div>
          </div>
          <div class="step">
            <div class="step-num">3</div>
            <div class="step-body">
              <p>Add a token for the cache-bust endpoint</p>
              <pre><code>npx wrangler secret put CACHE_BUST_TOKEN</code></pre>
            </div>
          </div>
          <div class="step">
            <div class="step-num">4</div>
            <div class="step-body">
              <p>Update <code>OWNERS</code> in <code>src/index.ts</code> with your GitHub username(s), then deploy</p>
              <pre><code>npx wrangler deploy</code></pre>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer>
      <div class="container" style="padding:0">
        github-stats &mdash; MIT &mdash;
        <a href="https://github.com/spokospace/github-stats">spokospace/github-stats</a>
      </div>
    </footer>
  </div>
</body>
</html>`;
}
