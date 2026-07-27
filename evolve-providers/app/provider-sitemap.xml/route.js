import { getAllProviders } from "../../lib/sheets";

// Served at https://evolvepsychiatry.com/provider-sitemap.xml (once the
// Cloudflare Worker is updated to route this path here). Deliberately a
// different filename than /sitemap.xml, since that path is already
// served by Squarespace itself and the Worker would pass a request for
// the exact name "sitemap.xml" straight through to Squarespace, never
// reaching this route. Submit this as an ADDITIONAL sitemap in Search
// Console -- it doesn't replace Squarespace's existing one, it just
// covers the pages Squarespace's own sitemap generator can't see
// (since these are served by Vercel, not Squarespace).
export async function GET() {
  const providers = await getAllProviders({ revalidate: 3600 });

  const staticUrls = [
    { path: "/prescribers", priority: "0.8" },
    { path: "/therapists", priority: "0.8" },
  ];

  const providerUrls = providers
    .filter((p) => p.slug)
    .map((p) => ({ path: `/${p.slug}`, priority: "0.7" }));

  const allUrls = [...staticUrls, ...providerUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (u) => `  <url>
    <loc>https://evolvepsychiatry.com${u.path}</loc>
    <changefreq>weekly</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
