# github-stats

Cloudflare Pages project generating SVG stats widgets for GitHub profile — styled with [spoko.space](https://spoko.space) colors.
Aggregates data from multiple accounts (`spokospace` + `polo-blue`) including private repositories.

Live demo: **[github.spoko.space](https://github.spoko.space)**

## Widgets

### Profile HUD
Radar-style card with animated orbit dots (streak, commits, PRs, stars, repos, followers) and hover labels.

```markdown
![Profile](https://github.spoko.space/profile)
```

[![Profile](https://github.spoko.space/profile?v=3)](https://github.spoko.space/profile)

### Stats
Commits, PRs, stars, forks, issues, followers and more.

```markdown
![Stats](https://github.spoko.space/stats)
```

[![Stats](https://github.spoko.space/stats)](https://github.spoko.space/stats)

### Languages
Most used languages by bytes of code (top 10, forks excluded).

```markdown
![Langs](https://github.spoko.space/langs)
```

[![Langs](https://github.spoko.space/langs)](https://github.spoko.space/langs)

### Contribution Streak
Current streak, longest streak, total contributions.

```markdown
![Streak](https://github.spoko.space/streak)
```

[![Streak](https://github.spoko.space/streak)](https://github.spoko.space/streak)

### Tech Stack
Customisable chip row with simple-icons icons and official brand colors.

```markdown
![Stack](https://github.spoko.space/stack?techs=Laravel,Vue,TypeScript,Astro,PHP)
```

[![Stack](https://github.spoko.space/stack?techs=Laravel,Vue,TypeScript,Astro,PHP)](https://github.spoko.space/stack)

### Contribution Calendar
Full-year heatmap.

```markdown
![Contrib](https://github.spoko.space/contrib)
```

[![Contrib](https://github.spoko.space/contrib)](https://github.spoko.space/contrib)

### Trophies
Achievement trophies ranked C → SSS.

```markdown
![Trophies](https://github.spoko.space/trophies)
```

[![Trophies](https://github.spoko.space/trophies)](https://github.spoko.space/trophies)

### Featured Repos
Top repositories by stars.

```markdown
![Repos](https://github.spoko.space/repos)
```

[![Repos](https://github.spoko.space/repos)](https://github.spoko.space/repos)

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
