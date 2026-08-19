"use client";

import { useState, useEffect, useRef } from "react";

// Real Squarespace header markup (desktop + mobile layout blocks) minus
// Squarespace's own mobile overlay menu, which depended on JS/inline
// styles we don't have and was rendering broken (see project history).
// The mobile menu below is a simple, fully custom overlay instead --
// same links, same rough styling, but zero dependency on unknown
// Squarespace behavior, so it just works.
const HEADER_HTML = `<header id="header" class="header theme-col--primary shrink" style="
  --headerDropShadowColor: hsla(var(--black-hsl), 1);
  --headerBorderColor: hsla(var(--black-hsl), 1);
  --solidHeaderBackgroundColor: hsla(var(--white-hsl), 1);
  --solidHeaderNavigationColor: hsla(var(--black-hsl), 1);
">
  <svg style="display:none" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
    <symbol id="closedArrowHead" viewBox="0 0 22 22"><path d="M18 7L11 15L4 7L18 7Z" fill="none" stroke="inherit"></path></symbol>
    <symbol id="openArrowHead"><path d="M18 7L11 14L4 7" fill="none"></path></symbol>
  </svg>

  <div class="sqs-announcement-bar-dropzone"><div class="sqs-announcement-bar-custom-location"><div class="yui3-widget sqs-widget sqs-announcement-bar"><div class="sqs-announcement-bar-content"><a class="sqs-announcement-bar-url" href="tel:+18444432563" aria-labelledby="announcement-bar-text-inner-id"></a>
  <div class="sqs-announcement-bar-text">
    <div id="announcement-bar-text-inner-id" class="sqs-announcement-bar-text-inner">
      <p style="white-space: pre-wrap;">Call Us 1-844-4HEALME</p>
    </div>
  </div></div></div></div></div>

  <div class="header-announcement-bar-wrapper">
    <a href="#page" class="header-skip-link sqs-button-element--primary">Skip to Content</a>
    <div class="header-border" data-header-style="solid" data-header-border="false"></div>
    <div class="header-dropshadow" data-header-style="solid" data-header-dropshadow="true" style="box-shadow: 0px 10px 10px -5px;"></div>
    <div><div class="header-background-solid" data-header-style="solid" style="opacity: calc(100 * .01)"></div></div>

    <div class="header-inner container--fluid header-mobile-layout-logo-left-nav-right header-layout-nav-left">
      <div class="header-background theme-bg--primary"></div>

      <div class="header-display-desktop" data-content-field="site-title">
<div class="header-title-nav-wrapper">
  <div class="header-title">
    <div class="header-title-logo">
      <a href="/">
        <img src="//images.squarespace-cdn.com/content/v1/6525fe2f00c9de2ec400ea4f/543bd20d-27e9-4baa-817b-fe18c5434f79/evolve+new+logo+with+name.jpg?format=1500w" alt="Evolve Psychiatry" style="display:block" loading="eager" decoding="async">
      </a>
    </div>
  </div>
  <div class="header-nav">
    <div class="header-nav-wrapper">
      <nav class="header-nav-list">
        <div class="header-nav-item header-nav-item--collection">
          <a href="/">Home</a>
        </div>
        <div class="header-nav-item header-nav-item--folder">
          <button class="header-nav-folder-title" data-href="/services-folder/" aria-expanded="false" aria-controls="services">
            <span class="header-nav-folder-title-text">Services</span>
          </button>
          <div class="header-nav-folder-content" id="services">
            <div class="header-nav-folder-item"><a href="/medication-management"><span class="header-nav-folder-item-content">Medication Management</span></a></div>
            <div class="header-nav-folder-item"><a href="/talk-therapy"><span class="header-nav-folder-item-content">Talk Therapy Counseling</span></a></div>
            <div class="header-nav-folder-item"><a href="/tms"><span class="header-nav-folder-item-content">TMS Therapy</span></a></div>
            <div class="header-nav-folder-item"><a href="/spravato"><span class="header-nav-folder-item-content">Spravato</span></a></div>
            <div class="header-nav-folder-item"><a href="/telehealth"><span class="header-nav-folder-item-content">Telehealth Appointments</span></a></div>
            <div class="header-nav-folder-item"><a href="/genesight"><span class="header-nav-folder-item-content">GeneSight Testing</span></a></div>
          </div>
        </div>
        <div class="header-nav-item header-nav-item--folder">
          <button class="header-nav-folder-title" data-href="/clinicians-folder/" aria-expanded="false" aria-controls="clinicians">
            <span class="header-nav-folder-title-text">Clinicians</span>
          </button>
          <div class="header-nav-folder-content" id="clinicians">
            <div class="header-nav-folder-item"><a href="/prescribers"><span class="header-nav-folder-item-content">Our Prescribers</span></a></div>
            <div class="header-nav-folder-item"><a href="/therapists"><span class="header-nav-folder-item-content">Our Therapists</span></a></div>
          </div>
        </div>
        <div class="header-nav-item header-nav-item--folder">
          <button class="header-nav-folder-title" data-href="/locations-folder/" aria-expanded="false" aria-controls="locations">
            <span class="header-nav-folder-title-text">Locations</span>
          </button>
          <div class="header-nav-folder-content" id="locations">
            <div class="header-nav-folder-item"><a href="/albany"><span class="header-nav-folder-item-content">Albany, NY</span></a></div>
            <div class="header-nav-folder-item"><a href="/garden-city"><span class="header-nav-folder-item-content">Garden City, NY</span></a></div>
            <div class="header-nav-folder-item"><a href="/hauppauge"><span class="header-nav-folder-item-content">Hauppauge, NY</span></a></div>
            <div class="header-nav-folder-item"><a href="/massapequa"><span class="header-nav-folder-item-content">Massapequa, NY</span></a></div>
            <div class="header-nav-folder-item"><a href="/syosset"><span class="header-nav-folder-item-content">Syosset, NY</span></a></div>
            <div class="header-nav-folder-item"><a href="/wilmington"><span class="header-nav-folder-item-content">Wilmington, NC</span></a></div>
          </div>
        </div>
        <div class="header-nav-item header-nav-item--folder">
          <button class="header-nav-folder-title" data-href="/resources" aria-expanded="false" aria-controls="patient-resources">
            <span class="header-nav-folder-title-text">Patient Resources</span>
          </button>
          <div class="header-nav-folder-content" id="patient-resources">
            <div class="header-nav-folder-item"><a href="/new-patient"><span class="header-nav-folder-item-content">New Patient Registration</span></a></div>
            <div class="header-nav-folder-item"><a href="/portal"><span class="header-nav-folder-item-content">Patient Portal</span></a></div>
            <div class="header-nav-folder-item"><a href="/fullscript"><span class="header-nav-folder-item-content">Order Supplements</span></a></div>
            <div class="header-nav-folder-item"><a href="/patient-scales-packet"><span class="header-nav-folder-item-content">Patient Scales</span></a></div>
            <div class="header-nav-folder-item"><a href="/hipaa-release"><span class="header-nav-folder-item-content">HIPAA Release</span></a></div>
            <div class="header-nav-folder-item"><a href="/prior-authorization"><span class="header-nav-folder-item-content">Prior Auth Request</span></a></div>
            <div class="header-nav-folder-item"><a href="/testimonials"><span class="header-nav-folder-item-content">Testimonials</span></a></div>
            <div class="header-nav-folder-item"><a href="/faq"><span class="header-nav-folder-item-content">FAQ</span></a></div>
          </div>
        </div>
        <div class="header-nav-item header-nav-item--folder">
          <button class="header-nav-folder-title" data-href="/referrals-1" aria-expanded="false" aria-controls="referrals">
            <span class="header-nav-folder-title-text">Referrals</span>
          </button>
          <div class="header-nav-folder-content" id="referrals">
            <div class="header-nav-folder-item"><a href="/refer-patient"><span class="header-nav-folder-item-content">Refer A Patient</span></a></div>
            <div class="header-nav-folder-item"><a href="/our-referrals"><span class="header-nav-folder-item-content">Our Referrals</span></a></div>
          </div>
        </div>
        <div class="header-nav-item header-nav-item--folder">
          <button class="header-nav-folder-title" data-href="/billing" aria-expanded="false" aria-controls="billing">
            <span class="header-nav-folder-title-text">Billing</span>
          </button>
          <div class="header-nav-folder-content" id="billing">
            <div class="header-nav-folder-item"><a href="/insurances"><span class="header-nav-folder-item-content">Insurances &amp; Rates</span></a></div>
            <div class="header-nav-folder-item"><a href="/update-insurance"><span class="header-nav-folder-item-content">Update Insurance</span></a></div>
            <div class="header-nav-folder-item header-nav-folder-item--external"><a href="https://mycw197.ecwcloud.com/portal24839/jsp/100mp/login_otp.jsp" target="_blank">Make A Payment</a></div>
          </div>
        </div>
        <div class="header-nav-item header-nav-item--collection"><a href="/about">About</a></div>
        <div class="header-nav-item header-nav-item--collection"><a href="/blog">Blog</a></div>
        <div class="header-nav-item header-nav-item--collection"><a href="/contact">Contact</a></div>
      </nav>
    </div>
  </div>
</div>
<div class="header-actions header-actions--right">
  <div class="header-actions-action header-actions-action--cta">
    <a class="btn btn--border theme-btn--primary-inverse sqs-button-element--secondary" href="/new-patient">Register Today</a>
  </div>
</div>
<div class="header-burger menu-overlay-has-visible-non-navigation-items">
  <button class="header-burger-btn burger" data-test="header-burger">
    <span class="js-header-burger-open-title visually-hidden">Open Menu</span>
    <span hidden class="js-header-burger-close-title visually-hidden">Close Menu</span>
    <div class="burger-box">
      <div class="burger-inner header-menu-icon-doubleLineHamburger">
        <div class="top-bun"></div>
        <div class="patty"></div>
        <div class="bottom-bun"></div>
      </div>
    </div>
  </button>
</div>

      </div>

      <div class="header-display-mobile" data-content-field="site-title">
<div class="header-title-nav-wrapper">
  <div class="header-title">
    <div class="header-title-logo">
      <a href="/">
        <img src="//images.squarespace-cdn.com/content/v1/6525fe2f00c9de2ec400ea4f/543bd20d-27e9-4baa-817b-fe18c5434f79/evolve+new+logo+with+name.jpg?format=1500w" alt="Evolve Psychiatry" style="display:block" loading="eager" decoding="async">
      </a>
    </div>
  </div>
  <div class="header-nav">
    <div class="header-nav-wrapper">
      <nav class="header-nav-list">
        <div class="header-nav-item header-nav-item--collection">
          <a href="/">Home</a>
        </div>
        <div class="header-nav-item header-nav-item--folder">
          <button class="header-nav-folder-title" data-href="/services-folder/" aria-expanded="false" aria-controls="services-m">
            <span class="header-nav-folder-title-text">Services</span>
          </button>
          <div class="header-nav-folder-content" id="services-m">
            <div class="header-nav-folder-item"><a href="/medication-management"><span class="header-nav-folder-item-content">Medication Management</span></a></div>
            <div class="header-nav-folder-item"><a href="/talk-therapy"><span class="header-nav-folder-item-content">Talk Therapy Counseling</span></a></div>
            <div class="header-nav-folder-item"><a href="/tms"><span class="header-nav-folder-item-content">TMS Therapy</span></a></div>
            <div class="header-nav-folder-item"><a href="/spravato"><span class="header-nav-folder-item-content">Spravato</span></a></div>
            <div class="header-nav-folder-item"><a href="/telehealth"><span class="header-nav-folder-item-content">Telehealth Appointments</span></a></div>
            <div class="header-nav-folder-item"><a href="/genesight"><span class="header-nav-folder-item-content">GeneSight Testing</span></a></div>
          </div>
        </div>
        <div class="header-nav-item header-nav-item--folder">
          <button class="header-nav-folder-title" data-href="/clinicians-folder/" aria-expanded="false" aria-controls="clinicians-m">
            <span class="header-nav-folder-title-text">Clinicians</span>
          </button>
          <div class="header-nav-folder-content" id="clinicians-m">
            <div class="header-nav-folder-item"><a href="/prescribers"><span class="header-nav-folder-item-content">Our Prescribers</span></a></div>
            <div class="header-nav-folder-item"><a href="/therapists"><span class="header-nav-folder-item-content">Our Therapists</span></a></div>
          </div>
        </div>
        <div class="header-nav-item header-nav-item--folder">
          <button class="header-nav-folder-title" data-href="/locations-folder/" aria-expanded="false" aria-controls="locations-m">
            <span class="header-nav-folder-title-text">Locations</span>
          </button>
          <div class="header-nav-folder-content" id="locations-m">
            <div class="header-nav-folder-item"><a href="/albany"><span class="header-nav-folder-item-content">Albany, NY</span></a></div>
            <div class="header-nav-folder-item"><a href="/garden-city"><span class="header-nav-folder-item-content">Garden City, NY</span></a></div>
            <div class="header-nav-folder-item"><a href="/hauppauge"><span class="header-nav-folder-item-content">Hauppauge, NY</span></a></div>
            <div class="header-nav-folder-item"><a href="/massapequa"><span class="header-nav-folder-item-content">Massapequa, NY</span></a></div>
            <div class="header-nav-folder-item"><a href="/syosset"><span class="header-nav-folder-item-content">Syosset, NY</span></a></div>
            <div class="header-nav-folder-item"><a href="/wilmington"><span class="header-nav-folder-item-content">Wilmington, NC</span></a></div>
          </div>
        </div>
        <div class="header-nav-item header-nav-item--folder">
          <button class="header-nav-folder-title" data-href="/resources" aria-expanded="false" aria-controls="patient-resources-m">
            <span class="header-nav-folder-title-text">Patient Resources</span>
          </button>
          <div class="header-nav-folder-content" id="patient-resources-m">
            <div class="header-nav-folder-item"><a href="/new-patient"><span class="header-nav-folder-item-content">New Patient Registration</span></a></div>
            <div class="header-nav-folder-item"><a href="/portal"><span class="header-nav-folder-item-content">Patient Portal</span></a></div>
            <div class="header-nav-folder-item"><a href="/fullscript"><span class="header-nav-folder-item-content">Order Supplements</span></a></div>
            <div class="header-nav-folder-item"><a href="/patient-scales-packet"><span class="header-nav-folder-item-content">Patient Scales</span></a></div>
            <div class="header-nav-folder-item"><a href="/hipaa-release"><span class="header-nav-folder-item-content">HIPAA Release</span></a></div>
            <div class="header-nav-folder-item"><a href="/prior-authorization"><span class="header-nav-folder-item-content">Prior Auth Request</span></a></div>
            <div class="header-nav-folder-item"><a href="/testimonials"><span class="header-nav-folder-item-content">Testimonials</span></a></div>
            <div class="header-nav-folder-item"><a href="/faq"><span class="header-nav-folder-item-content">FAQ</span></a></div>
          </div>
        </div>
        <div class="header-nav-item header-nav-item--folder">
          <button class="header-nav-folder-title" data-href="/referrals-1" aria-expanded="false" aria-controls="referrals-m">
            <span class="header-nav-folder-title-text">Referrals</span>
          </button>
          <div class="header-nav-folder-content" id="referrals-m">
            <div class="header-nav-folder-item"><a href="/refer-patient"><span class="header-nav-folder-item-content">Refer A Patient</span></a></div>
            <div class="header-nav-folder-item"><a href="/our-referrals"><span class="header-nav-folder-item-content">Our Referrals</span></a></div>
          </div>
        </div>
        <div class="header-nav-item header-nav-item--folder">
          <button class="header-nav-folder-title" data-href="/billing" aria-expanded="false" aria-controls="billing-m">
            <span class="header-nav-folder-title-text">Billing</span>
          </button>
          <div class="header-nav-folder-content" id="billing-m">
            <div class="header-nav-folder-item"><a href="/insurances"><span class="header-nav-folder-item-content">Insurances &amp; Rates</span></a></div>
            <div class="header-nav-folder-item"><a href="/update-insurance"><span class="header-nav-folder-item-content">Update Insurance</span></a></div>
            <div class="header-nav-folder-item header-nav-folder-item--external"><a href="https://mycw197.ecwcloud.com/portal24839/jsp/100mp/login_otp.jsp" target="_blank">Make A Payment</a></div>
          </div>
        </div>
        <div class="header-nav-item header-nav-item--collection"><a href="/about">About</a></div>
        <div class="header-nav-item header-nav-item--collection"><a href="/blog">Blog</a></div>
        <div class="header-nav-item header-nav-item--collection"><a href="/contact">Contact</a></div>
      </nav>
    </div>
  </div>
</div>
<div class="header-actions header-actions--right">
  <div class="header-actions-action header-actions-action--cta">
    <a class="btn btn--border theme-btn--primary-inverse sqs-button-element--secondary" href="/new-patient">Register Today</a>
  </div>
</div>
<div class="header-burger menu-overlay-has-visible-non-navigation-items">
  <button class="header-burger-btn burger" data-test="header-burger">
    <span class="js-header-burger-open-title visually-hidden">Open Menu</span>
    <span hidden class="js-header-burger-close-title visually-hidden">Close Menu</span>
    <div class="burger-box">
      <div class="burger-inner header-menu-icon-doubleLineHamburger">
        <div class="top-bun"></div>
        <div class="patty"></div>
        <div class="bottom-bun"></div>
      </div>
    </div>
  </button>
</div>

      </div>
    </div>
  </div>
</header>`;

const NAV_LINKS = [
  { label: "Home", href: "/" },
  {
    label: "Services",
    children: [
      { label: "Medication Management", href: "/medication-management" },
      { label: "Talk Therapy Counseling", href: "/talk-therapy" },
      { label: "TMS Therapy", href: "/tms" },
      { label: "Spravato", href: "/spravato" },
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

function MobileMenu({ open, onClose }) {
  return (
    <div className={`custom-mobile-menu ${open ? "custom-mobile-menu--open" : ""}`}>
      <div className="custom-mobile-menu-topbar">
        <img
          src="//images.squarespace-cdn.com/content/v1/6525fe2f00c9de2ec400ea4f/543bd20d-27e9-4baa-817b-fe18c5434f79/evolve+new+logo+with+name.jpg?format=1500w"
          alt="Evolve Psychiatry"
          className="custom-mobile-menu-logo"
        />
        <button
          className="custom-mobile-menu-close"
          onClick={onClose}
          aria-label="Close Menu"
        >
          &times;
        </button>
      </div>
      <nav className="custom-mobile-menu-nav">
        {NAV_LINKS.map((item) =>
          item.children ? (
            <details key={item.label} className="custom-mobile-menu-group">
              <summary>
                {item.label}
                <span className="custom-mobile-menu-chevron">&#8250;</span>
              </summary>
              <div className="custom-mobile-menu-sublist">
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
            <a key={item.label} href={item.href} className="custom-mobile-menu-link">
              {item.label}
            </a>
          )
        )}
        <a href="/new-patient" className="custom-mobile-menu-cta">
          Register Today
        </a>
      </nav>
    </div>
  );
}

export default function SiteHeader() {
  const rootRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Using event delegation on document (rather than attaching directly
    // to each burger button) so the handler can't get silently detached
    // if anything ever touches/replaces those specific button nodes --
    // this listener lives on document for the component's whole lifetime.
    function handleDocumentClick(e) {
      if (e.target.closest(".header-burger-btn")) {
        setMenuOpen(true);
      }
    }
    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  return (
    <>
      <div ref={rootRef} dangerouslySetInnerHTML={{ __html: HEADER_HTML }} />
      <div style={{ height: 140 }} aria-hidden="true" />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
