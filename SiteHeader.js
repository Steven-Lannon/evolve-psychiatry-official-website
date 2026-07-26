"use client";

import { useEffect, useRef } from "react";

// This is the REAL markup from evolvepsychiatry.com's Squarespace header,
// copied verbatim (desktop layout, mobile layout, and the full-screen
// mobile overlay menu). It relies on the real Squarespace stylesheet
// (linked in layout.js) for all visual styling -- no guessed CSS here.
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
        <div class="header-nav-item header-nav-item--collection header-nav-item--active header-nav-item--homepage">
          <a href="/" aria-current="page">Home</a>
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
  <div class="header-actions-action header-actions-action--social">
    <a class="icon icon--fill header-icon header-icon-border-shape-none header-icon-border-style-outline" href="https://www.instagram.com/evolve.psychiatry" target="_blank" aria-label="Instagram"><svg viewBox="23 23 64 64"><use xlink:href="#instagram-unauth-icon" width="110" height="110"></use></svg></a>
    <a class="icon icon--fill header-icon header-icon-border-shape-none header-icon-border-style-outline" href="https://www.facebook.com/p/Evolve-Psychiatry-100054402074775/" target="_blank" aria-label="Facebook"><svg viewBox="23 23 64 64"><use xlink:href="#facebook-unauth-icon" width="110" height="110"></use></svg></a>
    <a class="icon icon--fill header-icon header-icon-border-shape-none header-icon-border-style-outline" href="https://www.tiktok.com/@evolve.psychiatry" target="_blank" aria-label="TikTok"><svg viewBox="23 23 64 64"><use xlink:href="#tiktok-unauth-icon" width="110" height="110"></use></svg></a>
    <a class="icon icon--fill header-icon header-icon-border-shape-none header-icon-border-style-outline" href="https://www.linkedin.com/company/evolvepsychiatry/" target="_blank" aria-label="LinkedIn"><svg viewBox="23 23 64 64"><use xlink:href="#linkedin-unauth-icon" width="110" height="110"></use></svg></a>
  </div>
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
        <div class="header-nav-item header-nav-item--collection header-nav-item--active header-nav-item--homepage">
          <a href="/" aria-current="page">Home</a>
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
  <div class="header-actions-action header-actions-action--social">
    <a class="icon icon--fill header-icon header-icon-border-shape-none header-icon-border-style-outline" href="https://www.instagram.com/evolve.psychiatry" target="_blank" aria-label="Instagram"><svg viewBox="23 23 64 64"><use xlink:href="#instagram-unauth-icon" width="110" height="110"></use></svg></a>
    <a class="icon icon--fill header-icon header-icon-border-shape-none header-icon-border-style-outline" href="https://www.facebook.com/p/Evolve-Psychiatry-100054402074775/" target="_blank" aria-label="Facebook"><svg viewBox="23 23 64 64"><use xlink:href="#facebook-unauth-icon" width="110" height="110"></use></svg></a>
    <a class="icon icon--fill header-icon header-icon-border-shape-none header-icon-border-style-outline" href="https://www.tiktok.com/@evolve.psychiatry" target="_blank" aria-label="TikTok"><svg viewBox="23 23 64 64"><use xlink:href="#tiktok-unauth-icon" width="110" height="110"></use></svg></a>
    <a class="icon icon--fill header-icon header-icon-border-shape-none header-icon-border-style-outline" href="https://www.linkedin.com/company/evolvepsychiatry/" target="_blank" aria-label="LinkedIn"><svg viewBox="23 23 64 64"><use xlink:href="#linkedin-unauth-icon" width="110" height="110"></use></svg></a>
  </div>
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

<div class="header-menu header-menu--folder-list" data-test="header-menu">
  <div class="header-menu-bg theme-bg--primary"></div>
  <div class="header-menu-nav">
    <nav class="header-menu-nav-list">
      <div data-folder="root" class="header-menu-nav-folder">
        <div class="header-menu-nav-folder-content">
          <div class="header-menu-nav-wrapper">
            <div class="container header-menu-nav-item header-menu-nav-item--collection header-menu-nav-item--active header-menu-nav-item--homepage">
              <a href="/" aria-current="page"><div class="header-menu-nav-item-content">Home</div></a>
            </div>

            <div class="container header-menu-nav-item">
              <a data-folder-id="/services-folder/" href="/services-folder/" class="cse-dropdown-trigger" tabindex="0">
                <div class="header-menu-nav-item-content header-menu-nav-item-content-folder">
                  <span class="visually-hidden">Folder:</span>
                  <span class="header-nav-folder-title-text">Services</span>
                  <span class="header-dropdown-icon header-dropdown-flip"><svg viewBox="0 0 22 22"><use href="#openArrowHead"></use></svg></span>
                </div>
              </a>
              <div data-folder="/services-folder/" class="header-menu-nav-folder cse-dropdown-content">
                <div class="header-menu-nav-folder-content">
                  <div class="header-menu-controls container header-menu-nav-item">
                    <a class="header-menu-controls-control header-menu-controls-control--active" data-action="back" href="/" tabindex="-1">
                      <span class="header-dropdown-icon header-dropdown-flip"><svg viewBox="0 0 22 22"><use href="#openArrowHead"></use></svg></span>
                      <span>Back</span>
                    </a>
                  </div>
                  <div class="container header-menu-nav-item"><a href="/medication-management" tabindex="-1"><div class="header-menu-nav-item-content">Medication Management</div></a></div>
                  <div class="container header-menu-nav-item"><a href="/talk-therapy" tabindex="-1"><div class="header-menu-nav-item-content">Talk Therapy Counseling</div></a></div>
                  <div class="container header-menu-nav-item"><a href="/tms" tabindex="-1"><div class="header-menu-nav-item-content">TMS Therapy</div></a></div>
                  <div class="container header-menu-nav-item"><a href="/spravato" tabindex="-1"><div class="header-menu-nav-item-content">Spravato</div></a></div>
                  <div class="container header-menu-nav-item"><a href="/telehealth" tabindex="-1"><div class="header-menu-nav-item-content">Telehealth Appointments</div></a></div>
                  <div class="container header-menu-nav-item"><a href="/genesight" tabindex="-1"><div class="header-menu-nav-item-content">GeneSight Testing</div></a></div>
                </div>
              </div>
            </div>

            <div class="container header-menu-nav-item">
              <a data-folder-id="/clinicians-folder/" href="/clinicians-folder/" class="cse-dropdown-trigger" tabindex="0">
                <div class="header-menu-nav-item-content header-menu-nav-item-content-folder">
                  <span class="visually-hidden">Folder:</span>
                  <span class="header-nav-folder-title-text">Clinicians</span>
                  <span class="header-dropdown-icon header-dropdown-flip"><svg viewBox="0 0 22 22"><use href="#openArrowHead"></use></svg></span>
                </div>
              </a>
              <div data-folder="/clinicians-folder/" class="header-menu-nav-folder cse-dropdown-content">
                <div class="header-menu-nav-folder-content">
                  <div class="header-menu-controls container header-menu-nav-item">
                    <a class="header-menu-controls-control header-menu-controls-control--active" data-action="back" href="/" tabindex="-1">
                      <span class="header-dropdown-icon header-dropdown-flip"><svg viewBox="0 0 22 22"><use href="#openArrowHead"></use></svg></span>
                      <span>Back</span>
                    </a>
                  </div>
                  <div class="container header-menu-nav-item"><a href="/prescribers" tabindex="-1"><div class="header-menu-nav-item-content">Our Prescribers</div></a></div>
                  <div class="container header-menu-nav-item"><a href="/therapists" tabindex="-1"><div class="header-menu-nav-item-content">Our Therapists</div></a></div>
                </div>
              </div>
            </div>

            <div class="container header-menu-nav-item">
              <a data-folder-id="/locations-folder/" href="/locations-folder/" class="cse-dropdown-trigger" tabindex="0">
                <div class="header-menu-nav-item-content header-menu-nav-item-content-folder">
                  <span class="visually-hidden">Folder:</span>
                  <span class="header-nav-folder-title-text">Locations</span>
                  <span class="header-dropdown-icon header-dropdown-flip"><svg viewBox="0 0 22 22"><use href="#openArrowHead"></use></svg></span>
                </div>
              </a>
              <div data-folder="/locations-folder/" class="header-menu-nav-folder cse-dropdown-content">
                <div class="header-menu-nav-folder-content">
                  <div class="header-menu-controls container header-menu-nav-item">
                    <a class="header-menu-controls-control header-menu-controls-control--active" data-action="back" href="/" tabindex="-1">
                      <span class="header-dropdown-icon header-dropdown-flip"><svg viewBox="0 0 22 22"><use href="#openArrowHead"></use></svg></span>
                      <span>Back</span>
                    </a>
                  </div>
                  <div class="container header-menu-nav-item"><a href="/albany" tabindex="-1"><div class="header-menu-nav-item-content">Albany, NY</div></a></div>
                  <div class="container header-menu-nav-item"><a href="/garden-city" tabindex="-1"><div class="header-menu-nav-item-content">Garden City, NY</div></a></div>
                  <div class="container header-menu-nav-item"><a href="/hauppauge" tabindex="-1"><div class="header-menu-nav-item-content">Hauppauge, NY</div></a></div>
                  <div class="container header-menu-nav-item"><a href="/massapequa" tabindex="-1"><div class="header-menu-nav-item-content">Massapequa, NY</div></a></div>
                  <div class="container header-menu-nav-item"><a href="/syosset" tabindex="-1"><div class="header-menu-nav-item-content">Syosset, NY</div></a></div>
                  <div class="container header-menu-nav-item"><a href="/wilmington" tabindex="-1"><div class="header-menu-nav-item-content">Wilmington, NC</div></a></div>
                </div>
              </div>
            </div>

            <div class="container header-menu-nav-item">
              <a data-folder-id="/resources" href="/resources" class="cse-dropdown-trigger" tabindex="0">
                <div class="header-menu-nav-item-content header-menu-nav-item-content-folder">
                  <span class="visually-hidden">Folder:</span>
                  <span class="header-nav-folder-title-text">Patient Resources</span>
                  <span class="header-dropdown-icon header-dropdown-flip"><svg viewBox="0 0 22 22"><use href="#openArrowHead"></use></svg></span>
                </div>
              </a>
              <div data-folder="/resources" class="header-menu-nav-folder cse-dropdown-content">
                <div class="header-menu-nav-folder-content">
                  <div class="header-menu-controls container header-menu-nav-item">
                    <a class="header-menu-controls-control header-menu-controls-control--active" data-action="back" href="/" tabindex="-1">
                      <span class="header-dropdown-icon header-dropdown-flip"><svg viewBox="0 0 22 22"><use href="#openArrowHead"></use></svg></span>
                      <span>Back</span>
                    </a>
                  </div>
                  <div class="container header-menu-nav-item"><a href="/new-patient" tabindex="-1"><div class="header-menu-nav-item-content">New Patient Registration</div></a></div>
                  <div class="container header-menu-nav-item"><a href="/portal" tabindex="-1"><div class="header-menu-nav-item-content">Patient Portal</div></a></div>
                  <div class="container header-menu-nav-item"><a href="/fullscript" tabindex="-1"><div class="header-menu-nav-item-content">Order Supplements</div></a></div>
                  <div class="container header-menu-nav-item"><a href="/patient-scales-packet" tabindex="-1"><div class="header-menu-nav-item-content">Patient Scales</div></a></div>
                  <div class="container header-menu-nav-item"><a href="/hipaa-release" tabindex="-1"><div class="header-menu-nav-item-content">HIPAA Release</div></a></div>
                  <div class="container header-menu-nav-item"><a href="/prior-authorization" tabindex="-1"><div class="header-menu-nav-item-content">Prior Auth Request</div></a></div>
                  <div class="container header-menu-nav-item"><a href="/testimonials" tabindex="-1"><div class="header-menu-nav-item-content">Testimonials</div></a></div>
                  <div class="container header-menu-nav-item"><a href="/faq" tabindex="-1"><div class="header-menu-nav-item-content">FAQ</div></a></div>
                </div>
              </div>
            </div>

            <div class="container header-menu-nav-item">
              <a data-folder-id="/referrals-1" href="/referrals-1" class="cse-dropdown-trigger" tabindex="0">
                <div class="header-menu-nav-item-content header-menu-nav-item-content-folder">
                  <span class="visually-hidden">Folder:</span>
                  <span class="header-nav-folder-title-text">Referrals</span>
                  <span class="header-dropdown-icon header-dropdown-flip"><svg viewBox="0 0 22 22"><use href="#openArrowHead"></use></svg></span>
                </div>
              </a>
              <div data-folder="/referrals-1" class="header-menu-nav-folder cse-dropdown-content">
                <div class="header-menu-nav-folder-content">
                  <div class="header-menu-controls container header-menu-nav-item">
                    <a class="header-menu-controls-control header-menu-controls-control--active" data-action="back" href="/" tabindex="-1">
                      <span class="header-dropdown-icon header-dropdown-flip"><svg viewBox="0 0 22 22"><use href="#openArrowHead"></use></svg></span>
                      <span>Back</span>
                    </a>
                  </div>
                  <div class="container header-menu-nav-item"><a href="/refer-patient" tabindex="-1"><div class="header-menu-nav-item-content">Refer A Patient</div></a></div>
                  <div class="container header-menu-nav-item"><a href="/our-referrals" tabindex="-1"><div class="header-menu-nav-item-content">Our Referrals</div></a></div>
                </div>
              </div>
            </div>

            <div class="container header-menu-nav-item">
              <a data-folder-id="/billing" href="/billing" class="cse-dropdown-trigger" tabindex="0">
                <div class="header-menu-nav-item-content header-menu-nav-item-content-folder">
                  <span class="visually-hidden">Folder:</span>
                  <span class="header-nav-folder-title-text">Billing</span>
                  <span class="header-dropdown-icon header-dropdown-flip"><svg viewBox="0 0 22 22"><use href="#openArrowHead"></use></svg></span>
                </div>
              </a>
              <div data-folder="/billing" class="header-menu-nav-folder cse-dropdown-content">
                <div class="header-menu-nav-folder-content">
                  <div class="header-menu-controls container header-menu-nav-item">
                    <a class="header-menu-controls-control header-menu-controls-control--active" data-action="back" href="/" tabindex="-1">
                      <span class="header-dropdown-icon header-dropdown-flip"><svg viewBox="0 0 22 22"><use href="#openArrowHead"></use></svg></span>
                      <span>Back</span>
                    </a>
                  </div>
                  <div class="container header-menu-nav-item"><a href="/insurances" tabindex="-1"><div class="header-menu-nav-item-content">Insurances &amp; Rates</div></a></div>
                  <div class="container header-menu-nav-item"><a href="/update-insurance" tabindex="-1"><div class="header-menu-nav-item-content">Update Insurance</div></a></div>
                  <div class="container header-menu-nav-item header-menu-nav-item--external"><a href="https://mycw197.ecwcloud.com/portal24839/jsp/100mp/login_otp.jsp" target="_blank" tabindex="-1">Make A Payment</a></div>
                </div>
              </div>
            </div>

            <div class="container header-menu-nav-item header-menu-nav-item--collection"><a href="/about"><div class="header-menu-nav-item-content">About</div></a></div>
            <div class="container header-menu-nav-item header-menu-nav-item--collection"><a href="/blog"><div class="header-menu-nav-item-content">Blog</div></a></div>
            <div class="container header-menu-nav-item header-menu-nav-item--collection"><a href="/contact"><div class="header-menu-nav-item-content">Contact</div></a></div>
          </div>
        </div>
      </div>
    </nav>
  </div>
  <div class="header-menu-actions social-accounts">
    <div class="header-menu-actions-action header-menu-actions-action--social mobile"><a class="icon icon--lg icon--fill header-icon header-icon-border-shape-none header-icon-border-style-outline" href="https://www.instagram.com/evolve.psychiatry" target="_blank" aria-label="Instagram"><svg viewBox="23 23 64 64"><use xlink:href="#instagram-unauth-icon" width="110" height="110"></use></svg></a></div>
    <div class="header-menu-actions-action header-menu-actions-action--social mobile"><a class="icon icon--lg icon--fill header-icon header-icon-border-shape-none header-icon-border-style-outline" href="https://www.facebook.com/p/Evolve-Psychiatry-100054402074775/" target="_blank" aria-label="Facebook"><svg viewBox="23 23 64 64"><use xlink:href="#facebook-unauth-icon" width="110" height="110"></use></svg></a></div>
    <div class="header-menu-actions-action header-menu-actions-action--social mobile"><a class="icon icon--lg icon--fill header-icon header-icon-border-shape-none header-icon-border-style-outline" href="https://www.tiktok.com/@evolve.psychiatry" target="_blank" aria-label="TikTok"><svg viewBox="23 23 64 64"><use xlink:href="#tiktok-unauth-icon" width="110" height="110"></use></svg></a></div>
    <div class="header-menu-actions-action header-menu-actions-action--social mobile"><a class="icon icon--lg icon--fill header-icon header-icon-border-shape-none header-icon-border-style-outline" href="https://www.linkedin.com/company/evolvepsychiatry/" target="_blank" aria-label="LinkedIn"><svg viewBox="23 23 64 64"><use xlink:href="#linkedin-unauth-icon" width="110" height="110"></use></svg></a></div>
  </div>
  <div class="header-menu-cta"><a class="theme-btn--primary btn sqs-button-element--secondary" href="/new-patient">Register Today</a></div>
</div>

</header>`;

export default function SiteHeader() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const header = root.querySelector(".header");
    const burgerBtn = root.querySelector(".header-burger-btn");
    const headerMenu = root.querySelector(".header-menu");

    // --- Burger button: open/close the full-screen mobile overlay menu ---
    function toggleOverlay() {
      const isOpen = header.classList.toggle("header-menu-open");
      if (headerMenu) {
        headerMenu.style.display = isOpen ? "block" : "";
      }
      document.body.classList.toggle("sqs-menu-open", isOpen);
    }
    burgerBtn?.addEventListener("click", toggleOverlay);

    // --- Desktop folder dropdowns (Services, Clinicians, etc.) ---
    // Squarespace normally shows these on hover via CSS. If your real
    // stylesheet does that already, this is a no-op safety net for
    // keyboard/click users; it just toggles a class the CSS can key off.
    const desktopFolderButtons = root.querySelectorAll(
      ".header-display-desktop .header-nav-folder-title"
    );
    function toggleDesktopFolder(e) {
      const item = e.currentTarget.closest(".header-nav-item--folder");
      item?.classList.toggle("header-nav-folder-open");
    }
    desktopFolderButtons.forEach((btn) =>
      btn.addEventListener("click", toggleDesktopFolder)
    );

    // --- Mobile overlay: folder drill-down (Services > list, then Back) ---
    const triggers = root.querySelectorAll(".cse-dropdown-trigger");
    function openMobileFolder(e) {
      e.preventDefault();
      const content = e.currentTarget.nextElementSibling;
      content?.classList.add("cse-dropdown-open");
    }
    triggers.forEach((t) => t.addEventListener("click", openMobileFolder));

    const backButtons = root.querySelectorAll('[data-action="back"]');
    function closeMobileFolder(e) {
      e.preventDefault();
      const content = e.currentTarget.closest(".cse-dropdown-content");
      content?.classList.remove("cse-dropdown-open");
    }
    backButtons.forEach((b) => b.addEventListener("click", closeMobileFolder));

    return () => {
      burgerBtn?.removeEventListener("click", toggleOverlay);
      desktopFolderButtons.forEach((btn) =>
        btn.removeEventListener("click", toggleDesktopFolder)
      );
      triggers.forEach((t) => t.removeEventListener("click", openMobileFolder));
      backButtons.forEach((b) => b.removeEventListener("click", closeMobileFolder));
    };
  }, []);

  return <div ref={rootRef} dangerouslySetInnerHTML={{ __html: HEADER_HTML }} />;
}
