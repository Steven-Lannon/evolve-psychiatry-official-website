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
 *   - Same for condition slugs (e.g. /adhd-adult) once those individual
 *     pages exist, plus the /conditions-we-treat listing page itself.
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

const VERCEL_APP_URL = "https://steven-lannon-provider-unique-page.vercel.app";

// Legacy redirects that used to live in Squarespace's own "URL Mappings"
// feature. Handled directly here instead, since Squarespace's mapping
// system doesn't reliably fire for requests passed through by this
// Worker. Add any future redirect here too — the key is the path with
// no leading slash, the value is the full destination URL.
const LEGACY_REDIRECTS = {
  "tms-therapy": "https://evolvepsychiatry.com/tms",
  "counseling-therapy": "https://evolvepsychiatry.com/talk-therapy",
  "patient-scales": "https://evolvepsychiatry.com/patient-scales-packet",
  "patient-resources": "https://evolvepsychiatry.com/new-patient",
  "referrals": "https://evolvepsychiatry.com/refer-patient",
  "updatemyinsurance": "https://evolvepsychiatry.com/update-insurance",
  "patient-portal": "https://evolvepsychiatry.com/portal",
  "clinician-directory": "https://evolvepsychiatry.com/clinicians",
  "providers": "https://evolvepsychiatry.com/clinicians",
};

// Paths that should always route to Vercel regardless of the dynamic
// slug lists below — static/known Next.js routes that aren't
// provider or condition detail pages themselves (e.g. listing pages).
const STATIC_VERCEL_PATHS = new Set(["conditions-we-treat"]);

// How long this Worker caches the list of valid provider/condition
// slugs at the edge before re-checking with Vercel for new/removed ones.
const SLUG_LIST_CACHE_SECONDS = 300;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/^\/+/, ""); // strip leading slash

    // Handle legacy redirects at the edge, instantly, independent of
    // Squarespace's own redirect system.
    if (LEGACY_REDIRECTS[path]) {
      return Response.redirect(LEGACY_REDIRECTS[path], 301);
    }

    // Next.js static assets (CSS, JS chunks, images, etc.) always live
    // under /_next/... on the Vercel deployment — these must always be
    // proxied there directly, since they have slashes/dots that would
    // otherwise get caught by the "not a provider page" check below,
    // and Squarespace has no idea what these files are.
    if (path.startsWith("_next/")) {
      return proxyToVercel(path, request);
    }

    // Anything with a nested path (e.g. /blog/some-post), an empty path
    // (the homepage), or a file extension is never a provider/condition
    // page — skip the slug checks entirely and go straight to Squarespace.
    if (!path || path.includes("/") || path.includes(".")) {
      return fetch(request);
    }

    // Known static Vercel routes (e.g. the conditions listing page)
    // always proxy, no slug lookup needed.
    if (STATIC_VERCEL_PATHS.has(path)) {
      return proxyToVercel(path, request);
    }

    const [validProviderSlugs, validConditionSlugs] = await Promise.all([
      getValidSlugs(ctx, "/api/slugs"),
      getValidSlugs(ctx, "/api/condition-slugs"),
    ]);

    if (validProviderSlugs.has(path) || validConditionSlugs.has(path)) {
      return proxyToVercel(path, request);
    }

    // Not a provider or condition slug — pass through to Squarespace
    // untouched.
    return fetch(request);
  },
};

async function proxyToVercel(path, request) {
  // Serve the fully static, pre-rendered page from Vercel instead of
  // Squarespace's JavaScript-rendered version.
  const vercelUrl = `${VERCEL_APP_URL}/${path}`;
  const vercelResponse = await fetch(vercelUrl, {
    headers: request.headers,
  });

  // Build a fresh Headers object explicitly (rather than mutating
  // anything derived from the fetch response) so we control caching
  // at Cloudflare's edge too, and so the browser sees this as coming
  // from your own domain.
  const responseHeaders = new Headers(vercelResponse.headers);
  responseHeaders.set(
    "Cache-Control",
    "public, max-age=300, stale-while-revalidate=3600"
  );

  return new Response(vercelResponse.body, {
    status: vercelResponse.status,
    statusText: vercelResponse.statusText,
    headers: responseHeaders,
  });
}

async function getValidSlugs(ctx, apiPath) {
  const cache = caches.default;
  const cacheKey = new Request(`${VERCEL_APP_URL}${apiPath}`);
  let response = await cache.match(cacheKey);

  if (!response) {
    const fetched = await fetch(`${VERCEL_APP_URL}${apiPath}`);
    if (fetched.ok) {
      // Cloudflare Workers treats a fetch() response's headers as
      // immutable, even after .clone() — so we build a brand new
      // Response with a fresh Headers object instead of trying to
      // modify the cloned one directly, which throws otherwise.
      const bodyText = await fetched.clone().text();
      const cacheableResponse = new Response(bodyText, {
        status: fetched.status,
        headers: {
          "Content-Type": fetched.headers.get("Content-Type") || "application/json",
          "Cache-Control": `public, max-age=${SLUG_LIST_CACHE_SECONDS}`,
        },
      });
      ctx.waitUntil(cache.put(cacheKey, cacheableResponse.clone()));
      response = cacheableResponse;
    } else {
      response = fetched;
    }
  }

  if (!response.ok) return new Set();
  const data = await response.json();
  return new Set(data.slugs || []);
}
