/** Public motion API (foundation only — patterns added in later phases). */

export { motionEnv } from "@/motion/config/motionEnv";
export {
  DURATION,
  STAGGER_DEFAULT,
  REVEAL_DELAY_DEFAULT,
  SCRUB,
  BREAKPOINT_DESKTOP,
  motionMediaQueries,
} from "@/motion/config/tokens";
export { EASE_CURVES, registerMotionEases } from "@/motion/config/eases";

export {
  gsap,
  ScrollTrigger,
  SplitText,
  CustomEase,
  useGSAP,
  registerGsapPlugins,
} from "@/motion/core/gsap";

export { MotionRoot } from "@/motion/core/MotionRoot";
export { MotionProvider } from "@/motion/core/MotionProvider";
export { useMotionContext } from "@/motion/core/MotionContext";

export { useReducedMotion } from "@/motion/hooks/useReducedMotion";
export { useMotionReady } from "@/motion/hooks/useMotionReady";
export { useMotionMedia } from "@/motion/hooks/useMotionMedia";

export { runMotionMatchMedia } from "@/motion/core/matchMedia";
export {
  refreshScrollTriggersAfterFonts,
  scheduleScrollTriggerRefresh,
} from "@/motion/core/refreshScrollTriggers";

export { HeroScrollScene } from "@/motion/hero/HeroScrollScene";
export { heroSceneConfig, getActiveHeroLayers } from "@/data/hero-assets";
export type { HeroSceneConfig, HeroLayerConfig } from "@/motion/hero/types";

export {
  getReducedMotionPreference,
  isEnhancedMotionAllowed,
} from "@/motion/core/reducedMotion";

export { whenFontsReady, createManagedSplit } from "@/motion/core/splitTextUtils";
export * from "@/motion/patterns";
export { EditorialMotionLayer } from "@/motion/editorial/EditorialMotionLayer";
export { HeaderThemeObserver } from "@/motion/header/HeaderThemeObserver";
export type { HeaderTheme } from "@/motion/header/types";
