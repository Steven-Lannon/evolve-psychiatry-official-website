import { getAllConditionSlugs } from "../../../lib/conditions";
// Mirrors the existing app/api/slugs/route.js pattern used for providers.
// The Cloudflare Worker calls this to know which condition pages
// (e.g. /adhd-adult) it should route to Vercel instead of Squarespace.

export async function GET() {
  const slugs = await getAllConditionSlugs({ revalidate: 3600 });
  return Response.json({ slugs });
}

export const revalidate = 3600;
