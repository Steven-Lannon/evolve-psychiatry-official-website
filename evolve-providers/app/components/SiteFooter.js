const FOOTER_COLUMNS = [
  [
    ["About", "/about"],
    ["Register", "/new-patient"],
    ["Contact", "/contact"],
    ["Locations", "/locations"],
  ],
  [
    ["Services", "/services"],
    ["Clinicians", "/clinicians"],
    ["Insurances", "/insurances"],
    ["Blog", "/blog"],
  ],
  [
    ["Testimonials", "/testimonials"],
    ["FAQ", "/faq"],
    ["Privacy Policy", "/privacy-policy"],
  ],
  [
    ["New Patient", "/new-patient"],
    ["Insurances", "/insurances"],
    ["Patient Scales", "/patient-scales-packet"],
    ["Clinician Directory", "/clinicians"],
  ],
];

export default function SiteFooter() {
  const base = "https://evolvepsychiatry.com";
  return (
    <footer className="site-footer">
      <div className="footer-columns">
        {FOOTER_COLUMNS.map((col, i) => (
          <div className="footer-col" key={i}>
            {col.map(([text, href]) => (
              <a key={text} href={base + href}>{text}</a>
            ))}
          </div>
        ))}
      </div>
      <div className="footer-social">
        <a href="https://www.instagram.com/evolve.psychiatry" aria-label="Instagram" target="_blank" rel="noopener noreferrer">IG</a>
        <a href="https://www.facebook.com/p/Evolve-Psychiatry-100054402074775/" aria-label="Facebook" target="_blank" rel="noopener noreferrer">FB</a>
        <a href="https://www.tiktok.com/@evolve.psychiatry" aria-label="TikTok" target="_blank" rel="noopener noreferrer">TT</a>
        <a href="https://www.linkedin.com/company/evolvepsychiatry/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">IN</a>
      </div>
      <div className="footer-badge">
        <a href="https://www.psychologytoday.com/profile/128152" target="_blank" rel="noopener noreferrer">
          Verified by Psychology Today
        </a>
      </div>
      <p className="footer-copyright">
        Copyright &copy; {new Date().getFullYear()} All Rights Reserved Evolve Psychiatry.
      </p>
    </footer>
  );
}
