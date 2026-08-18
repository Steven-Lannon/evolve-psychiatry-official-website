import Link from "next/link";
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
    <div className="wrap">
      <section className="cwt-hero">
        <p className="cwt-eyebrow">Beat Anxiety, Depression, and More With</p>
        <h1 className="cwt-title">Conditions We Treat</h1>
        <p className="cwt-intro">
          At Evolve Psychiatry, we provide comprehensive mental health support
          for a wide range of conditions. Our licensed clinicians and
          psychiatrists deliver personalized care tailored to each patient's
          needs — whether you're seeking therapy, medication management, or
          urgent psychiatric support.
        </p>
      </section>

      {categories.map((category) => (
        <section className="cwt-category" key={category.name}>
          <h2 className="cwt-category-title">{category.name}</h2>
          <div className="cwt-grid">
            {category.conditions.map((condition) => (
              <Link
                href={`/${condition.slug}`}
                className="cwt-card"
                key={condition.slug}
              >
                <h3 className="cwt-card-title">{condition.name}</h3>
                <p className="cwt-card-blurb">{condition.cardBlurb}</p>
                <span className="cwt-card-link">Learn more →</span>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <style>{`
        .cwt-hero {
          max-width: 760px;
          margin: 0 auto 56px;
          text-align: center;
          padding: 64px 24px 0;
        }

        .cwt-eyebrow {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #1e3a8a;
          margin-bottom: 12px;
        }

        .cwt-title {
          font-size: 48px;
          font-weight: 600;
          color: #0f1729;
          margin: 0 0 20px;
          line-height: 1.1;
        }

        .cwt-intro {
          font-size: 17px;
          line-height: 1.6;
          color: #334155;
          margin: 0;
        }

        .cwt-category {
          max-width: 1160px;
          margin: 0 auto 48px;
          padding: 0 24px;
        }

        .cwt-category-title {
          font-size: 22px;
          font-weight: 600;
          color: #1e3a8a;
          margin: 0 0 20px;
          padding-bottom: 10px;
          border-bottom: 2px solid #c7dafc;
        }

        .cwt-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .cwt-card {
          background: #ffffff;
          border: 1px solid #c7dafc;
          border-radius: 12px;
          padding: 24px;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          transition: box-shadow 0.15s ease, transform 0.15s ease;
        }

        .cwt-card:hover {
          box-shadow: 0 6px 20px rgba(30, 58, 138, 0.12);
          transform: translateY(-2px);
        }

        .cwt-card-title {
          font-size: 18px;
          font-weight: 600;
          color: #1e3a8a;
          margin: 0 0 10px;
        }

        .cwt-card-blurb {
          font-size: 14.5px;
          line-height: 1.55;
          color: #475569;
          margin: 0 0 16px;
          flex-grow: 1;
        }

        .cwt-card-link {
          font-size: 13.5px;
          font-weight: 600;
          color: #2563eb;
        }

        @media (max-width: 640px) {
          .cwt-title {
            font-size: 34px;
          }
          .cwt-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
