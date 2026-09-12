"use client";

import { gsap } from "@/motion/core/gsap";
import { motionMediaQueries, SCRUB } from "@/motion/config/tokens";
import type { ParallaxOptions } from "@/motion/patterns/types";

export type ParallaxPreset = "image" | "container-up" | "heading-drift";

const PRESETS: Record<
  ParallaxPreset,
  { from: number; to: number; mobileFrom: number; mobileTo: number; axis: "x" | "y" }
> = {
  image: {
    from: -20,
    to: 20,
    mobileFrom: -6,
    mobileTo: 6,
    axis: "y",
  },
  "container-up": {
    from: 10,
    to: -10,
    mobileFrom: 4,
    mobileTo: -4,
    axis: "y",
  },
  "heading-drift": {
    from: -3,
    to: 3,
    mobileFrom: 0,
    mobileTo: 0,
    axis: "x",
  },
};

/** Transform-only parallax with desktop/mobile reduction via matchMedia. */
export function bindParallaxLayer(
  element: HTMLElement,
  options: ParallaxOptions & { preset?: ParallaxPreset } = {},
): () => void {
  const trigger = options.trigger ?? element;
  const preset = options.preset ? PRESETS[options.preset] : null;
  const axis = options.axis ?? preset?.axis ?? "y";
  const prop = axis === "x" ? "xPercent" : "yPercent";
  const scrub = options.scrub ?? SCRUB.STANDARD;

  const desktopFrom = options.from ?? preset?.from ?? -10;
  const desktopTo = options.to ?? preset?.to ?? 10;
  const mobileFrom = options.mobileFrom ?? preset?.mobileFrom ?? desktopFrom * 0.35;
  const mobileTo = options.mobileTo ?? preset?.mobileTo ?? desktopTo * 0.35;

  const mm = gsap.matchMedia();

  mm.add(motionMediaQueries.desktop, () => {
    if (options.desktopOnly === false) return;
    gsap.fromTo(
      element,
      { [prop]: desktopFrom },
      {
        [prop]: desktopTo,
        ease: "none",
        scrollTrigger: { trigger, scrub },
      },
    );
  });

  mm.add(motionMediaQueries.mobile, () => {
    if (mobileFrom === 0 && mobileTo === 0) return;
    gsap.fromTo(
      element,
      { [prop]: mobileFrom },
      {
        [prop]: mobileTo,
        ease: "none",
        scrollTrigger: { trigger, scrub },
      },
    );
  });

  return () => {
    mm.revert();
  };
}
