/**
 * Evolve Psychiatry — Provider Page Router
 * ------------------------------------------------------
 * Deploy this as a Cloudflare Worker with a route of:
 *   evolvepsychiatry.com/*
 *
 * What it does:
 *   - For any request whose path matches a known provider slug
 *     (e.g. /priyadarshan-bajpayi), it fetches and serves the fully
 *     static, pre-rendered page from the Vercel deployment instead.
 *   - For every other request (your homepage, blog, services, existing
 *     /prescribers and /therapists directory pages, etc.), it passes
 *     the request straight through to Squarespace, completely untouched.
 *
 * Setup:
 *   1. Replace VERCEL_APP_URL below with your actual Vercel deployment
 *      URL (e.g. "https://evolve-providers.vercel.app").
 *   2. In the Cloudflare dashboard: Workers & Pages -> Create -> paste
 *      this code in.
 *   3. Under the Worker's Settings -> Triggers -> Routes, add:
 *        evolvepsychiatry.com/*
 *   4. Deploy.
 */

const VERCEL_APP_URL = "https://YOUR-VERCEL-DEPLOYMENT.vercel.app";

// How long this Worker caches the list of valid provider slugs at the
// edge before re-checking with Vercel for new/removed providers.
const SLUG_LIST_CACHE_SECONDS = 300;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/^\/+/, ""); // strip leading slash

    // Anything with a nested path (e.g. /blog/some-post), an empty path
    // (the homepage), or a file extension is never a provider page —
    // skip the slug check entirely and go straight to Squarespace.
    if (!path || path.includes("/") || path.includes(".")) {
      return fetch(request);
    }

    const validSlugs = await getValidSlugs(ctx);

    if (validSlugs.has(path)) {
      // Serve the fully static, pre-rendered page from Vercel instead
      // of Squarespace's JavaScript-rendered version.
      const vercelUrl = `${VERCEL_APP_URL}/${path}`;
      const vercelResponse = await fetch(vercelUrl, {
        headers: request.headers,
      });

      // Re-wrap the response so we control caching at Cloudflare's edge
      // too, and so the browser sees this as coming from your own domain.
      const response = new Response(vercelResponse.body, vercelResponse);
      response.headers.set(
        "Cache-Control",
        "public, max-age=300, stale-while-revalidate=3600"
      );
      return response;
    }

    // Not a provider slug — pass through to Squarespace untouched.
    return fetch(request);
  },
};

async function getValidSlugs(ctx) {
  const cache = caches.default;
  const cacheKey = new Request(`${VERCEL_APP_URL}/api/slugs`);
  let response = await cache.match(cacheKey);

  if (!response) {
    response = await fetch(`${VERCEL_APP_URL}/api/slugs`);
    if (response.ok) {
      const cloned = response.clone();
      cloned.headers.set(
        "Cache-Control",
        `public, max-age=${SLUG_LIST_CACHE_SECONDS}`
      );
      ctx.waitUntil(cache.put(cacheKey, cloned));
    }
  }

  if (!response.ok) return new Set();
  const data = await response.json();
  return new Set(data.slugs || []);
}
