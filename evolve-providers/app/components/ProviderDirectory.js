"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "next/navigation";
import { getAccurateRole } from "../../lib/roles";

// Your spreadsheet's Location column just has the city name (e.g. "Albany").
// This map adds the state for display only -- it never touches the sheet.
// Add a new city here (left = exactly how it appears in the sheet, right =
// state to show next to it) whenever a new city gets added.
const LOCATION_STATE_MAP = {
  albany: "NY",
  "garden city": "NY",
  hauppauge: "NY",
  massapequa: "NY",
  syosset: "NY",
  wilmington: "NC",
};

function formatLocation(loc) {
  if (!loc) return loc;
  const trimmed = loc.trim();
  const state = LOCATION_STATE_MAP[trimmed.toLowerCase()];
  return state ? `${trimmed}, ${state}` : trimmed;
}

function initials(name) {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function escapeHtml(str) {
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function highlight(text, query) {
  if (!text) return "";
  if (!query) return escapeHtml(text);
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return escapeHtml(text);
  return (
    escapeHtml(text.slice(0, idx)) +
    "<mark>" +
    escapeHtml(text.slice(idx, idx + query.length)) +
    "</mark>" +
    escapeHtml(text.slice(idx + query.length))
  );
}

export default function ProviderDirectory({ providers, typeLabel, heading, crossLink }) {
  const searchParams = useSearchParams();

  const [query, setQuery] = useState("");
  const [activeLocation, setActiveLocation] = useState("All");
  const [activeSex, setActiveSex] = useState("All");
  // FIX: this used to default to false, which meant the bio <p> below was
  // never even added to the page (see the render logic further down) until
  // someone clicked "Biographies on" -- so browser Ctrl+F, view-source, and
  // search engines never saw any bio text on a fresh page load. Defaulting
  // to true restores that (the toggle still works for anyone who wants the
  // more compact, bios-collapsed view).
  const [biosVisible, setBiosVisible] = useState(true);
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const [lightboxAlt, setLightboxAlt] = useState("");
  const [scrollBtnVisible, setScrollBtnVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Deep-linking support: /prescribers?location=Albany&sex=Female&q=smith
  useEffect(() => {
    const loc = searchParams.get("location");
    const sex = searchParams.get("sex");
    const q = searchParams.get("q");
    if (loc) setActiveLocation(loc);
    if (sex) setActiveSex(sex);
    if (q) setQuery(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // "Back to top" button once the visitor has scrolled a fair way down.
  useEffect(() => {
    function handleScroll() {
      setScrollBtnVisible(window.scrollY > 500);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Escape closes the lightbox.
  useEffect(() => {
    if (!lightboxSrc) return;
    function handleKey(e) {
      if (e.key === "Escape") setLightboxSrc(null);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [lightboxSrc]);

  const locations = useMemo(() => {
    return [...new Set(providers.map((p) => (p.Location || "").trim()).filter(Boolean))].sort(
      (a, b) => {
        const aRemote = /^remote$/i.test(a);
        const bRemote = /^remote$/i.test(b);
        if (aRemote && !bRemote) return 1;
        if (bRemote && !aRemote) return -1;
        return a.localeCompare(b);
      }
    );
  }, [providers]);

  const sexes = useMemo(() => {
    return [...new Set(providers.map((p) => (p.Sex || "").trim()).filter(Boolean))].sort();
  }, [providers]);

  const filtered = useMemo(() => {
    let rows = providers;
    if (activeLocation !== "All") {
      rows = rows.filter((p) => (p.Location || "").trim() === activeLocation);
    }
    if (activeSex !== "All") {
      rows = rows.filter((p) => (p.Sex || "").trim() === activeSex);
    }
    const q = query.trim().toLowerCase();
    if (q !== "") {
      rows = rows.filter((p) => {
        const fullName = `${p["First Name"] || ""} ${p["Last Name"] || ""}`.toLowerCase();
        // FIX: this used to only check the name, so typing a keyword that
        // only appears in someone's bio (e.g. a condition or specialty)
        // filtered every provider out instead of surfacing the match --
        // even though highlight() below was already written to highlight
        // matches inside bio text, implying bio search was the intent.
        const bio = (p.Biography || "").toLowerCase();
        return fullName.includes(q) || bio.includes(q);
      });
    }
    // MDs first, then alphabetical by last name.
    rows = [...rows].sort((a, b) => {
      const aIsMD = (a.Title || "").trim().toUpperCase() === "MD" ? 0 : 1;
      const bIsMD = (b.Title || "").trim().toUpperCase() === "MD" ? 0 : 1;
      if (aIsMD !== bIsMD) return aIsMD - bIsMD;
      return (a["Last Name"] || "").toLowerCase().localeCompare((b["Last Name"] || "").toLowerCase());
    });
    return rows;
  }, [providers, activeLocation, activeSex, query]);

  const anyFilterActive =
    activeLocation !== "All" || activeSex !== "All" || query.trim() !== "";

  function resetFilters() {
    setActiveLocation("All");
    setActiveSex("All");
    setQuery("");
    if (searchInputRef.current) searchInputRef.current.value = "";
  }

  const scopeParts = [];
  if (activeLocation !== "All") {
    scopeParts.push(
      <span key="loc">
        {" "}
        in <strong>{formatLocation(activeLocation)}</strong>
      </span>
    );
  }
  if (activeSex !== "All") {
    scopeParts.push(
      <span key="sex">
        {" "}
        who are <strong>{activeSex.toLowerCase()}</strong>
      </span>
    );
  }

  return (
    <div className="pd-widget">
      <div className="page-bg">
        <div className="wrap">
          <h1>{heading}</h1>
          {crossLink && (
            <p className="type-cross-link">
              {crossLink.text}{" "}
              <a href={crossLink.href}>
                <strong>{crossLink.linkText}</strong>
              </a>
              .
            </p>
          )}

          <div className="controls-row">
            <div className="search-bar">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search by name..."
                autoComplete="off"
                defaultValue={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>

            <div className="filter-bar">
              {sexes.length > 0 && (
                <div className="filter-group">
                  <span className="filter-label">Sex</span>
                  <div className="select-wrap">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="14" cy="10" r="5" />
                      <line x1="17.5" y1="6.5" x2="21" y2="3" />
                      <polyline points="21 6 21 3 18 3" />
                      <circle cx="9" cy="14" r="5" />
                      <line x1="9" y1="19" x2="9" y2="23" />
                      <line x1="6" y1="21" x2="12" y2="21" />
                    </svg>
                    <select
                      className="filter-select"
                      value={activeSex}
                      onChange={(e) => setActiveSex(e.target.value)}
                    >
                      <option value="All">All</option>
                      {sexes.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {locations.length > 0 && (
              <div className="filter-bar">
                <div className="filter-group location-buttons-group">
                  <span className="filter-label">Location</span>
                  <button
                    className={`filter-btn ${activeLocation === "All" ? "active" : ""}`}
                    onClick={() => setActiveLocation("All")}
                  >
                    All
                  </button>
                  {locations.map((l) => (
                    <button
                      key={l}
                      className={`filter-btn ${activeLocation === l ? "active" : ""}`}
                      onClick={() => setActiveLocation(l)}
                    >
                      {formatLocation(l)}
                    </button>
                  ))}
                </div>
                <div className="filter-group location-select-group">
                  <span className="filter-label">Location</span>
                  <div className="select-wrap">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21z" />
                      <circle cx="12" cy="9.5" r="2.5" />
                    </svg>
                    <select
                      className="filter-select"
                      value={activeLocation}
                      onChange={(e) => setActiveLocation(e.target.value)}
                    >
                      <option value="All">All</option>
                      {locations.map((l) => (
                        <option key={l} value={l}>
                          {formatLocation(l)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          <p className="scope-line">
            Showing <strong>all {typeLabel}s</strong>
            {scopeParts}. <span className="scope-count">({filtered.length} {filtered.length === 1 ? "result" : "results"})</span>{" "}
            <button
              type="button"
              className="bio-global-toggle"
              aria-pressed={biosVisible}
              onClick={() => setBiosVisible((v) => !v)}
            >
              <span className="bio-global-toggle-track">
                <span className="bio-global-toggle-thumb" />
              </span>
              Biographies {biosVisible ? "on" : "off"}
            </button>
            {anyFilterActive && (
              <button type="button" className="reset-btn" onClick={resetFilters}>
                {" "}
                Reset filters
              </button>
            )}
          </p>

          <div className="results">
            {filtered.length === 0 ? (
              <div className="empty">
                {query.trim() === ""
                  ? "No providers match the current filters."
                  : `No providers match "${query}".`}
              </div>
            ) : (
              filtered.slice(0, 200).map((p, i) => {
                const plainName = `${p["First Name"] || ""} ${p["Last Name"] || ""}`.trim() || "—";
                const name = p.Title && p.Title.trim() ? `${plainName}, ${p.Title.trim()}` : plainName;
                const photoSrc = (p["Photo URL"] || "").trim();
                const locationVal = (p.Location || "").trim();
                const bioText = (p.Biography || "").trim();
                const notAcceptingNew = /^no$/i.test((p["New Patients"] || "").trim());
                const notAcceptingAny = /^no$/i.test((p["Any Patients"] || "").trim());
                const acceptingNew = /^yes$/i.test((p["New Patients"] || "").trim());
                const isRemote = /^remote$/i.test(locationVal);
                const accurateRole = getAccurateRole(p.Type, p.Title);

                const locationPageHref =
                  locationVal && !isRemote
                    ? `/${locationVal.trim().toLowerCase().replace(/\s+/g, "-")}`
                    : "";

                // The original widget showed every other sheet column
                // (Sex, NPI, Age Range, Suite) as a generic "fields" list
                // on each card -- Type is skipped here since the page is
                // already filtered to one type, making it redundant.
                const extraFields = [
                  ["Sex", p.Sex],
                  ["NPI", p.NPI],
                  ["Age Range", p["Age Range"]],
                  ["Suite", p.Suite],
                ].filter(([, val]) => val && String(val).trim());

                const photoAlt = [name, typeLabel, locationVal ? `in ${formatLocation(locationVal)}` : ""]
                  .filter(Boolean)
                  .join(", ");

                return (
                  <div className="card" key={`${plainName}-${i}`}>
                    <div className="card-header">
                      {photoSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          className="photo"
                          src={photoSrc}
                          alt={photoAlt}
                          loading="lazy"
                          onClick={() => {
                            setLightboxSrc(photoSrc);
                            setLightboxAlt(photoAlt);
                          }}
                          onError={(e) => e.currentTarget.remove()}
                        />
                      ) : (
                        <div className="photo photo-initials">{initials(plainName)}</div>
                      )}
                      <div className="card-heading">
                        <h2
                          className="name"
                          dangerouslySetInnerHTML={{ __html: highlight(name, query) }}
                        />
                        {accurateRole && (
                          <p className="card-role-subtitle">{accurateRole}</p>
                        )}
                        {locationVal && (
                          locationPageHref ? (
                            <a href={locationPageHref} className="location-badge">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21z" />
                                <circle cx="12" cy="9.5" r="2.5" />
                              </svg>
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: highlight(formatLocation(locationVal), query),
                                }}
                              />
                            </a>
                          ) : (
                            <span className="location-badge">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21z" />
                                <circle cx="12" cy="9.5" r="2.5" />
                              </svg>
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: highlight(formatLocation(locationVal), query),
                                }}
                              />
                            </span>
                          )
                        )}
                      </div>
                    </div>
                    <div className="card-body">
                      {acceptingNew && (
                        <div className="new-patients-open">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Accepting new patients.
                        </div>
                      )}
                      {isRemote && !notAcceptingNew && (
                        <div className="telehealth-note">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="13" rx="2" />
                            <line x1="8" y1="21" x2="16" y2="21" />
                            <line x1="12" y1="17" x2="12" y2="21" />
                          </svg>
                          Telehealth appointments only.
                        </div>
                      )}
                      {(notAcceptingNew || notAcceptingAny) && (
                        <div className="new-patients-closed">
                          {notAcceptingAny
                            ? "Currently not accepting any patients."
                            : "Currently not accepting new patients."}
                        </div>
                      )}
                      {extraFields.length > 0 && (
                        <div className="fields">
                          {extraFields.map(([label, val]) => (
                            <span key={label}>
                              <b>{label}:</b>{" "}
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: highlight(String(val).trim(), query),
                                }}
                              />
                            </span>
                          ))}
                        </div>
                      )}
                      {bioText && (
                        <div className="bio">
                          {biosVisible && (
                            <p
                              className="bio-text"
                              dangerouslySetInnerHTML={{ __html: highlight(bioText, query) }}
                            />
                          )}
                        </div>
                      )}
                      {p.slug && (
                        <div className="profile-link-row">
                          <a className="profile-link-btn" href={`/${p.slug}`}>
                            View Full Profile
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {mounted && lightboxSrc &&
        createPortal(
          <div className="pd-photo-lightbox open" onClick={() => setLightboxSrc(null)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={lightboxSrc} alt={lightboxAlt} />
          </div>,
          document.body
        )}

      <button
        type="button"
        className={`scroll-top-btn ${scrollBtnVisible ? "visible" : ""}`}
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="5 12 12 5 19 12" />
        </svg>
      </button>
    </div>
  );
}
