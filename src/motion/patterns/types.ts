import type { MotionEaseName } from "@/motion/config/eases";

export type ScrollTriggerBounds = {
  start?: string;
  end?: string;
};

export type RevealOnceOptions = {
  trigger?: Element;
  start?: string;
  duration?: number;
  ease?: MotionEaseName;
  stagger?: number;
  markers?: boolean;
};

export type HighlightScrubOptions = {
  trigger?: Element;
  start?: string;
  end?: string;
  scrub?: number | boolean;
  stagger?: number;
  ease?: MotionEaseName;
  minOpacity?: number;
  autoSplit?: boolean;
};

export type ParallaxOptions = {
  trigger?: Element;
  axis?: "x" | "y";
  from?: number;
  to?: number;
  scrub?: number | boolean;
  desktopOnly?: boolean;
  mobileFrom?: number;
  mobileTo?: number;
};

export type LineRevealOptions = {
  trigger?: Element;
  start?: string;
  duration?: number;
  ease?: MotionEaseName;
  once?: boolean;
};
