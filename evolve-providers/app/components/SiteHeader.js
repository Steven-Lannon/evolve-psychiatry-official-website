"use client";

import { useState } from "react";

// Fully self-contained header. Unlike the old version, this does NOT
// reuse Squarespace's own HTML/CSS classes (.header, .btn,
// .header-nav-list, etc.) or rely on any Squarespace-hosted stylesheet.
// Every visual rule lives in the <style> block at the bottom of this
// file, scoped under an "ep-" prefix. That means Squarespace changing
// its nav markup, its CSS bundle hashes, or its button styling can
// never break this page again -- there is nothing left here for them
// to break.

const NAV_LINKS = [
  { label: "Home", href: "/" },
  {
    label: "Services",
    children: [
      { label: "Conditions We Treat", href: "/conditions-we-treat" },
      { label: "Medication Management", href: "/medication-management" },
      { label: "Talk Therapy Counseling", href: "/talk-therapy" },
      { label: "TMS Therapy", href: "/tms" },
      { label: "SPRAVATO®", href: "/spravato" },
      { label: "Telehealth Appointments", href: "/telehealth" },
      { label: "GeneSight Testing", href: "/genesight" },
    ],
  },
  {
    label: "Clinicians",
    children: [
      { label: "Our Prescribers", href: "/prescribers" },
      { label: "Our Therapists", href: "/therapists" },
    ],
  },
  {
    label: "Locations",
    children: [
      { label: "Albany, NY", href: "/albany" },
      { label: "Garden City, NY", href: "/garden-city" },
      { label: "Hauppauge, NY", href: "/hauppauge" },
      { label: "Massapequa, NY", href: "/massapequa" },
      { label: "Patchogue, NY", href: "/patchogue" },
      { label: "Syosset, NY", href: "/syosset" },
      { label: "Wilmington, NC", href: "/wilmington" },
    ],
  },
  {
    label: "Patient Resources",
    children: [
      { label: "New Patient Registration", href: "/new-patient" },
      { label: "Patient Portal", href: "/portal" },
      { label: "Order Supplements", href: "/fullscript" },
      { label: "Patient Scales", href: "/patient-scales-packet" },
      { label: "HIPAA Release", href: "/hipaa-release" },
      { label: "Prior Auth Request", href: "/prior-authorization" },
      { label: "Testimonials", href: "/testimonials" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    label: "Referrals",
    children: [
      { label: "Refer A Patient", href: "/refer-patient" },
      { label: "Our Referrals", href: "/our-referrals" },
    ],
  },
  {
    label: "Billing",
    children: [
      { label: "Insurances & Rates", href: "/insurances" },
      { label: "Update Insurance", href: "/update-insurance" },
      {
        label: "Make A Payment",
        href: "https://mycw197.ecwcloud.com/portal24839/jsp/100mp/login_otp.jsp",
        external: true,
      },
    ],
  },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const LOGO_SRC =
  "//images.squarespace-cdn.com/content/v1/6525fe2f00c9de2ec400ea4f/543bd20d-27e9-4baa-817b-fe18c5434f79/evolve+new+logo+with+name.jpg?format=1500w";

function MobileMenu({ open, onClose }) {
  return (
    <div className={`ep-mobile-menu ${open ? "ep-mobile-menu--open" : ""}`}>
      <div className="ep-mobile-menu-topbar">
        <img src={LOGO_SRC} alt="Evolve Psychiatry" className="ep-mobile-menu-logo" />
        <button className="ep-mobile-menu-close" onClick={onClose} aria-label="Close Menu">
          &times;
        </button>
      </div>
      <nav className="ep-mobile-menu-nav">
        {NAV_LINKS.map((item) =>
          item.children ? (
            <details key={item.label} className="ep-mobile-menu-group">
              <summary>
                {item.label}
                <span className="ep-mobile-menu-chevron">&#8250;</span>
              </summary>
              <div className="ep-mobile-menu-sublist">
                {item.children.map((child) => (
                  <a
                    key={child.label}
                    href={child.href}
                    target={child.external ? "_blank" : undefined}
                    rel={child.external ? "noopener noreferrer" : undefined}
                  >
                    {child.label}
                  </a>
                ))}
              </div>
            </details>
          ) : (
            <a key={item.label} href={item.href} className="ep-mobile-menu-link">
              {item.label}
            </a>
          )
        )}
        <a href="/new-patient" className="ep-mobile-menu-cta">
          Register Today
        </a>
      </nav>
    </div>
  );
}

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="ep-header">
        <div className="ep-announcement">
          <a href="tel:+18444432563" className="ep-announcement-link">
            <svg
              viewBox="0 0 24 24"
              width="13"
              height="13"
              fill="currentColor"
              aria-hidden="true"
              className="ep-phone-icon"
            >
              <path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.9 21 3 13.1 3 3.4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8z" />
            </svg>
            Call Us 1-844-4HEALME
          </a>
        </div>

        <div className="ep-navbar">
          <a href="/" className="ep-logo">
            <img src={LOGO_SRC} alt="Evolve Psychiatry" />
          </a>

          <nav className="ep-nav">
            {NAV_LINKS.map((item) =>
              item.children ? (
                <div key={item.label} className="ep-nav-item ep-nav-item--folder">
                  <a href={item.children[0].href} className="ep-nav-link">
                    {item.label}
                  </a>
                  <div className="ep-dropdown">
                    {item.children.map((child) => (
                      <a
                        key={child.label}
                        href={child.href}
                        target={child.external ? "_blank" : undefined}
                        rel={child.external ? "noopener noreferrer" : undefined}
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                </div>
              ) : (
                <div key={item.label} className="ep-nav-item">
                  <a href={item.href} className="ep-nav-link">
                    {item.label}
                  </a>
                </div>
              )
            )}
          </nav>

          <div className="ep-actions">
            <a href="/new-patient" className="ep-cta">
              <svg
                viewBox="0 0 24 24"
                width="15"
                height="15"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="16" y1="11" x2="22" y2="11" />
              </svg>
              Register Today
            </a>
            <button
              className="ep-burger"
              aria-label="Open Menu"
              onClick={() => setMenuOpen(true)}
              type="button"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <style>{`
        .ep-header {
          position: sticky;
          top: 0;
          z-index: 999;
          background: #fff;
          font-family: 'Poppins', sans-serif;
        }
        .ep-announcement {
          background: #6b6259;
          text-align: center;
          padding: 7px 16px;
        }
        .ep-announcement-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #fff;
          text-decoration: none;
          font-size: 13px;
          letter-spacing: 0.02em;
        }
        .ep-phone-icon {
          flex-shrink: 0;
        }
        .ep-navbar {
          display: flex;
          align-items: center;
          padding: 16px 32px;
          gap: 40px;
          border-bottom: 1px solid #eee;
        }
        .ep-logo img {
          display: block;
          height: 40px;
          width: auto;
        }
        .ep-nav {
          display: flex;
          align-items: center;
          gap: 28px;
          flex-wrap: wrap;
        }
        .ep-nav-item {
          position: relative;
        }
        .ep-nav-link {
          color: #1a1a1a;
          text-decoration: none;
          font-size: 15px;
          font-weight: 400;
          white-space: nowrap;
          padding: 8px 0;
        }
        .ep-nav-link:hover {
          color: #1c2b4a;
        }
        .ep-dropdown {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          background: #fff;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          border-radius: 8px;
          padding: 8px 0;
          min-width: 220px;
          z-index: 10;
        }
        .ep-nav-item--folder:hover .ep-dropdown {
          display: block;
        }
        .ep-dropdown a {
          display: block;
          padding: 10px 18px;
          color: #1a1a1a;
          text-decoration: none;
          font-size: 14px;
          white-space: nowrap;
        }
        .ep-dropdown a:hover {
          background: #f5f6f8;
        }
        .ep-actions {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-left: auto;
        }
        .ep-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #1c2b4a;
          color: #fff;
          text-decoration: none;
          padding: 12px 22px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 600;
          white-space: nowrap;
        }
        .ep-cta:hover {
          background: #142038;
        }
        .ep-burger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
        }
        .ep-burger span {
          display: block;
          width: 22px;
          height: 2px;
          background: #1a1a1a;
        }

        @media (max-width: 980px) {
          .ep-nav {
            display: none;
          }
          .ep-cta {
            display: none;
          }
          .ep-burger {
            display: flex;
          }
        }

        .ep-mobile-menu {
          position: fixed;
          top: 0;
          right: -100%;
          width: 85%;
          max-width: 360px;
          height: 100%;
          background: #fff;
          z-index: 1000;
          transition: right 0.25s ease;
          overflow-y: auto;
          box-shadow: -8px 0 24px rgba(0, 0, 0, 0.15);
        }
        .ep-mobile-menu--open {
          right: 0;
        }
        .ep-mobile-menu-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          border-bottom: 1px solid #eee;
        }
        .ep-mobile-menu-logo {
          height: 32px;
        }
        .ep-mobile-menu-close {
          background: none;
          border: none;
          font-size: 28px;
          line-height: 1;
          cursor: pointer;
        }
        .ep-mobile-menu-nav {
          display: flex;
          flex-direction: column;
          padding: 8px 16px 24px;
        }
        .ep-mobile-menu-link,
        .ep-mobile-menu-group summary {
          padding: 14px 4px;
          border-bottom: 1px solid #f0f0f0;
          color: #1a1a1a;
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          list-style: none;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .ep-mobile-menu-group summary::-webkit-details-marker {
          display: none;
        }
        .ep-mobile-menu-sublist {
          display: flex;
          flex-direction: column;
          padding-left: 12px;
        }
        .ep-mobile-menu-sublist a {
          padding: 10px 4px;
          color: #444;
          text-decoration: none;
          font-size: 14px;
        }
        .ep-mobile-menu-cta {
          margin-top: 16px;
          background: #1c2b4a;
          color: #fff;
          text-align: center;
          padding: 14px;
          border-radius: 999px;
          text-decoration: none;
          font-weight: 600;
        }
      `}</style>
    </>
  );
}
