"use client";

import { useEffect } from "react";
import { runMotionMatchMedia } from "@/motion/core/matchMedia";
import type gsap from "gsap";

/**
 * Subscribe to desktop/mobile GSAP matchMedia with automatic revert on unmount
 * or breakpoint change (via gsap.matchMedia revert).
 */
export function useMotionMedia(
  setup: (context: gsap.Context) => void | (() => void),
  deps: unknown[] = [],
): void {
  useEffect(() => {
    const revert = runMotionMatchMedia(setup);
    return revert;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- caller controls setup deps
  }, deps);
}
