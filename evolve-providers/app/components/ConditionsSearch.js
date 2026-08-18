"use client";

import { useState, useMemo } from "react";

// Client component so the search box can filter live in the browser.
// Everything else on the page stays server-rendered/static — only this
// piece needs "use client". Receives the already-categorized condition
// data as a prop from the server component (app/conditions-we-treat/page.js).
export default function ConditionsSearch({ categories }) {
  const [query, setQuery] = useState("");

  const filteredCategories = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;

    return categories
      .map((category) => ({
        name: category.name,
        conditions: category.conditions.filter(
          (condition) =>
            condition.name.toLowerCase().includes(q) ||
            condition.cardBlurb.toLowerCase().includes(q)
        ),
      }))
      .filter((category) => category.conditions.length > 0);
  }, [categories, query]);

  const totalMatches = filteredCategories.reduce(
    (sum, c) => sum + c.conditions.length,
    0
  );

  return (
    <>
      <div className="cwt-search-wrap">
        <svg
          className="cwt-search-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          className="cwt-search-input"
          placeholder="Search conditions..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search conditions we treat"
        />
      </div>

      {query.trim() && totalMatches === 0 && (
        <p className="cwt-no-results">
          No conditions matched "{query}". Try a different search term.
        </p>
      )}

      {filteredCategories.map((category) => (
        <div className="sv-section" key={category.name}>
          <h2 className="sv-section-title">{category.name}</h2>
          <div className="cwt-grid">
            {category.conditions.map((condition) => (
              // "Learn more" links are intentionally disabled here —
              // individual condition pages (e.g. /adhd-adult) aren't
              // live yet. Once they are, swap this <div> back to an
              // <a href={`/${condition.slug}`}> and re-add a link label.
              <div className="cwt-card" key={condition.slug}>
                <div className="cwt-card-title-row">
                  <svg
                    className="cwt-check-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <h3>{condition.name}</h3>
                </div>
                <p>{condition.cardBlurb}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
