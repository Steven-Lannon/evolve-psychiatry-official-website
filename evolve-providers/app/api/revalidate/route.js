import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

// Bookmark a URL like this and visit it any time you need a change from
// the sheet to show up immediately instead of waiting for the hourly
// automatic refresh:
//
//   https://your-deployment.vercel.app/api/revalidate?secret=YOUR_SECRET
//
// Set REVALIDATE_SECRET in your Vercel project's environment variables
// to something private — this prevents random visitors from being able
// to trigger a refresh.
export async function GET(request) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  // Revalidating the [slug] pattern refreshes every provider page at once.
  revalidatePath("/[slug]", "page");

  return NextResponse.json({ revalidated: true, timestamp: Date.now() });
}
