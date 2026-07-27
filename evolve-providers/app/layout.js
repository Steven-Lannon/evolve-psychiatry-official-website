import "./globals.css";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";

export const metadata = {
  metadataBase: new URL("https://evolvepsychiatry.com"),
};

// This is a TRIMMED version of evolvepsychiatry.com's real <body> class
// list -- keeping only what actually affects header layout and button
// shape on this page. The full homepage class list included classes like
// "homepage", "tweak-portfolio-index-background-*", and
// "collection-type-page" that trigger Squarespace's decorative homepage
// hero background shapes -- which is why a giant background circle
// showed up here. Those aren't needed for a simple provider page, so
// they've been removed.
const SQSP_BODY_CLASS =
  "header-width-full tweak-fixed-header tweak-fixed-header-style-basic header-overlay-alignment-left primary-button-style-solid primary-button-shape-pill secondary-button-style-solid secondary-button-shape-pill tertiary-button-style-solid tertiary-button-shape-pill mobile-style-available sqs-seven-one";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://static1.squarespace.com/static/versioned-site-css/6525fe2f00c9de2ec400ea4f/1158/5c5a519771c10ba3470d8101/6525fe2f00c9de2ec400ea58/1810/site.css?nocustom=true"
        />
        <link
          rel="stylesheet"
          href="https://static1.squarespace.com/static/vta/5c5a519771c10ba3470d8101/versioned-assets/1784658820989-T86EF34M4QVPBBCSSFUN/static.css"
        />
        <link
          rel="stylesheet"
          href="https://static1.squarespace.com/static/custom-css/6525fe2f00c9de2ec400ea4f/6525fe2f00c9de2ec400ea58/741/custom.css"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css"
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 300;
  font-display: swap;
  src: url('https://file.squarespace-cdn.com/content/v2/namespaces/fonts/libraries/sqsp/assets/00d1a230-e215-4217-b1cf-31145362801e/latin.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('https://file.squarespace-cdn.com/content/v2/namespaces/fonts/libraries/sqsp/assets/da0c3c0d-458f-46e2-9c64-bac004d4e8c1/latin.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url('https://file.squarespace-cdn.com/content/v2/namespaces/fonts/libraries/sqsp/assets/abb8d202-34bc-4174-a25f-c00d4154bb44/latin.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url('https://file.squarespace-cdn.com/content/v2/namespaces/fonts/libraries/sqsp/assets/95402d3d-cf4f-4ff3-b652-fa1bddbe79de/latin.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
`,
          }}
        />
      </head>
      <body className={SQSP_BODY_CLASS}>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
