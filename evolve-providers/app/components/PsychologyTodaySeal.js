"use client";

// Loads the Psychology Today verified-seal script right next to the
// <a class="sx-verified-seal"> placeholder in the footer, the same way
// Psychology Today's embed code does on Squarespace.
//
// Why not next/script: next/script injects the tag at the end of <body>,
// well after the page has loaded. Psychology Today's script expects to sit
// beside its placeholder and to run as the page loads, so it can miss its
// chance and leave the placeholder empty. Injecting a fresh copy on mount
// works on first load and after client-side navigation.

import { useEffect } from "react";

const SCRIPT_SRC = "https://member.psychologytoday.com/verified-seal.js";

export default function PsychologyTodaySeal() {
  useEffect(() => {
    const placeholder = document.querySelector(
      "#footer-sections .sx-verified-seal"
    );
    if (!placeholder) return;

    // Already rendered (e.g. React re-ran the effect) -- nothing to do.
    if (placeholder.childElementCount > 0) return;

    // Remove any previous copy so the browser runs the script again.
    document
      .querySelectorAll('script[data-pt-seal="true"]')
      .forEach((el) => el.remove());

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = SCRIPT_SRC;
    script.async = false;
    script.dataset.ptSeal = "true";
    script.dataset.badge = "13";
    script.dataset.id = "128152";
    script.dataset.code =
      "aHR0cHM6Ly93d3cucHN5Y2hvbG9neXRvZGF5LmNvbS9hcGkvdmVyaWZpZWQtc2VhbC9zZWFscy8xMy9wcm9maWxlLzEyODE1Mj9jYWxsYmFjaz1zeGNhbGxiYWNr";

    // Same position as Psychology Today's embed: immediately after the link.
    placeholder.insertAdjacentElement("afterend", script);
  }, []);

  return null;
}
