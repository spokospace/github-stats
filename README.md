# github-stats

Cloudflare Pages project generating SVG stats widgets for GitHub profile — styled with [spoko.space](https://spoko.space) colors.
Aggregates data from multiple accounts (`spokospace` + `polo-blue`) including private repositories.

Live demo: **[github.spoko.space](https://github.spoko.space)**

> Widgets switch between dark and light theme automatically via `prefers-color-scheme`. Use the `<picture>` snippet below each widget for your own README.

## Widgets

### Profile HUD
Radar-style card with animated orbit dots (streak, commits, PRs, stars, repos, followers) and hover labels.

```html
<picture>
  <source media="(prefers-color-scheme: light)" srcset="https://github.spoko.space/profile?theme=light">
  <img src="https://github.spoko.space/profile" alt="Profile">
</picture>
```

<picture>
  <source media="(prefers-color-scheme: light)" srcset="https://github.spoko.space/profile?theme=light&v=3">
  <img src="https://github.spoko.space/profile?v=3" alt="Profile HUD">
</picture>

### Stats
Commits, PRs, stars, forks, issues, followers and more.

```html
<picture>
  <source media="(prefers-color-scheme: light)" srcset="https://github.spoko.space/stats?theme=light">
  <img src="https://github.spoko.space/stats" alt="Stats">
</picture>
```

<picture>
  <source media="(prefers-color-scheme: light)" srcset="https://github.spoko.space/stats?theme=light">
  <img src="https://github.spoko.space/stats" alt="Stats">
</picture>

### Languages
Most used languages by bytes of code (top 10, forks excluded).

```html
<picture>
  <source media="(prefers-color-scheme: light)" srcset="https://github.spoko.space/langs?theme=light">
  <img src="https://github.spoko.space/langs" alt="Languages">
</picture>
```

<picture>
  <source media="(prefers-color-scheme: light)" srcset="https://github.spoko.space/langs?theme=light">
  <img src="https://github.spoko.space/langs" alt="Languages">
</picture>

### Contribution Streak
Current streak, longest streak, total contributions.

```html
<picture>
  <source media="(prefers-color-scheme: light)" srcset="https://github.spoko.space/streak?theme=light">
  <img src="https://github.spoko.space/streak" alt="Streak">
</picture>
```

<picture>
  <source media="(prefers-color-scheme: light)" srcset="https://github.spoko.space/streak?theme=light">
  <img src="https://github.spoko.space/streak" alt="Streak">
</picture>

### Tech Stack
Customisable chip row with simple-icons icons and official brand colors.

```html
<picture>
  <source media="(prefers-color-scheme: light)" srcset="https://github.spoko.space/stack?techs=Laravel,Vue,TypeScript,Astro,PHP&theme=light">
  <img src="https://github.spoko.space/stack?techs=Laravel,Vue,TypeScript,Astro,PHP" alt="Stack">
</picture>
```

<picture>
  <source media="(prefers-color-scheme: light)" srcset="https://github.spoko.space/stack?techs=Laravel,Vue,TypeScript,Astro,PHP&theme=light">
  <img src="https://github.spoko.space/stack?techs=Laravel,Vue,TypeScript,Astro,PHP" alt="Tech Stack">
</picture>

### Contribution Calendar
Full-year heatmap.

```html
<picture>
  <source media="(prefers-color-scheme: light)" srcset="https://github.spoko.space/contrib?theme=light">
  <img src="https://github.spoko.space/contrib" alt="Contributions">
</picture>
```

<picture>
  <source media="(prefers-color-scheme: light)" srcset="https://github.spoko.space/contrib?theme=light">
  <img src="https://github.spoko.space/contrib" alt="Contribution Calendar">
</picture>

### Trophies
Achievement trophies ranked C → SSS.

```html
<picture>
  <source media="(prefers-color-scheme: light)" srcset="https://github.spoko.space/trophies?theme=light">
  <img src="https://github.spoko.space/trophies" alt="Trophies">
</picture>
```

<picture>
  <source media="(prefers-color-scheme: light)" srcset="https://github.spoko.space/trophies?theme=light">
  <img src="https://github.spoko.space/trophies" alt="Trophies">
</picture>

### Featured Repos
Top repositories by stars.

```html
<picture>
  <source media="(prefers-color-scheme: light)" srcset="https://github.spoko.space/repos?theme=light">
  <img src="https://github.spoko.space/repos" alt="Repos">
</picture>
```

<picture>
  <source media="(prefers-color-scheme: light)" srcset="https://github.spoko.space/repos?theme=light">
  <img src="https://github.spoko.space/repos" alt="Featured Repos">
</picture>

## Theme customisation

All endpoints accept query params to override the default color palette:

| Param | Default | Example |
|-------|---------|---------|
| `primary` | `0d87cd` | `?primary=ff6b6b` |
| `bg` | `030620` | `?bg=0a0a0a` |
| `text` | `e5ecf6` | `?text=ffffff` |
| `textMuted` | `6b7db3` | |
| `border` | `1a2444` | |
| `radius` | `10` | `?radius=4` |

Named presets: `?theme=light`, `?theme=dracula`, `?theme=nord`, `?theme=gruvbox`, `?theme=solarized`, `?theme=monokai`, `?theme=catppuccin`, `?theme=tokyo`, `?theme=rose`, `?theme=forest`

## Endpoints

| Endpoint | Description |
|----------|-------------|
| `/` | API documentation page |
| `/profile` | Radar HUD with orbit dots, streak & stats |
| `/langs` | Most used languages (bar chart) |
| `/stats` | Commits, PRs, stars, forks, issues, followers |
| `/streak` | Contribution streak: current, longest, total |
| `/repos` | Featured repositories |
| `/contrib` | Contribution calendar (full year) |
| `/trophies` | Achievement trophies C → SSS |
| `/stack` | Tech stack chips (`?techs=Laravel,Vue,...`) |
| `/icon` | Single SVG icon (`?name=bolt&color=0d87cd&size=20`, add `&circle=1` for badge style) |
| `/bust-cache?token=SECRET` | Clear KV cache |

## Fork & deploy your own

1. Fork this repo on GitHub
2. Connect it to **Cloudflare Pages** in the dashboard (no build command needed)
3. Create a KV namespace in your Cloudflare account and add its ID to `wrangler.toml`
4. In the Pages project settings add these environment variables / secrets:
   - `GITHUB_TOKEN` — PAT with scopes `repo` + `read:org`
   - `CACHE_BUST_TOKEN` — any random string
5. Edit `OWNERS` and `PRIMARY` in `src/router.ts` to point at your own accounts
6. Push to `main` — Pages auto-deploys on every push

## Stack
- Cloudflare Pages + Functions (TypeScript)
- GitHub GraphQL API v4
- Cloudflare KV — 24h cache
- [simple-icons](https://simpleicons.org/) — tech stack icons
- Pure SVG — zero client-side dependencies
