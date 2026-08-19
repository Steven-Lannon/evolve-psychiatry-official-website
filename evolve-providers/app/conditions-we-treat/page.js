import { getCategorizedConditions } from "../../lib/conditions";
import ConditionsSearch from "../components/ConditionsSearch";
// Matches the relative-import convention used in app/[slug]/page.js
// ("../../lib/sheets") — this file lives at app/conditions-we-treat/page.js,
// same folder depth, so the same "../../lib/..." path applies.

// SEO metadata — same export pattern as your provider pages
export const metadata = {
  title: "Conditions We Treat | Evolve Psychiatry",
  description:
    "Evolve Psychiatry provides personalized treatment for anxiety, mood disorders, ADHD, trauma, OCD, and more across our Massapequa, Syosset, Garden City, Albany, Hauppauge, and Wilmington locations.",
};

// Matches the same pattern as app/[slug]/page.js — sets the page-level
// cache lifetime in addition to what's passed into the fetch itself.
export const revalidate = 3600;

export default async function ConditionsWeTreat() {
  const categories = await getCategorizedConditions({ revalidate: 3600 });

  return (
    <div className="sv-widget">
      <style>{`
        .embed-block-wrapper:has(.sv-widget) {
          padding-bottom: 0 !important;
          height: auto !important;
          background: transparent !important;
        }

        .sv-widget {
          --sv-ink: #1c2b33;
          --sv-muted: #5b6b72;
          --sv-line: #dce3e3;
          --sv-card: #ffffff;
          --sv-accent: #22345a;
          --sv-accent-soft: #e8ebf2;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
          color: var(--sv-ink);
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          line-height: 1.6;
        }
        .sv-widget * { box-sizing: border-box; }
        .sv-widget p, .sv-widget li { font-weight: 400; }

        /* Intro — sub still matches body copy weight, but the H1 is
           back to a large display size per your request. */
        .sv-widget .cwt-intro-wrap {
          text-align: center;
          max-width: 760px;
          margin: 0 auto 48px;
        }
        .sv-widget .sv-eyebrow {
          font-size: 12px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.06em; color: var(--sv-accent); margin: 0 0 8px 0;
        }
        .sv-widget .cwt-title-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          margin: 0 0 14px 0;
        }
        .sv-widget .cwt-title-icon {
          width: 44px;
          height: 44px;
          color: var(--sv-accent);
          flex-shrink: 0;
        }
        .sv-widget h1 {
          font-size: 45px;
          font-weight: 400;
          margin: 0;
          color: var(--sv-ink);
          line-height: 1.1;
        }
        .sv-widget .cwt-intro-sub {
          font-size: 17px; font-weight: 400; line-height: 1.5;
          color: var(--sv-muted); margin: 0;
        }

        /* Search + CTA row, side by side */
        .sv-widget .cwt-search-cta-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          flex-wrap: wrap;
          margin: 0 0 40px;
        }

        /* CTA buttons */
        .sv-widget .cwt-cta-primary,
        .sv-widget .cwt-cta-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 22px;
          border-radius: 9px;
          font-size: 14.5px;
          font-weight: 600;
          text-decoration: none;
          white-space: nowrap;
          transition: background 0.15s ease, border-color 0.15s ease, transform 0.15s ease;
        }
        .sv-widget .cwt-cta-primary {
          background: var(--sv-accent);
          color: #ffffff;
          border: 1px solid var(--sv-accent);
        }
        .sv-widget .cwt-cta-primary:hover {
          background: #1a2947;
          transform: translateY(-1px);
        }
        .sv-widget .cwt-cta-secondary {
          background: #ffffff;
          color: var(--sv-accent);
          border: 1px solid var(--sv-line);
        }
        .sv-widget .cwt-cta-secondary:hover {
          border-color: var(--sv-accent);
          transform: translateY(-1px);
        }

        /* Search bar */
        .sv-widget .cwt-search-wrap {
          position: relative;
          flex: 1 1 320px;
          max-width: 420px;
        }
        .sv-widget .cwt-search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          width: 18px;
          height: 18px;
          color: var(--sv-muted);
          pointer-events: none;
        }
        .sv-widget .cwt-search-input {
          width: 100%;
          font-family: inherit;
          font-size: 15px;
          padding: 12px 16px 12px 44px;
          border: 1px solid var(--sv-line);
          border-radius: 10px;
          background: var(--sv-card);
          color: var(--sv-ink);
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .sv-widget .cwt-search-input:focus {
          border-color: var(--sv-accent);
          box-shadow: 0 0 0 3px var(--sv-accent-soft);
        }
        .sv-widget .cwt-highlight {
          background: var(--sv-accent-soft);
          color: var(--sv-accent);
          padding: 0 1px;
          border-radius: 3px;
        }
        .sv-widget .cwt-no-results {
          text-align: center;
          max-width: 520px;
          margin: 0 auto 40px;
          padding: 24px 28px;
          background: var(--sv-accent-soft);
          border-radius: 12px;
        }
        .sv-widget .cwt-no-results p {
          margin: 0 0 10px 0;
          font-size: 14.5px;
          color: var(--sv-ink);
        }
        .sv-widget .cwt-no-results-phone {
          display: inline-block;
          font-size: 16px;
          font-weight: 700;
          color: var(--sv-accent);
          text-decoration: none;
        }
        .sv-widget .cwt-no-results-phone:hover {
          text-decoration: underline;
        }

        /* Category sections */
        .sv-widget .sv-section { margin-bottom: 44px; }
        .sv-widget .sv-section-title {
          font-size: 22px;
          font-weight: 700;
          margin: 0 0 20px 0;
          padding-bottom: 10px;
          border-bottom: 2px solid var(--sv-accent-soft);
        }

        /* Condition cards — 3 per row */
        .sv-widget .cwt-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        @media (max-width: 900px) {
          .sv-widget .cwt-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .sv-widget .cwt-grid { grid-template-columns: 1fr; }
        }
        .sv-widget .cwt-card {
          background: var(--sv-card);
          border: 1px solid var(--sv-line);
          border-radius: 12px;
          padding: 22px 20px;
          transition: box-shadow 0.15s ease, border-color 0.15s ease, transform 0.15s ease;
        }
        .sv-widget .cwt-card:hover {
          border-color: var(--sv-accent);
          box-shadow: 0 6px 18px rgba(34, 52, 90, 0.12);
          transform: translateY(-2px);
        }
        .sv-widget .cwt-card-title-row {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin: 0 0 8px 0;
        }
        .sv-widget .cwt-check-icon {
          width: 19px;
          height: 19px;
          color: var(--sv-accent);
          flex-shrink: 0;
          margin-top: 2px;
        }
        .sv-widget .cwt-card h3 {
          margin: 0;
          font-size: 17px;
          font-weight: 550;
          color: var(--sv-ink);
        }
        .sv-widget .cwt-card p {
          margin: 0;
          font-size: 13.5px;
          color: var(--sv-muted);
        }
      `}</style>

      <div className="cwt-intro-wrap">
        <p className="sv-eyebrow">Comprehensive Care, Close to Home</p>
        <div className="cwt-title-row">
          <svg className="cwt-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 4h-1a2 2 0 0 0 -2 2v3.5a5.5 5.5 0 0 0 11 0v-3.5a2 2 0 0 0 -2 -2h-1"></path>
            <path d="M8 15a6 6 0 1 0 12 0v-2"></path>
            <path d="M11 3v2"></path>
            <path d="M6 3v2"></path>
            <circle cx="20" cy="10" r="2"></circle>
          </svg>
          <h1>Conditions We Treat</h1>
        </div>
        <p className="cwt-intro-sub">
          Evolve Psychiatry's board-certified psychiatrists and licensed
          therapists treat a wide range of mental health conditions across
          our locations in New York and North Carolina. Every treatment
          plan is built around your specific symptoms, history, and goals —
          through talk therapy, medication management, TMS, or Spravato.
        </p>
      </div>

      <ConditionsSearch categories={categories} />
    </div>
  );
}
