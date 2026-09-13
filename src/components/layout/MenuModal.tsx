"use client";

import { nav } from "@/data/restaurant/home";

export function MenuModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="sd-modal theme-dark" role="dialog" aria-modal="true" aria-label="Menu">
      <div className="sd-modal__inner">
        <button
          type="button"
          onClick={onClose}
          className="p5"
          style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", marginBottom: "2rem" }}
        >
          Close
        </button>
        <nav style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {nav.links.map((l) => (
            <a key={l.href + l.label} href={l.href} className="h5" onClick={onClose} style={{ color: "inherit", textDecoration: "none" }}>
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
