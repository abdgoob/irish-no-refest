"use client";

import { gsap } from "@/motion/core/gsap";
import { DURATION } from "@/motion/config/tokens";

/** Subtle motion for static SVG theme separators (SSR image unchanged). */
export function bindThemeSeparatorReveal(root: HTMLElement): () => void {
  const target =
    root.querySelector("img") ??
    root.querySelector("[data-theme-separator-target]");

  if (!target || !(target instanceof HTMLElement)) {
    return () => {};
  }

  gsap.set(target, {
    clipPath: "inset(0 0 100% 0)",
    WebkitClipPath: "inset(0 0 100% 0)",
    scale: 1.02,
    transformOrigin: "50% 0%",
  });

  const tween = gsap.to(target, {
    clipPath: "inset(0 0 0% 0)",
    WebkitClipPath: "inset(0 0 0% 0)",
    scale: 1,
    duration: DURATION.SLOW,
    ease: "InOut",
    scrollTrigger: {
      trigger: root,
      start: "top 95%",
      end: "top 70%",
      scrub: 0.5,
    },
  });

  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
    gsap.set(target, { clearProps: "clipPath,webkitClipPath,scale,transform" });
  };
}
