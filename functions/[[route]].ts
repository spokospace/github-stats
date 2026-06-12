// Cloudflare Pages Functions entry point
// Replaces src/index.ts for Pages deployment

import type { Env } from '../src/types';
import { fetchLanguages, fetchStats, fetchStreak, fetchRepos, fetchContributions } from '../src/github';
import { renderLangs } from '../src/renderers/langs';
import { renderStats } from '../src/renderers/stats';
import { renderStreak } from '../src/renderers/streak';
import { renderRepos } from '../src/renderers/repos';
import { renderContrib } from '../src/renderers/contrib';
import { renderTrophies } from '../src/renderers/trophies';

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

export const onRequest: PagesFunction<Env> = async ({ request, env, params }) => {
  const route = params.route;
  const path = '/' + (Array.isArray(route) ? route.join('/') : (route ?? ''));

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
        const url = new URL(request.url);
        if (url.searchParams.get('token') !== env.CACHE_BUST_TOKEN) {
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
        }), { headers: { 'Content-Type': 'application/json' } });
    }
  } catch (err: any) {
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
};
