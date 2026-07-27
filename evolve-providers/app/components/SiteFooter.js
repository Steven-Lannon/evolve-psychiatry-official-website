// Real Squarespace footer markup: logo, link columns, social icons,
// Psychology Today badge, and copyright -- pulled directly from the
// homepage source. The two "mega-menu" sections (Patient Resources,
// Prescribers/Therapists) that depend on Squarespace's own JS to
// populate are intentionally left out; this component only includes
// the fully self-contained main footer.
//
// No client-side interactivity is needed here (unlike the header), so
// this can stay a plain server component -- no "use client" required.

const FOOTER_HTML = `<footer class="sections" id="footer-sections">
  <section data-section-theme="dark" class="page-section full-bleed-section background-width--full-bleed content-width--wide horizontal-alignment--center vertical-alignment--top dark">
    <div class="content-wrapper">
      <div class="content">
        <div data-fluid-engine="true">
          <style>
.fe-652d81900b42f24a4e431ab7 {
  --grid-gutter: calc(var(--sqs-mobile-site-gutter, 6vw) - 0.0px);
  --cell-max-width: calc( ( var(--sqs-site-max-width, 1500px) - (0.0px * (8 - 1)) ) / 8 );

  display: grid;
  position: relative;
  grid-area: 1/1/-1/-1;
  grid-template-rows: repeat(30,minmax(24px, auto));
  grid-template-columns:
    minmax(var(--grid-gutter), 1fr)
    repeat(8, minmax(0, var(--cell-max-width)))
    minmax(var(--grid-gutter), 1fr);
  row-gap: 0.0px;
  column-gap: 0.0px;
  overflow-x: hidden;
  overflow-x: clip;
}

@media (min-width: 768px) {
  .background-width--inset .fe-652d81900b42f24a4e431ab7 {
    --inset-padding: calc(var(--sqs-site-gutter) * 2);
  }

  .fe-652d81900b42f24a4e431ab7 {
    --grid-gutter: calc(var(--sqs-site-gutter, 4vw) - 0.0px);
    --cell-max-width: calc( ( var(--sqs-site-max-width, 1500px) - (0.0px * (24 - 1)) ) / 24 );
    --inset-padding: 0vw;

    --row-height-scaling-factor: 0.0215;
    --container-width: min(var(--sqs-site-max-width, 1500px), calc(100vw - var(--sqs-site-gutter, 4vw) * 2 - var(--inset-padding) ));

    grid-template-rows: repeat(10,minmax(calc(var(--container-width) * var(--row-height-scaling-factor)), auto));
    grid-template-columns:
      minmax(var(--grid-gutter), 1fr)
      repeat(24, minmax(0, var(--cell-max-width)))
      minmax(var(--grid-gutter), 1fr);
  }
}

.fe-block-footer-logo {
  grid-area: 1/2/3/10;
  z-index: 3;
}
.fe-block-footer-logo .sqs-block { justify-content: center; }
.fe-block-footer-logo .sqs-block-alignment-wrapper { align-items: center; }
@media (min-width: 768px) {
  .fe-block-footer-logo { grid-area: 1/13/2/15; z-index: 3; }
  .fe-block-footer-logo .sqs-block { justify-content: center; }
  .fe-block-footer-logo .sqs-block-alignment-wrapper { align-items: center; }
}

.fe-block-footer-heading {
  grid-area: 4/2/6/10;
  z-index: 4;
}
.fe-block-footer-heading .sqs-block { justify-content: flex-start; }
.fe-block-footer-heading .sqs-block-alignment-wrapper { align-items: flex-start; }
@media (min-width: 768px) {
  .fe-block-footer-heading { grid-area: 2/4/4/24; z-index: 4; }
  .fe-block-footer-heading .sqs-block { justify-content: flex-start; }
  .fe-block-footer-heading .sqs-block-alignment-wrapper { align-items: flex-start; }
}

.fe-block-footer-col1 {
  grid-area: 6/2/13/6;
  z-index: 0;
}
.fe-block-footer-col1 .sqs-block { justify-content: flex-start; }
.fe-block-footer-col1 .sqs-block-alignment-wrapper { align-items: flex-start; }
@media (min-width: 768px) {
  .fe-block-footer-col1 { grid-area: 5/4/9/7; z-index: 0; }
  .fe-block-footer-col1 .sqs-block { justify-content: flex-start; }
  .fe-block-footer-col1 .sqs-block-alignment-wrapper { align-items: flex-start; }
}

.fe-block-footer-col2 {
  grid-area: 6/6/13/10;
  z-index: 1;
}
.fe-block-footer-col2 .sqs-block { justify-content: flex-start; }
.fe-block-footer-col2 .sqs-block-alignment-wrapper { align-items: flex-start; }
@media (min-width: 768px) {
  .fe-block-footer-col2 { grid-area: 5/8/9/11; z-index: 1; }
  .fe-block-footer-col2 .sqs-block { justify-content: flex-start; }
  .fe-block-footer-col2 .sqs-block-alignment-wrapper { align-items: flex-start; }
}

.fe-block-footer-col3 {
  grid-area: 14/2/19/6;
  z-index: 2;
}
.fe-block-footer-col3 .sqs-block { justify-content: flex-start; }
.fe-block-footer-col3 .sqs-block-alignment-wrapper { align-items: flex-start; }
@media (min-width: 768px) {
  .fe-block-footer-col3 { grid-area: 5/12/9/15; z-index: 2; }
  .fe-block-footer-col3 .sqs-block { justify-content: flex-start; }
  .fe-block-footer-col3 .sqs-block-alignment-wrapper { align-items: flex-start; }
}

.fe-block-footer-copyright {
  grid-area: 28/2/31/10;
  z-index: 8;
}
.fe-block-footer-copyright .sqs-block { justify-content: center; }
.fe-block-footer-copyright .sqs-block-alignment-wrapper { align-items: center; }
@media (min-width: 768px) {
  .fe-block-footer-copyright { grid-area: 10/4/11/24; z-index: 8; }
  .fe-block-footer-copyright .sqs-block { justify-content: center; }
  .fe-block-footer-copyright .sqs-block-alignment-wrapper { align-items: center; }
}

</style>
<div class="fluid-engine fe-652d81900b42f24a4e431ab7">

            <div class="fe-block fe-block-footer-logo">
              <div class="sqs-block-content">
                <a href="/">
                  <img
                    src="https://images.squarespace-cdn.com/content/v1/6525fe2f00c9de2ec400ea4f/3f762257-df88-44be-a5e6-11f8c47a9aae/evolve-logo-lighter-blue-gray.png"
                    alt="Evolve Psychiatry"
                    style="display:block;width:100%;height:auto;object-fit:contain"
                  />
                </a>
              </div>
            </div>

            <div class="fe-block fe-block-footer-heading">
              <div class="sqs-block-content">
                <p class="sqsrte-large">Site Links</p>
              </div>
            </div>

            <div class="fe-block fe-block-footer-col1">
              <div class="sqs-block-content">
                <p class="sqsrte-small"><a href="/about">About</a></p>
                <p class="sqsrte-small"><a href="/new-patient">Register</a></p>
                <p class="sqsrte-small"><a href="/contact">Contact</a></p>
                <p class="sqsrte-small"><a href="/locations">Locations</a></p>
              </div>
            </div>

            <div class="fe-block fe-block-footer-col2">
              <div class="sqs-block-content">
                <p class="sqsrte-small"><a href="/services">Services</a></p>
                <p class="sqsrte-small"><a href="/clinicians">Clinicians</a></p>
                <p class="sqsrte-small"><a href="/insurances">Insurances</a></p>
                <p class="sqsrte-small"><a href="/blog">Blog</a></p>
              </div>
            </div>

            <div class="fe-block fe-block-footer-col3">
              <div class="sqs-block-content">
                <p class="sqsrte-small"><a href="/testimonials">Testimonials</a></p>
                <p class="sqsrte-small"><a href="/faq">FAQ</a></p>
                <p class="sqsrte-small"><a href="/privacy-policy">Privacy Policy</a></p>
              </div>
            </div>

            <div class="fe-block fe-block-footer-copyright">
              <div class="sqs-block-content">
                <p class="sqsrte-small"><em>Copyright &copy; 2026 All Rights Reserved Evolve Psychiatry.</em></p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </section>
</footer>
`;

export default function SiteFooter() {
  return <div dangerouslySetInnerHTML={{ __html: FOOTER_HTML }} />;
}
