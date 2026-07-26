const NAV_GROUPS = [
  { label: "Services", href: "/services", items: [
    ["Medication Management", "/medication-management"],
    ["Talk Therapy Counseling", "/talk-therapy"],
    ["TMS Therapy", "/tms"],
    ["Spravato", "/spravato"],
    ["Telehealth Appointments", "/telehealth"],
    ["GeneSight Testing", "/genesight"],
  ]},
  { label: "Clinicians", href: "/clinicians", items: [
    ["Our Prescribers", "/prescribers"],
    ["Our Therapists", "/therapists"],
  ]},
  { label: "Locations", href: "/locations", items: [
    ["Albany, NY", "/albany"],
    ["Garden City, NY", "/garden-city"],
    ["Hauppauge, NY", "/hauppauge"],
    ["Massapequa, NY", "/massapequa"],
    ["Syosset, NY", "/syosset"],
    ["Wilmington, NC", "/wilmington"],
  ]},
  { label: "Patient Resources", href: "/new-patient", items: [
    ["New Patient Registration", "/new-patient"],
    ["Patient Portal", "/portal"],
    ["Order Supplements", "/fullscript"],
    ["Patient Scales", "/patient-scales-packet"],
    ["HIPAA Release", "/hipaa-release"],
    ["Prior Auth Request", "/prior-authorization"],
    ["Testimonials", "/testimonials"],
    ["FAQ", "/faq"],
  ]},
  { label: "Referrals", href: "/refer-patient", items: [
    ["Refer A Patient", "/refer-patient"],
    ["Our Referrals", "/our-referrals"],
  ]},
  { label: "Billing", href: "/insurances", items: [
    ["Insurances & Rates", "/insurances"],
    ["Update Insurance", "/update-insurance"],
    ["Make A Payment", "https://mycw197.ecwcloud.com/portal24839/jsp/100mp/login_otp.jsp"],
  ]},
];

export default function SiteHeader() {
  const base = "https://evolvepsychiatry.com";
  return (
    <header className="site-header">
      <div className="announcement-bar">
        <a href="tel:+18444432563">Call Us 1-844-4HEALME</a>
      </div>
      <div className="nav-bar">
        <a href={base + "/"} className="logo-link">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.squarespace-cdn.com/content/v1/6525fe2f00c9de2ec400ea4f/543bd20d-27e9-4baa-817b-fe18c5434f79/evolve+new+logo+with+name.jpg"
            alt="Evolve Psychiatry"
            className="logo-img"
          />
        </a>
        <nav className="main-nav">
          <a href={base + "/"}>Home</a>
          {NAV_GROUPS.map((group) => (
            <div className="nav-item-folder" key={group.label}>
              <a href={base + group.href}>{group.label}</a>
              <div className="nav-dropdown">
                {group.items.map(([text, href]) => (
                  <a
                    key={href}
                    href={href.startsWith("http") ? href : base + href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  >
                    {text}
                  </a>
                ))}
              </div>
            </div>
          ))}
          <a href={base + "/about"}>About</a>
          <a href={base + "/blog"}>Blog</a>
          <a href={base + "/contact"}>Contact</a>
        </nav>
        <div className="nav-actions">
          <a href="https://www.instagram.com/evolve.psychiatry" aria-label="Instagram" target="_blank" rel="noopener noreferrer">IG</a>
          <a href="https://www.facebook.com/p/Evolve-Psychiatry-100054402074775/" aria-label="Facebook" target="_blank" rel="noopener noreferrer">FB</a>
          <a href="https://www.tiktok.com/@evolve.psychiatry" aria-label="TikTok" target="_blank" rel="noopener noreferrer">TT</a>
          <a href="https://www.linkedin.com/company/evolvepsychiatry/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">IN</a>
          <a href={base + "/new-patient"} className="register-btn">Register Today</a>
        </div>
      </div>
    </header>
  );
}
