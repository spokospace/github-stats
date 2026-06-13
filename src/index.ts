import type { Env, RepoData } from './types';
import { fetchLanguages, fetchStats, fetchStreak, fetchRepos, fetchContributions } from './github';
import { renderLangs } from './renderers/langs';
import { renderStats } from './renderers/stats';
import { renderStreak } from './renderers/streak';
import { renderRepos } from './renderers/repos';
import { renderContrib } from './renderers/contrib';
import { renderTrophies } from './renderers/trophies';
import { renderStack } from './renderers/stack';
import { renderProfile } from './renderers/profile';
import { buildTheme } from './svg/theme';
import { renderDoc } from './doc';

// ── Config ─────────────────────────────────────────────────────────────────
// Override via wrangler.toml [vars] for your own deployment:
const OWNERS = ['spokospace', 'polo-blue'];
const PRIMARY = OWNERS[0];
const TTL = 86400; // 24h cache

function svgResponse(body: string, ttl = TTL): Response {
  return new Response(body, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': `public, max-age=${ttl}, stale-while-revalidate=3600`,
      'Access-Control-Allow-Origin': '*',
    },
  });
}

async function cached<T>(kv: KVNamespace, key: string, fn: () => Promise<T>): Promise<T> {
  const hit = await kv.get(key, 'json') as T | null;
  if (hit) return hit;
  const data = await fn();
  await kv.put(key, JSON.stringify(data), { expirationTtl: TTL });
  return data;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '') || '/';
    const params = url.searchParams;

    // Build theme from URL params (all optional, fall back to defaults)
    // Usage: ?primary=ff6b6b&bg=0a0a0a&text=ffffff&radius=8
    const theme = buildTheme(params);

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*' } });
    }

    try {
      switch (path) {
        case '/': {
          return new Response(renderDoc(url.origin), {
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
          });
        }
        case '/langs': {
          const data = await cached(env.KV, 'langs', () => fetchLanguages(env.GITHUB_TOKEN, OWNERS));
          return svgResponse(renderLangs(data, theme));
        }
        case '/stats': {
          const data = await cached(env.KV, 'stats', () => fetchStats(env.GITHUB_TOKEN, OWNERS));
          return svgResponse(renderStats(data, theme));
        }
        case '/streak': {
          const data = await cached(env.KV, 'streak', () => fetchStreak(env.GITHUB_TOKEN, [PRIMARY]));
          return svgResponse(renderStreak(data, theme));
        }
        case '/repos': {
          const data = await cached(env.KV, 'repos', () => fetchRepos(env.GITHUB_TOKEN, OWNERS));
          return svgResponse(renderRepos(data, theme));
        }
        case '/contrib': {
          const data = await cached(env.KV, 'contrib', () => fetchContributions(env.GITHUB_TOKEN, [PRIMARY]));
          return svgResponse(renderContrib(data, theme));
        }
        case '/trophies': {
          const data = await cached(env.KV, 'stats', () => fetchStats(env.GITHUB_TOKEN, OWNERS));
          return svgResponse(renderTrophies(data, theme));
        }
        case '/profile': {
          const [pStats, pStreak] = await Promise.all([
            cached(env.KV, 'stats', () => fetchStats(env.GITHUB_TOKEN, OWNERS)),
            cached(env.KV, 'streak', () => fetchStreak(env.GITHUB_TOKEN, [PRIMARY])),
          ]);
          const rawHide = params.get('hide');
          const hide = new Set(
            rawHide === null
              ? ['contributions', 'streak']
              : rawHide.split(',').map((k: string) => k.trim().toLowerCase()).filter(Boolean)
          );
          const avatar = params.get('avatar') === '1';
          return svgResponse(renderProfile(pStats, pStreak, theme, hide, avatar));
        }
        case '/stack': {
          // ?techs=Laravel,Vue,TypeScript,Astro,PHP  (comma-separated, URL-encoded)
          const techsParam = params.get('techs') ?? 'Laravel,Vue,Astro,TypeScript,Tailwind,PHP,Node.js,WordPress';
          const techs = techsParam.split(',').map(t => t.trim()).filter(Boolean);
          return svgResponse(renderStack(techs, theme), 86400 * 7); // 7 day cache - purely static
        }
        case '/bust-cache': {
          const secret = params.get('token');
          if (secret !== env.CACHE_BUST_TOKEN) {
            return new Response('Unauthorized', { status: 401 });
          }
          for (const key of ['langs', 'stats', 'streak', 'repos', 'contrib']) {
            await env.KV.delete(key);
          }
          return new Response('Cache cleared', { status: 200 });
        }
        default:
          return new Response(JSON.stringify({
            endpoints: ['/langs', '/stats', '/streak', '/repos', '/contrib', '/trophies', '/stack'],
            usage: {
              theme: 'All endpoints accept ?primary=0d87cd&bg=030620&text=e5ecf6&radius=10',
              stack: '/stack?techs=Laravel,Vue,TypeScript',
              cache: '/bust-cache?token=YOUR_TOKEN',
            },
          }, null, 2), {
            headers: { 'Content-Type': 'application/json' },
          });
      }
    } catch (err: any) {
      return new Response(`Error: ${err.message}`, { status: 500 });
    }
  },
};
