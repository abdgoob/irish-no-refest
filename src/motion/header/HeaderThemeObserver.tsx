"use client";

import { useEffect } from "react";
import {
  ScrollTrigger,
  registerGsapPlugins,
  useGSAP,
} from "@/motion/core/gsap";
import { useMotionContext } from "@/motion/core/MotionContext";
import {
  parseHeaderTheme,
  type HeaderTheme,
} from "@/motion/header/types";
import { logMotionDebug } from "@/motion/core/splitTextUtils";

type HeaderThemeObserverProps = {
  onThemeChange: (theme: HeaderTheme) => void;
};

function collectSections(): HTMLElement[] {
  return [
    ...document.querySelectorAll<HTMLElement>("[data-header-theme]"),
  ].filter((el) => parseHeaderTheme(el.getAttribute("data-header-theme")));
}

function applyTheme(
  theme: HeaderTheme,
  onThemeChange: (theme: HeaderTheme) => void,
  debug: boolean,
): void {
  onThemeChange(theme);
  logMotionDebug(debug, "header theme", { theme });
}

/** Scroll-driven header palette from section `data-header-theme` metadata. */
export function HeaderThemeObserver({
  onThemeChange,
}: HeaderThemeObserverProps) {
  const { enhanced, debug, enabled } = useMotionContext();

  useEffect(() => {
    if (enhanced) return;

    const sections = collectSections();
    if (!sections.length) return;

    const initial = parseHeaderTheme(
      sections[0].getAttribute("data-header-theme"),
    );
    if (initial) applyTheme(initial, onThemeChange, debug);

    const ratios = new Map<Element, number>();
    const pickActive = () => {
      let bestEl: HTMLElement | null = null;
      let bestRatio = 0;
      for (const [el, ratio] of ratios.entries()) {
        if (!(el instanceof HTMLElement)) continue;
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestEl = el;
        }
      }
      if (bestEl) {
        const theme = parseHeaderTheme(
          bestEl.getAttribute("data-header-theme"),
        );
        if (theme) applyTheme(theme, onThemeChange, debug);
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.set(entry.target, entry.intersectionRatio);
        });
        pickActive();
      },
      {
        root: null,
        rootMargin: "-45% 0px -45% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      },
    );

    sections.forEach((section) => io.observe(section));
    return () => io.disconnect();
  }, [enhanced, onThemeChange, debug]);

  useGSAP(
    () => {
      if (!enabled || !enhanced) return;

      registerGsapPlugins();
      const sections = collectSections();
      if (!sections.length) return;

      const triggers: ScrollTrigger[] = [];

      sections.forEach((section) => {
        const theme = parseHeaderTheme(
          section.getAttribute("data-header-theme"),
        );
        if (!theme) return;

        triggers.push(
          ScrollTrigger.create({
            trigger: section,
            start: "top 50%",
            end: "bottom 50%",
            onEnter: () => applyTheme(theme, onThemeChange, debug),
            onEnterBack: () => applyTheme(theme, onThemeChange, debug),
          }),
        );
      });

      const hero = document.querySelector("#hero");
      if (hero instanceof HTMLElement) {
        triggers.push(
          ScrollTrigger.create({
            trigger: hero,
            start: "top top",
            end: "bottom top",
            onEnterBack: () => {
              const t = parseHeaderTheme(
                hero.getAttribute("data-header-theme"),
              );
              if (t) applyTheme(t, onThemeChange, debug);
            },
          }),
        );
      }

      return () => {
        triggers.forEach((st) => st.kill());
      };
    },
    { dependencies: [enabled, enhanced, onThemeChange, debug] },
  );

  return null;
}
