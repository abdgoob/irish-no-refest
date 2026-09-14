"use client";

import { ButtonPill } from "@/components/ui/ButtonPill";
import styles from "./SiteHeader.module.css";
import { actionHref, nav } from "@/data/restaurant/home";
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
    <header className={`sd-header ${headerThemeClass(theme)} ${styles.header}`}>
      <div className={styles.inner}>
        <nav className={styles.navigation} aria-label="Main navigation">
          <button
            type="button"
            className={styles.menu}
            onClick={onMenuOpen}
            style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }}
          >
            <span className={styles.hamburger} aria-hidden="true" />
            {nav.menuLabel}
          </button>
          <a href={actionHref("menu")}>FOOD</a>
          <a href="#benefits">DRINKS</a>
          <a href="#contact">VISIT</a>
        </nav>
        <a href="#hero" className={styles.brand} aria-label="Norefest home">NOREFEST</a>
        <div className={styles.actions}>
          <span lang="en" aria-label="Language: English">EN</span>
          <ButtonPill onClick={onConsultationOpen}>{nav.reserveLabel}</ButtonPill>
        </div>
      </div>
    </header>
  );
}
