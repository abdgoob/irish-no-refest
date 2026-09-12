"use client";

import { gsap } from "@/motion/core/gsap";
import { DURATION } from "@/motion/config/tokens";
import {
  createManagedSplit,
  editorialHeadingYOffset,
} from "@/motion/core/splitTextUtils";
import type { RevealOnceOptions } from "@/motion/patterns/types";

/**
 * Son Daven–style editorial heading reveal (words).
 * One-shot; static content stays visible if motion never runs.
 */
export async function bindEditorialHeadingReveal(
  element: HTMLElement,
  options: RevealOnceOptions = {},
): Promise<() => void> {
  const trigger = options.trigger ?? element;
  const start = options.start ?? "top bottom";
  const duration = options.duration ?? DURATION.SLOW;
  const ease = options.ease ?? "Out";
  const stagger = options.stagger ?? 0.025;

  const { split, revert } = await createManagedSplit(element, {
    type: "words",
    autoSplit: true,
  });

  const words = split.words as HTMLElement[];
  element.classList.add("sd-editorial-split-parent");

  words.forEach((word, index) => {
    gsap.set(word, {
      yPercent: editorialHeadingYOffset(index),
      scale: 0,
      opacity: 0,
      transformOrigin: "50% 50%",
    });
  });

  const tween = gsap.to(words, {
    yPercent: 0,
    scale: 1,
    opacity: 1,
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
    element.classList.remove("sd-editorial-split-parent");
    revert();
  };
}
