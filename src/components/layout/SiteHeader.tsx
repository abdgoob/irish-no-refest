"use client";

import Link from "next/link";
import { ButtonPill } from "@/components/ui/ButtonPill";
import { SvgWordmark } from "@/components/ui/SvgWordmark";
import type { HeaderTheme } from "@/motion/header/types";

function headerThemeClass(theme: HeaderTheme): string {
  if (theme === "inverted") return "theme-inverted";
  if (theme === "light") return "theme-light";
  return "theme-dark";
}

export function SiteHeader({
  theme = "dark",
  onMenuOpen,
  onConsultationOpen,
}: {
  theme?: HeaderTheme;
  onMenuOpen: () => void;
  onConsultationOpen: () => void;
}) {
  return (
    <header className={`sd-header ${headerThemeClass(theme)}`}>
      <div className="sd-header__inner">
        <div className="sd-header__side">
          <button
            type="button"
            className="p5"
            onClick={onMenuOpen}
            style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }}
          >
            Menu
          </button>
        </div>
        <a href="#hero" className="sd-header__logo" aria-label="Son Daven logo">
          <SvgWordmark className="sd-header__logo" />
        </a>
        <div className="sd-header__side sd-header__side--right">
          <Link href="/" className="p5" style={{ color: "inherit", textDecoration: "none" }}>
            UA
          </Link>
          <ButtonPill onClick={onConsultationOpen}>Consultation</ButtonPill>
        </div>
      </div>
    </header>
  );
}
