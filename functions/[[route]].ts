// Cloudflare Pages Functions entry point
import type { Env } from '../src/types';
import { handleRequest } from '../src/router';

export const onRequest: PagesFunction<Env> = ({ request, env }) => handleRequest(request, env);
