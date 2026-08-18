// Fetches condition data from Google Sheets using the official Sheets API
// — same pattern as lib/sheets.js for providers, NOT the gviz workaround.
// This runs on the SERVER — at build time and/or on each request depending
// on how a route configures its cache — so data is always available before
// any HTML is sent to the browser or a crawler. No client-side fetch, no
// visible loading delay.
//
// Requires the same GOOGLE_SHEETS_API_KEY env var already set up for the
// provider directory, plus a new GOOGLE_CONDITIONS_SHEET_ID pointing at
// this specific sheet (https://docs.google.com/spreadsheets/d/151SO6sGQFXS5AeviHpI6Ql6cU6-skoBiwIxa5_d81Hg).

const SHEET_ID = process.env.GOOGLE_CONDITIONS_SHEET_ID;
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;

// Change this if your tab is named differently.
const RANGE = "Conditions!A:G";

// Column order on the sheet: name | slug | category | card_blurb | full_description | active | order
const COL = {
  NAME: 0,
  SLUG: 1,
  CATEGORY: 2,
  CARD_BLURB: 3,
  FULL_DESCRIPTION: 4,
  ACTIVE: 5,
  ORDER: 6,
};

// Matches the same slugify convention used for providers, so any manual
// slugs typed into the sheet stay consistent even if someone fat-fingers
// capitalization or spacing.
export function slugify(text) {
  return (text || "")
    .trim()
    .toLowerCase()
    .replace(/['\u2018\u2019]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Fetches and parses every condition row from the sheet.
// `revalidate` controls Next.js's cache lifetime for this fetch — how long
// a cached copy is served before the next request triggers a fresh pull
// from Google Sheets. 3600 = 1 hour. Set to 0 only for the on-demand
// revalidation route — never for pages serving real traffic, since that
// would hit the Sheets API on every single visitor.
export async function getAllConditions({ revalidate = 3600 } = {}) {
  if (!SHEET_ID || !API_KEY) {
    throw new Error(
      "Missing GOOGLE_CONDITIONS_SHEET_ID or GOOGLE_SHEETS_API_KEY environment variables."
    );
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(
    RANGE
  )}?key=${API_KEY}`;

  const res = await fetch(url, {
    next: { revalidate },
  });

  if (!res.ok) {
    const errorBody = await res.text().catch(() => "(could not read response body)");
    throw new Error(
      `Failed to fetch conditions sheet: ${res.status} — ${errorBody}`
    );
  }

  const data = await res.json();
  const rows = data.values || [];

  // First row is the header row — skip it.
  const dataRows = rows.slice(1);

  const conditions = dataRows
    .map((row) => {
      const name = row[COL.NAME] || "";
      const slug = slugify(row[COL.SLUG] || row[COL.NAME] || "");
      const category = row[COL.CATEGORY] || "Uncategorized";
      const cardBlurb = row[COL.CARD_BLURB] || "";
      const fullDescription = row[COL.FULL_DESCRIPTION] || "";
      const active = String(row[COL.ACTIVE] || "").toUpperCase() === "TRUE";
      const order = Number(row[COL.ORDER]) || 999;

      return {
        name,
        slug,
        category,
        cardBlurb,
        fullDescription,
        active,
        order,
      };
    })
    .filter((c) => c.active && c.name && c.slug);

  return conditions;
}

// Groups active conditions by category, preserving first-seen category
// order (except "Other", which always sorts last regardless of where it
// appears in the sheet), and sorting each category's conditions by the
// `order` column.
export async function getCategorizedConditions({ revalidate = 3600 } = {}) {
  const conditions = await getAllConditions({ revalidate });

  const categoryMap = new Map();
  for (const condition of conditions) {
    if (!categoryMap.has(condition.category)) {
      categoryMap.set(condition.category, []);
    }
    categoryMap.get(condition.category).push(condition);
  }

  const categories = Array.from(categoryMap.entries()).map(([name, conds]) => ({
    name,
    conditions: conds.sort((a, b) => a.order - b.order),
  }));

  categories.sort((a, b) => {
    const aIsOther = a.name.trim().toLowerCase() === "other";
    const bIsOther = b.name.trim().toLowerCase() === "other";
    if (aIsOther && !bIsOther) return 1;
    if (bIsOther && !aIsOther) return -1;
    return 0; // otherwise keep existing (first-seen) order
  });

  return categories;
}

// Returns a single condition by slug — used by the individual condition
// pages (e.g. /adhd-adult) once those are built out.
export async function getConditionBySlug(slug, { revalidate = 3600 } = {}) {
  const conditions = await getAllConditions({ revalidate });
  return conditions.find((c) => c.slug === slug) || null;
}

// Returns just the list of active slugs — used by generateStaticParams
// on the individual condition pages so Next.js knows which routes to
// pre-build at deploy time.
export async function getAllConditionSlugs({ revalidate = 3600 } = {}) {
  const conditions = await getAllConditions({ revalidate });
  return conditions.map((c) => c.slug);
}
