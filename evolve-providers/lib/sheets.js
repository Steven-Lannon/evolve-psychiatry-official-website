// Fetches provider data from Google Sheets using the official Sheets API
// (not the gviz workaround the old client-side widget used). This runs
// on the SERVER — at build time and/or on each request depending on how
// a route configures its cache — so the data is always available before
// any HTML is sent to the browser or a crawler. No JavaScript execution
// is ever required to see this data.

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;
// Change this if your data lives on a differently-named tab.
const RANGE = "Active!A:M";

const ALLOWED_HEADERS = [
  "First Name",
  "Last Name",
  "Title",
  "Location",
  "Suite",
  "Type",
  "Sex",
  "NPI",
  "Age Range",
  "New Patients",
  "Any Patients",
  "Biography",
  "Photo URL",
];

const LOCATION_STATE_MAP = {
  albany: "NY",
  "garden city": "NY",
  hauppauge: "NY",
  massapequa: "NY",
  syosset: "NY",
  wilmington: "NC",
};

export function formatLocation(loc) {
  if (!loc) return loc;
  const trimmed = loc.trim();
  const state = LOCATION_STATE_MAP[trimmed.toLowerCase()];
  return state ? `${trimmed}, ${state}` : trimmed;
}

// Matches the exact slug logic used by the old widget, so every existing
// /first-last-name URL Google has already started indexing keeps working
// without any redirects.
export function slugify(text) {
  return (text || "")
    .trim()
    .toLowerCase()
    .replace(/['\u2018\u2019]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Fetches and parses every provider row from the sheet.
// `revalidate` controls Next.js's cache lifetime for this fetch — how
// long a cached copy is served before the next request triggers a fresh
// pull from Google Sheets. 3600 = 1 hour. Set to 0 to always fetch fresh
// (only recommended for the on-demand revalidation route, not for pages
// serving real traffic, since that would hit the Sheets API on every
// single visitor).
export async function getAllProviders({ revalidate = 3600 } = {}) {
  if (!SHEET_ID || !API_KEY) {
    throw new Error(
      "Missing GOOGLE_SHEET_ID or GOOGLE_SHEETS_API_KEY environment variables."
    );
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(
    RANGE
  )}?key=${API_KEY}`;

  const res = await fetch(url, {
    next: { revalidate },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Google Sheets API error (${res.status}): ${body}`);
  }

  const data = await res.json();
  const rows = data.values || [];
  if (rows.length === 0) return [];

  const rawHeaders = rows[0];
  const colToCanonical = rawHeaders.map(
    (rh) =>
      ALLOWED_HEADERS.find(
        (h) => h.toLowerCase() === String(rh || "").trim().toLowerCase()
      ) || null
  );

  const providers = rows.slice(1).map((row) => {
    const obj = {};
    row.forEach((cell, i) => {
      const canonical = colToCanonical[i];
      if (!canonical) return;
      obj[canonical] = (cell ?? "").toString().trim();
    });
    return obj;
  });

  // Drop fully blank rows and attach the computed slug once, here, so
  // every part of the app uses the exact same value.
  return providers
    .filter((p) => Object.values(p).some((v) => v && v.trim() !== ""))
    .map((p) => ({
      ...p,
      slug: slugify(`${p["First Name"] || ""} ${p["Last Name"] || ""}`),
    }))
    .filter((p) => p.slug);
}

export async function getProviderBySlug(slug, options) {
  const all = await getAllProviders(options);
  return all.find((p) => p.slug === slug) || null;
}
