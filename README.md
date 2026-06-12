# github-stats

Cloudflare Worker generating SVG stats widgets for GitHub profile — styled with [spoko.space](https://spoko.space) colors.
Aggregates data from multiple accounts (`spokospace` + `polo-blue`) including private repositories.

## Endpoints

| Endpoint | Description |
|----------|-------------|
| `/langs` | Most used languages (bar chart) |
| `/stats` | Commits, PRs, stars, forks, issues, followers... |
| `/streak` | Contribution streak: current, longest, total |
| `/repos` | Featured/pinned repositories |
| `/contrib` | Contribution calendar (full year) |
| `/trophies` | Achievement trophies C → SSS |
| `/bust-cache?token=SECRET` | Clear KV cache |

## Setup

```bash
npm install
wrangler kv namespace create STATS_KV   # copy id to wrangler.toml
wrangler secret put GITHUB_TOKEN        # PAT: scopes repo + read:org
wrangler secret put CACHE_BUST_TOKEN    # random string
npm run deploy
```

## Usage in README

```markdown
![Stats](https://github-stats.YOUR.workers.dev/stats)
![Langs](https://github-stats.YOUR.workers.dev/langs)
![Streak](https://github-stats.YOUR.workers.dev/streak)
![Trophies](https://github-stats.YOUR.workers.dev/trophies)
![Contrib](https://github-stats.YOUR.workers.dev/contrib)
```

## Stack
- Cloudflare Workers (TypeScript)
- GitHub GraphQL API v4
- Cloudflare KV — 24h cache
- Pure SVG — zero runtime dependencies
