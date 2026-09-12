/**
 * Public motion flags (build-time).
 * NEXT_PUBLIC_ENABLE_MOTION=false → static site, no Lenis/GSAP runtime effects.
 * NEXT_PUBLIC_MOTION_DEBUG=true → dev diagnostics only.
 */

function readBool(name: string, defaultValue: boolean): boolean {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return defaultValue;
  return raw === "true" || raw === "1";
}

export const motionEnv = {
  /** Master kill switch; default enabled. Set to false to disable enhanced motion. */
  enabled: readBool("NEXT_PUBLIC_ENABLE_MOTION", true),
  debug: readBool("NEXT_PUBLIC_MOTION_DEBUG", false),
} as const;
