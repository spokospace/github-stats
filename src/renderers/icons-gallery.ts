import type { Theme } from '../svg/theme';
import { UI_ICON_GROUPS, TECH_ICON_GROUPS, type IconGroup } from '../svg/icon-groups';

export function renderIconsGallery(baseUrl: string, theme: Theme): string {
  const colorHex = theme.primary.replace('#', '');

  // One row per icon. The <img> gets a server-side src so icons show without JS;
  // the configurator (color + circle) updates src and the copy snippet live.
  const iconRow = (name: string) => `
              <tr>
                <td class="icon-preview"><img class="gicon" data-name="${name}" src="${baseUrl}/icon?name=${encodeURIComponent(name)}&color=${colorHex}&size=28" alt="${name}" /></td>
                <td class="icon-name-cell"><code>${name}</code></td>
                <td class="icon-usage"><code class="gsnippet" data-name="${name}"></code></td>
                <td class="icon-copy"><button class="copy-btn" type="button" data-name="${name}">Copy</button></td>
              </tr>`;

  const sectionHtml = (groups: IconGroup[]) => groups.map(({ title, names }) => `
    <div class="icon-section">
      <h3>${title}</h3>
      <table class="icon-table">
        <tbody>${names.map(iconRow).join('')}</tbody>
      </table>
    </div>
  `).join('');

  const uiIconsHtml = sectionHtml(UI_ICON_GROUPS);
  const techIconsHtml = sectionHtml(TECH_ICON_GROUPS);

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
      --card: ${theme.bgCard};
      --border: ${theme.border};
      --primary: ${theme.primary};
      --text: ${theme.text};
      --muted: ${theme.textMuted};
      --radius: ${theme.radius}px;
      --ok: #5fe06a;
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
      margin-bottom: 24px;
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

    /* ── Configurator ───────────────────────────────── */
    .configurator {
      position: sticky;
      top: 0;
      z-index: 10;
      display: flex;
      align-items: center;
      gap: 28px;
      flex-wrap: wrap;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 14px 20px;
      margin-bottom: 32px;
      backdrop-filter: blur(8px);
    }

    .configurator .cfg-field {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
    }

    .configurator label { cursor: pointer; user-select: none; }

    .configurator input[type="color"] {
      width: 40px;
      height: 30px;
      padding: 0;
      border: 1px solid var(--border);
      border-radius: 6px;
      background: none;
      cursor: pointer;
    }

    .configurator input[type="checkbox"] {
      width: 18px;
      height: 18px;
      accent-color: var(--primary);
      cursor: pointer;
    }

    .configurator input[type="number"] {
      width: 66px;
      padding: 5px 8px;
      border: 1px solid var(--border);
      border-radius: 6px;
      background: var(--bg);
      color: var(--text);
      font-family: 'Courier New', monospace;
      font-size: 13px;
    }

    .cfg-hex {
      font-family: 'Courier New', monospace;
      font-size: 13px;
      color: var(--muted);
      min-width: 64px;
    }

    .cfg-hint {
      margin-left: auto;
      color: var(--muted);
      font-size: 12px;
    }

    .icon-section { margin-bottom: 32px; }

    .icon-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
    }

    .icon-table tr {
      border-bottom: 1px solid var(--border);
      transition: background 0.2s;
    }

    .icon-table tr:hover { background: var(--card); }

    .icon-table td {
      padding: 10px 12px;
      vertical-align: middle;
    }

    .icon-preview {
      width: 64px;
      text-align: center;
    }

    /* No fixed size — the preview reflects the SVG's intrinsic size (the &size= param,
       capped at 48 by the configurator) so the Size control visibly resizes it. */
    .icon-preview img {
      display: block;
      margin: 0 auto;
      max-width: 48px;
      max-height: 48px;
    }

    .icon-name-cell {
      width: 140px;
      font-weight: 500;
    }

    .icon-name-cell code {
      background: var(--bg);
      padding: 4px 8px;
    }

    .icon-usage {
      color: var(--muted);
      font-size: 12px;
    }

    .icon-usage code {
      background: var(--bg);
      padding: 4px 8px;
      font-size: 11px;
      display: block;
      word-break: break-all;
    }

    .icon-copy {
      width: 80px;
      text-align: right;
    }

    .copy-btn {
      font-family: inherit;
      font-size: 12px;
      padding: 5px 12px;
      border: 1px solid var(--border);
      border-radius: 6px;
      background: var(--bg);
      color: var(--muted);
      cursor: pointer;
      white-space: nowrap;
      transition: color 0.15s, border-color 0.15s;
    }

    .copy-btn:hover { color: var(--text); border-color: var(--primary); }
    .copy-btn.copied { color: var(--ok); border-color: var(--ok); }

    code {
      background: var(--bg);
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
      font-size: 13px;
    }

    a { color: var(--primary); text-decoration: none; }
    a:hover { text-decoration: underline; }

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

    <div class="configurator">
      <div class="cfg-field">
        <label for="cfg-color">Color</label>
        <input type="color" id="cfg-color" value="#${colorHex}">
        <span class="cfg-hex" id="cfg-hex">#${colorHex}</span>
      </div>
      <div class="cfg-field">
        <input type="checkbox" id="cfg-circle">
        <label for="cfg-circle">Circle background</label>
      </div>
      <div class="cfg-field">
        <label for="cfg-size">Size</label>
        <input type="number" id="cfg-size" min="8" max="96" step="2" value="20">
        <span class="cfg-hex">px</span>
      </div>
      <span class="cfg-hint">Tweak the options — previews &amp; copy snippets update live.</span>
    </div>

    <section>
      <h2>UI Icons (Phosphor thin)</h2>
      ${uiIconsHtml}
    </section>

    <section>
      <h2>Tech Stack Icons (50+)</h2>
      <p style="color: var(--muted); margin-bottom: 24px;">Brand-colored logos keep their own colors; the Color option applies to single-color (Phosphor &amp; simple-icons) glyphs.</p>
      ${techIconsHtml}
    </section>

    <footer>
      github-stats — <a href="https://github.com/spokospace/github-stats">View on GitHub</a> —
      <a href="${baseUrl}/">API Docs</a>
    </footer>
  </div>

  <script>
    (function () {
      var BASE = ${JSON.stringify(baseUrl)};
      var colorEl = document.getElementById('cfg-color');
      var circleEl = document.getElementById('cfg-circle');
      var sizeEl = document.getElementById('cfg-size');
      var hexEl = document.getElementById('cfg-hex');
      var icons = document.querySelectorAll('img.gicon');
      var snips = document.querySelectorAll('code.gsnippet');

      function hex() { return colorEl.value.replace('#', ''); }
      function circle() { return circleEl.checked; }
      function size() {
        var n = parseInt(sizeEl.value, 10);
        return Math.min(Math.max(isNaN(n) ? 20 : n, 8), 96);
      }

      function iconUrl(name, px) {
        return BASE + '/icon?name=' + encodeURIComponent(name) + '&color=' + hex() + '&size=' + px + (circle() ? '&circle=1' : '');
      }
      function snippet(name) {
        var px = size();
        return '<img src="' + iconUrl(name, px) + '" height="' + px + '" />';
      }

      function refresh() {
        hexEl.textContent = '#' + hex();
        var previewPx = Math.min(size(), 48); // cap on-page preview so rows stay tidy
        icons.forEach(function (img) { img.src = iconUrl(img.dataset.name, previewPx); });
        snips.forEach(function (code) { code.textContent = snippet(code.dataset.name); });
      }

      // Coalesce rapid input events (color drag, size spin) into one update per frame.
      var pending = false;
      function schedule() {
        if (pending) return;
        pending = true;
        requestAnimationFrame(function () { pending = false; refresh(); });
      }

      colorEl.addEventListener('input', schedule);
      circleEl.addEventListener('change', schedule);
      sizeEl.addEventListener('input', schedule);

      document.querySelectorAll('.copy-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var text = snippet(btn.dataset.name);
          var done = function () {
            var prev = btn.textContent;
            btn.textContent = 'Copied!';
            btn.classList.add('copied');
            setTimeout(function () { btn.textContent = prev; btn.classList.remove('copied'); }, 1200);
          };
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(done).catch(function () {});
          } else {
            var ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            try { document.execCommand('copy'); done(); } catch (e) {}
            document.body.removeChild(ta);
          }
        });
      });

      refresh();
    })();
  </script>
</body>
</html>`;
}
