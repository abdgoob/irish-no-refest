/** Son Daven–aligned motion tokens (Phase 2A forensics). */

export const DURATION = {
  FAST: 0.4,
  MEDIUM: 0.8,
  SLOW: 1.2,
} as const;

export const STAGGER_DEFAULT = 0.1;

export const REVEAL_DELAY_DEFAULT = 0.2;

/** Scrub smoothing: lower = snappier follow (hero scroll-video). */
export const SCRUB = {
  HERO: 0.25,
  STANDARD: 1 as const,
} as const;

export const BREAKPOINT_DESKTOP = 992;

export const motionMediaQueries = {
  desktop: `(min-width: ${BREAKPOINT_DESKTOP}px)`,
  mobile: `(max-width: ${BREAKPOINT_DESKTOP - 1}px)`,
} as const;
