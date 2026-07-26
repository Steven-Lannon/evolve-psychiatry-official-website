import { NextResponse } from "next/server";
import { getAllProviders } from "../../../lib/sheets";

// The Cloudflare Worker calls this to find out which URL slugs belong to
// a provider page, so it knows which requests to hand off to this app
// and which ones to leave alone for Squarespace. Cached for an hour,
// same as the pages themselves.
export async function GET() {
  const providers = await getAllProviders({ revalidate: 3600 });
  const slugs = providers.map((p) => p.slug);

  return NextResponse.json(
    { slugs },
    { headers: { "Cache-Control": "public, max-age=300" } }
  );
}
