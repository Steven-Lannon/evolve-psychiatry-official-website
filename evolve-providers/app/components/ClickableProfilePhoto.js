"use client";

import { useState, useEffect } from "react";

export default function ClickableProfilePhoto({ photoVal, alt, initials }) {
  const [open, setOpen] = useState(false);

  // Let Escape close the lightbox too, not just clicking outside it.
  useEffect(() => {
    if (!open) return;
    function handleKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  if (!photoVal) {
    return (
      <div className="profile-photo profile-photo-initials">
        {initials || "?"}
      </div>
    );
  }

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="profile-photo profile-photo-clickable"
        src={photoVal}
        alt={alt}
        loading="lazy"
        onClick={() => setOpen(true)}
      />
      {open && (
        <div
          className="photo-lightbox"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={alt}
        >
          <button
            className="photo-lightbox-close"
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            &times;
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoVal}
            alt={alt}
            className="photo-lightbox-img"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
