/**
 * Same-origin proxy for the LaundryBer API.
 *
 * The SPA is served from Cloudflare Pages and the Express/Socket.IO backend
 * runs on Vercel. Calling the Vercel origin directly makes every request
 * cross-site, which means the session cookie would need `SameSite=None` and
 * would be blocked by Safari.
 *
 * Routing `/api/*` through this Function keeps the browser talking to a single
 * origin, so session cookies stay first-party and `SameSite=Lax` is correct.
 *
 * Config: set `BACKEND_ORIGIN` on the Pages project to the Vercel URL,
 * e.g. https://laundryber.vercel.app (no trailing slash, no /api suffix).
 */

interface Env {
  BACKEND_ORIGIN?: string;
}

interface PagesContext {
  request: Request;
  env: Env;
}

const json = (body: unknown, status: number): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });

export const onRequest = async ({ request, env }: PagesContext): Promise<Response> => {
  const origin = env.BACKEND_ORIGIN?.trim();

  if (!origin) {
    return json(
      { error: 'BACKEND_ORIGIN is not configured for this Pages project.' },
      500
    );
  }

  const incoming = new URL(request.url);

  let target: URL;
  try {
    target = new URL(incoming.pathname + incoming.search, origin);
  } catch {
    return json({ error: `BACKEND_ORIGIN is not a valid URL: ${origin}` }, 500);
  }

  // Reuse the original request as the init so method, body, and headers are
  // preserved. This matters for the Socket.IO handshake at /api/socket.io:
  // rebuilding headers by hand can drop `Upgrade`/`Connection` and break it.
  const upstream = new Request(target.toString(), request);

  try {
    return await fetch(upstream, { redirect: 'manual' });
  } catch (error) {
    return json(
      {
        error: 'Failed to reach the backend.',
        detail: error instanceof Error ? error.message : String(error),
      },
      502
    );
  }
};
