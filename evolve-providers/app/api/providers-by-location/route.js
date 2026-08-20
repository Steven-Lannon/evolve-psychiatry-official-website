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
//
// IMPORTANT: the Squarespace pages call this endpoint cross-origin
// (evolvepsychiatry.com -> this Vercel deployment), so every response
// needs an Access-Control-Allow-Origin header or the browser will block
// the request entirely (it will look identical to a network failure --
// the fetch's .catch() fires with no useful error visible in Console,
// only in the Network tab).
const ALLOWED_ORIGIN = "https://evolvepsychiatry.com";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const location = (searchParams.get("location") || "").trim();

  if (!location) {
    return new Response(
      JSON.stringify({ error: "Missing location parameter" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
        },
      }
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

  // Sort order: (1) MDs always first, (2) then by suite number
  // (numeric-aware, blanks last), (3) within the same suite, Prescriber
  // before Therapist.
  results.sort((a, b) => {
    const aIsMD = a.title.toUpperCase() === "MD" ? 0 : 1;
    const bIsMD = b.title.toUpperCase() === "MD" ? 0 : 1;
    if (aIsMD !== bIsMD) return aIsMD - bIsMD;

    const aNum = parseInt(a.suite, 10);
    const bNum = parseInt(b.suite, 10);
    const aValid = !isNaN(aNum);
    const bValid = !isNaN(bNum);
    if (aValid && bValid && aNum !== bNum) return aNum - bNum;
    if (aValid && !bValid) return -1;
    if (!aValid && bValid) return 1;
    if (!aValid && !bValid && a.suite !== b.suite) {
      return a.suite.localeCompare(b.suite);
    }

    // Same suite (or same non-numeric suite label) -- Prescriber before Therapist.
    const aIsPrescriber = /^prescriber$/i.test(a.type) ? 0 : 1;
    const bIsPrescriber = /^prescriber$/i.test(b.type) ? 0 : 1;
    return aIsPrescriber - bIsPrescriber;
  });

  return new Response(
    JSON.stringify({ location, count: results.length, providers: results }),
    {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=1800, stale-while-revalidate=3600",
        "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      },
    }
  );
}
