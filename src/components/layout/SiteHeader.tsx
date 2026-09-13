"use client";

import { ButtonPill } from "@/components/ui/ButtonPill";
import { SvgWordmark } from "@/components/ui/SvgWordmark";
import { actionHref, nav, restaurant } from "@/data/restaurant/home";
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
            {nav.menuLabel}
          </button>
        </div>
        <a href="#hero" className="sd-header__logo" aria-label={restaurant.name}>
          <SvgWordmark className="sd-header__logo" />
        </a>
        <div className="sd-header__side sd-header__side--right">
          <a
            href={actionHref("order")}
            className="p5"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            {nav.orderHeaderLabel}
          </a>
          <ButtonPill onClick={onConsultationOpen}>{nav.reserveLabel}</ButtonPill>
        </div>
      </div>
    </header>
  );
}
