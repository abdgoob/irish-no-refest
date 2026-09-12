"use client";

import { gsap } from "@/motion/core/gsap";
import { DURATION } from "@/motion/config/tokens";
import { createManagedSplit } from "@/motion/core/splitTextUtils";
import type { RevealOnceOptions } from "@/motion/patterns/types";

/** Calmer body copy reveal — words only, opt-in via `[data-reveal="paragraph"]`. */
export async function bindParagraphReveal(
  element: HTMLElement,
  options: RevealOnceOptions = {},
): Promise<() => void> {
  const trigger = options.trigger ?? element;
  const start = options.start ?? "top 85%";
  const duration = options.duration ?? DURATION.MEDIUM;
  const ease = options.ease ?? "Out";
  const stagger = options.stagger ?? 0.018;

  const { split, revert } = await createManagedSplit(element, {
    type: "words",
    autoSplit: true,
  });

  const words = split.words as HTMLElement[];

  gsap.set(words, { opacity: 0, yPercent: 12 });

  const tween = gsap.to(words, {
    opacity: 1,
    yPercent: 0,
    duration,
    ease,
    stagger,
    scrollTrigger: {
      trigger,
      start,
      once: true,
      markers: options.markers,
    },
  });

  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
    revert();
  };
}
