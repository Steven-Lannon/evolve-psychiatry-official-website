import { getCategorizedConditions } from "../../lib/conditions";
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

        .sv-widget .sv-breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          margin-bottom: 28px;
        }
        .sv-widget .sv-breadcrumb a { color: var(--sv-accent); text-decoration: underline; }
        .sv-widget .sv-breadcrumb-sep { color: var(--sv-muted); }
        .sv-widget .sv-breadcrumb-current { color: var(--sv-muted); font-weight: 600; }

        /* Intro (same type scale as sv-hero-text, centered, no photo) */
        .sv-widget .cwt-intro-wrap {
          text-align: center;
          max-width: 760px;
          margin: 0 auto 48px;
        }
        .sv-widget .sv-eyebrow {
          font-size: 12px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.06em; color: var(--sv-accent); margin: 0 0 8px 0;
        }
        .sv-widget h1 { font-size: 32px; font-weight: 700; margin: 0 0 14px 0; letter-spacing: -0.01em; color: var(--sv-ink); }
        .sv-widget .cwt-intro-sub { font-size: 17px; font-weight: 400; line-height: 1.5; color: var(--sv-muted); margin: 0; }

        /* Sections */
        .sv-widget .sv-section { margin-bottom: 48px; }
        .sv-widget .sv-section-title { font-size: 22px; font-weight: 700; margin: 0 0 22px 0; }

        /* Condition cards — same pattern as sv-related-grid-text, 3 per row */
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
        }
        .sv-widget .cwt-card h3 { margin: 0 0 8px 0; font-size: 15.5px; font-weight: 700; color: var(--sv-ink); }
        .sv-widget .cwt-card p { margin: 0; font-size: 13.5px; color: var(--sv-muted); }
      `}</style>

      <nav className="sv-breadcrumb">
        <a href="/">Home</a>
        <span className="sv-breadcrumb-sep">&rsaquo;</span>
        <a href="/services">Services</a>
        <span className="sv-breadcrumb-sep">&rsaquo;</span>
        <span className="sv-breadcrumb-current">Conditions We Treat</span>
      </nav>

      <div className="cwt-intro-wrap">
        <p className="sv-eyebrow">Beat Anxiety, Depression, and More With</p>
        <h1>Conditions We Treat</h1>
        <p className="cwt-intro-sub">
          At Evolve Psychiatry, we provide comprehensive mental health
          support for a wide range of conditions. Our licensed clinicians
          and psychiatrists deliver personalized care tailored to each
          patient's needs — whether you're seeking therapy, medication
          management, or urgent psychiatric support.
        </p>
      </div>

      {categories.map((category) => (
        <div className="sv-section" key={category.name}>
          <h2 className="sv-section-title">{category.name}</h2>
          <div className="cwt-grid">
            {category.conditions.map((condition) => (
              // "Learn more" links are intentionally disabled here —
              // individual condition pages (e.g. /adhd-adult) aren't
              // live yet. Once they are, swap this <div> back to an
              // <a href={`/${condition.slug}`}> and re-add a link label.
              <div className="cwt-card" key={condition.slug}>
                <h3>{condition.name}</h3>
                <p>{condition.cardBlurb}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
