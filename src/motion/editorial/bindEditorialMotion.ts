"use client";

import { ScrollTrigger } from "@/motion/core/gsap";
import { logMotionDebug } from "@/motion/core/splitTextUtils";
import { bindEditorialHeadingReveal } from "@/motion/patterns/EditorialTextReveal";
import { bindParagraphReveal } from "@/motion/patterns/ParagraphReveal";
import { bindLineReveal } from "@/motion/patterns/LineReveal";
import { bindHighlightScrubText } from "@/motion/patterns/HighlightScrubText";
import { bindParallaxLayer } from "@/motion/patterns/ParallaxLayer";
import { bindThemeSeparatorReveal } from "@/motion/patterns/ThemeSeparatorReveal";

export type EditorialBindResult = {
  cleanups: Array<() => void>;
  scrollTriggerCount: number;
};

/**
 * Phase 2D scope only: Prologue, About/Concept, AboutTransition separator.
 */
export async function bindEditorialMotion(
  root: ParentNode,
  debug: boolean,
): Promise<EditorialBindResult> {
  const cleanups: Array<() => void> = [];
  const before = ScrollTrigger.getAll().length;

  const prolog = root.querySelector("#prolog");
  if (prolog) {
    const label = prolog.querySelector<HTMLElement>('[data-reveal="line"]');
    if (label) cleanups.push(bindLineReveal(label));

    const quote = prolog.querySelector<HTMLElement>(
      '[data-highlight-scrub="true"]',
    );
    if (quote) {
      cleanups.push(await bindHighlightScrubText(quote));
      logMotionDebug(debug, "highlight scrub bound", { id: "prolog" });
    }
  }

  const about = root.querySelector("#about");
  if (about) {
    const headings = about.querySelectorAll<HTMLElement>(
      '[data-reveal="heading"]',
    );
    for (const heading of headings) {
      cleanups.push(await bindEditorialHeadingReveal(heading));
    }

    const paragraphs = about.querySelectorAll<HTMLElement>(
      '[data-reveal="paragraph"]',
    );
    for (const paragraph of paragraphs) {
      cleanups.push(await bindParagraphReveal(paragraph));
    }

    const image = about.querySelector<HTMLElement>('[data-parallax="image"]');
    if (image) {
      cleanups.push(
        bindParallaxLayer(image, {
          preset: "image",
          trigger: about,
        }),
      );
    }

    const container = about.querySelector<HTMLElement>(
      '[data-parallax="container-up"]',
    );
    if (container) {
      cleanups.push(
        bindParallaxLayer(container, {
          preset: "container-up",
          trigger: about,
        }),
      );
    }

    const brand = about.querySelector<HTMLElement>(".sd-about__brand");
    if (brand) {
      cleanups.push(
        bindParallaxLayer(brand, {
          preset: "heading-drift",
          trigger: about.querySelector(".sd-about__title-row") ?? about,
        }),
      );
    }
  }

  const separator = root.querySelector<HTMLElement>(
    '[data-theme-separator="true"]',
  );
  if (separator) {
    cleanups.push(bindThemeSeparatorReveal(separator));
  }

  const after = ScrollTrigger.getAll().length;
  logMotionDebug(debug, "editorial bound", {
    addedScrollTriggers: after - before,
    totalScrollTriggers: after,
  });

  return {
    cleanups,
    scrollTriggerCount: after,
  };
}
