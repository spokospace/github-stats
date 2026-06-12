import type { Env } from './types';
import { fetchLanguages, fetchStats, fetchStreak, fetchRepos, fetchContributions } from './github';
import { renderLangs } from './renderers/langs';
import { renderStats } from './renderers/stats';
import { renderStreak } from './renderers/streak';
import { renderRepos } from './renderers/repos';
import { renderContrib } from './renderers/contrib';
import { renderTrophies } from './renderers/trophies';

const OWNERS = ['spokospace', 'polo-blue'];
const PRIMARY = OWNERS[0];
const TTL = 86400; // 24h

function svgResponse(body: string): Response {
  return new Response(body, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': `public, max-age=${TTL}, stale-while-revalidate=3600`,
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

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*' } });
    }

    try {
      switch (path) {
        case '/langs': {
          const data = await cached(env.KV, 'langs', () => fetchLanguages(env.GITHUB_TOKEN, OWNERS));
          return svgResponse(renderLangs(data));
        }
        case '/stats': {
          const data = await cached(env.KV, 'stats', () => fetchStats(env.GITHUB_TOKEN, OWNERS));
          return svgResponse(renderStats(data));
        }
        case '/streak': {
          const data = await cached(env.KV, 'streak', () => fetchStreak(env.GITHUB_TOKEN, PRIMARY));
          return svgResponse(renderStreak(data));
        }
        case '/repos': {
          const data = await cached(env.KV, 'repos', () => fetchRepos(env.GITHUB_TOKEN, PRIMARY));
          return svgResponse(renderRepos(data));
        }
        case '/contrib': {
          const data = await cached(env.KV, 'contrib', () => fetchContributions(env.GITHUB_TOKEN, PRIMARY));
          return svgResponse(renderContrib(data));
        }
        case '/trophies': {
          const data = await cached(env.KV, 'stats', () => fetchStats(env.GITHUB_TOKEN, OWNERS));
          return svgResponse(renderTrophies(data));
        }
        case '/bust-cache': {
          // Simple auth via token param
          const secret = url.searchParams.get('token');
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
            endpoints: ['/langs', '/stats', '/streak', '/repos', '/contrib', '/trophies'],
            usage: 'Use ?bust=1 param to force refresh (respects TTL)',
          }), {
            headers: { 'Content-Type': 'application/json' },
          });
      }
    } catch (err: any) {
      return new Response(`Error: ${err.message}`, { status: 500 });
    }
  },
};
