import { getAllProviders } from "../../../lib/sheets";
import { getAccurateRole } from "../../../lib/roles";

// GET /api/providers-by-location?location=Massapequa
// Returns the providers (prescribers + therapists) at a given office,
// for the location pages' "Meet Our Team" section to fetch client-side.
// This exists specifically so location pages can stay plain Squarespace
// code blocks (real header/footer, full Page Settings SEO control) while
// still showing live team data -- fetching from this fast, cached
// endpoint instead of hitting Google Sheets directly from the browser,
// which was the original slow/inconsistent loading problem.
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const location = (searchParams.get("location") || "").trim();

  if (!location) {
    return new Response(
      JSON.stringify({ error: "Missing location parameter" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const allProviders = await getAllProviders({ revalidate: 3600 });
  const matches = allProviders.filter(
    (p) => (p.Location || "").trim().toLowerCase() === location.toLowerCase()
  );

  const results = matches.map((p) => ({
    slug: p.slug,
    firstName: p["First Name"] || "",
    lastName: p["Last Name"] || "",
    title: (p.Title || "").trim(),
    type: (p.Type || "").trim(),
    role: getAccurateRole(p.Type, p.Title),
    photo: (p["Photo URL"] || "").trim(),
    newPatients: (p["New Patients"] || "").trim(),
    anyPatients: (p["Any Patients"] || "").trim(),
    suite: (p.Suite || "").trim(),
  }));

  // Sort by suite number (numeric-aware, so "203" < "1200" correctly).
  // Providers with no suite listed sort to the end.
  results.sort((a, b) => {
    const aNum = parseInt(a.suite, 10);
    const bNum = parseInt(b.suite, 10);
    const aValid = !isNaN(aNum);
    const bValid = !isNaN(bNum);
    if (aValid && bValid) return aNum - bNum;
    if (aValid) return -1;
    if (bValid) return 1;
    return a.suite.localeCompare(b.suite);
  });

  return new Response(
    JSON.stringify({ location, count: results.length, providers: results }),
    {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=1800, stale-while-revalidate=3600",
      },
    }
  );
}
