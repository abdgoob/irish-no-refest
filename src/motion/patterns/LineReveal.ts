"use client";

import { gsap } from "@/motion/core/gsap";
import { DURATION } from "@/motion/config/tokens";
import type { LineRevealOptions } from "@/motion/patterns/types";

/** Divider / rule reveal via clip-path (no width animation). */
export function bindLineReveal(
  element: HTMLElement,
  options: LineRevealOptions = {},
): () => void {
  const trigger = options.trigger ?? element;
  const start = options.start ?? "top 90%";
  const duration = options.duration ?? DURATION.MEDIUM;
  const ease = options.ease ?? "Out";
  const once = options.once ?? true;

  gsap.set(element, {
    clipPath: "inset(0 100% 0 0)",
    WebkitClipPath: "inset(0 100% 0 0)",
  });

  const tween = gsap.to(element, {
    clipPath: "inset(0 0% 0 0)",
    WebkitClipPath: "inset(0 0% 0 0)",
    duration,
    ease,
    scrollTrigger: {
      trigger,
      start,
      once,
    },
  });

  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
    gsap.set(element, { clearProps: "clipPath,webkitClipPath" });
  };
}
