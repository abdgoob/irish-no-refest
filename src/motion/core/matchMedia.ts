"use client";

import type gsap from "gsap";
import { gsap as gsapInstance, registerGsapPlugins } from "@/motion/core/gsap";
import { motionMediaQueries } from "@/motion/config/tokens";

export type MotionMediaConditions = {
  isDesktop: boolean;
  isMobile: boolean;
};

/**
 * Register desktop/mobile GSAP matchMedia with automatic revert on cleanup.
 * Pass the callback GSAP invokes when each query matches.
 */
export function runMotionMatchMedia(
  setup: (context: gsap.Context) => void | (() => void),
): () => void {
  registerGsapPlugins();

  const mm = gsapInstance.matchMedia();

  mm.add(
    {
      isDesktop: motionMediaQueries.desktop,
      isMobile: motionMediaQueries.mobile,
    },
    (context) => {
      const cleanup = setup(context);
      return () => {
        if (typeof cleanup === "function") cleanup();
      };
    },
  );

  return () => mm.revert();
}
