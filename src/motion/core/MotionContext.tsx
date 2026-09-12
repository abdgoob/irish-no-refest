"use client";

import { createContext, useContext } from "react";

export type MotionContextValue = {
  /** Fonts + infrastructure ready for future sequences. */
  ready: boolean;
  /** Kill switch (NEXT_PUBLIC_ENABLE_MOTION). */
  enabled: boolean;
  /** prefers-reduced-motion: reduce */
  reducedMotion: boolean;
  /** Enhanced motion (Lenis + GSAP) is active. */
  enhanced: boolean;
  debug: boolean;
};

const defaultValue: MotionContextValue = {
  ready: false,
  enabled: true,
  reducedMotion: false,
  enhanced: false,
  debug: false,
};

export const MotionContext = createContext<MotionContextValue>(defaultValue);

export function useMotionContext(): MotionContextValue {
  return useContext(MotionContext);
}
