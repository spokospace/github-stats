// Cloudflare Pages Functions entry point
import type { Env } from '../src/types';
import { fetchLanguages, fetchStats, fetchStreak, fetchRepos, fetchContributions } from '../src/github';
import { renderLangs } from '../src/renderers/langs';
import { renderStats } from '../src/renderers/stats';
import { renderStreak } from '../src/renderers/streak';
import { renderRepos } from '../src/renderers/repos';
import { renderContrib } from '../src/renderers/contrib';
import { renderTrophies } from '../src/renderers/trophies';
import { renderStack } from '../src/renderers/stack';
import { renderProfile } from '../src/renderers/profile';
import { buildTheme, normalizeHex } from '../src/svg/theme';
import { renderDoc } from '../src/doc';
import { renderIcon } from '../src/renderers/icon';

const OWNERS = ['spokospace', 'polo-blue'];
const PRIMARY = OWNERS[0];
const TTL = 86400;
const STATIC_TTL = TTL * 7;

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

export const onRequest: PagesFunction<Env> = async ({ request, env, params }) => {
  const route = params.route;
  const path = '/' + (Array.isArray(route) ? route.join('/') : (route ?? ''));
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const theme = buildTheme(searchParams);

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
        const rawHide = searchParams.get('hide');
        const hide = new Set(
          rawHide === null
            ? ['contributions', 'streak']
            : rawHide.split(',').map(k => k.trim().toLowerCase()).filter(Boolean)
        );
        const avatar = searchParams.get('avatar') === '1';
        return svgResponse(renderProfile(pStats, pStreak, theme, hide, avatar));
      }
      case '/stack': {
        const techsParam = searchParams.get('techs') ?? 'Laravel,Vue,Astro,TypeScript,Tailwind,PHP,Node.js,WordPress';
        const techs = techsParam.split(',').map(t => t.trim()).filter(Boolean);
        return svgResponse(renderStack(techs, theme), STATIC_TTL);
      }
      case '/icon': {
        const name = searchParams.get('name') ?? '';
        if (!name) return new Response('Missing param: name', { status: 400 });
        const color = normalizeHex(searchParams.get('color'), theme.primary);
        const size = parseInt(searchParams.get('size') ?? '', 10) || 16;
        const svg = renderIcon(name, color, size);
        if (!svg) return new Response(`Unknown icon: ${name}`, { status: 404 });
        return svgResponse(svg, STATIC_TTL);
      }
      case '/bust-cache': {
        if (searchParams.get('token') !== env.CACHE_BUST_TOKEN) {
          return new Response('Unauthorized', { status: 401 });
        }
        for (const key of ['langs', 'stats', 'streak', 'repos', 'contrib']) {
          await env.KV.delete(key);
        }
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
        }, null, 2), { headers: { 'Content-Type': 'application/json' } });
    }
  } catch (err: any) {
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
};
