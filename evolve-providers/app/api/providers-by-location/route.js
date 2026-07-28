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
  }));

  // Same sort as the directory pages: MDs first, then alphabetical by last name.
  results.sort((a, b) => {
    const aIsMD = a.title.toUpperCase() === "MD" ? 0 : 1;
    const bIsMD = b.title.toUpperCase() === "MD" ? 0 : 1;
    if (aIsMD !== bIsMD) return aIsMD - bIsMD;
    return a.lastName.toLowerCase().localeCompare(b.lastName.toLowerCase());
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
