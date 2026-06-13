import type { Env } from './types';
import { handleRequest } from './router';

export default {
  fetch(request: Request, env: Env): Promise<Response> {
    return handleRequest(request, env);
  },
};
