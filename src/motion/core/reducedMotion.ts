const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function getReducedMotionPreference(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

export function subscribeReducedMotion(onChange: (reduced: boolean) => void): () => void {
  if (typeof window === "undefined") return () => {};

  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  const handler = () => onChange(mq.matches);

  handler();
  mq.addEventListener("change", handler);
  return () => mq.removeEventListener("change", handler);
}

/** Enhanced motion allowed: kill switch on and user has not requested reduced motion. */
export function isEnhancedMotionAllowed(
  enabled: boolean,
  reducedMotion: boolean,
): boolean {
  return enabled && !reducedMotion;
}
