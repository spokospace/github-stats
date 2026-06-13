import type { Env } from './types';
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

// Override via wrangler.toml [vars] for your own deployment:
const OWNERS = ['spokospace', 'polo-blue'];
const PRIMARY = OWNERS[0];
const TTL = 86400; // 24h cache
const STACK_TTL = TTL * 7;
const CACHE_KEYS = ['langs', 'stats', 'streak', 'repos', 'contrib'];

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

export async function handleRequest(request: Request, env: Env): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*' } });
  }

  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '') || '/';
  const params = url.searchParams;
  const theme = buildTheme(params);

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
        const data = await cached(env.KV, 'stats:2', () => fetchStats(env.GITHUB_TOKEN, OWNERS));
        return svgResponse(renderStats(data, theme));
      }
      case '/streak': {
        const data = await cached(env.KV, 'streak:2', () => fetchStreak(env.GITHUB_TOKEN, [PRIMARY]));
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
        const data = await cached(env.KV, 'stats:2', () => fetchStats(env.GITHUB_TOKEN, OWNERS));
        return svgResponse(renderTrophies(data, theme));
      }
      case '/profile': {
        const [pStats, pStreak] = await Promise.all([
          cached(env.KV, 'stats:2', () => fetchStats(env.GITHUB_TOKEN, OWNERS)),
          cached(env.KV, 'streak:2', () => fetchStreak(env.GITHUB_TOKEN, [PRIMARY])),
        ]);
        const rawHide = params.get('hide');
        const hide = new Set(
          rawHide === null
            ? ['contributions', 'streak']
            : rawHide.split(',').map((k: string) => k.trim().toLowerCase()).filter(Boolean)
        );
        return svgResponse(renderProfile(pStats, pStreak, theme, hide, params.get('avatar') === '1'));
      }
      case '/stack': {
        const techsParam = params.get('techs') ?? 'Laravel,Vue,Astro,TypeScript,Tailwind,PHP,Node.js,WordPress';
        return svgResponse(renderStack(techsParam.split(',').map(t => t.trim()).filter(Boolean), theme), STACK_TTL);
      }
      case '/bust-cache': {
        if (params.get('token') !== env.CACHE_BUST_TOKEN) {
          return new Response('Unauthorized', { status: 401 });
        }
        await Promise.all(CACHE_KEYS.map(k => env.KV.delete(k)));
        return new Response('Cache cleared', { status: 200 });
      }
      default:
        return new Response(JSON.stringify({
          endpoints: ['/langs', '/stats', '/streak', '/repos', '/contrib', '/trophies', '/stack', '/profile'],
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
}
