import { CustomEase } from "gsap/CustomEase";

/** CustomEase name → cubic-bezier control points (measured from reference site). */
export const EASE_CURVES = {
  InOut: "0.76, 0, 0.24, 1",
  Out: "0.25, 1, 0.5, 1",
  In: "0.5, 0, 0.75, 0",
  Ease: "0.25, 0.1, 0.25, 1",
  Write: "0.333, 0, 0.667, 1",
} as const;

export type MotionEaseName = keyof typeof EASE_CURVES;

let easesRegistered = false;

/** Register named eases once (client-only, after CustomEase plugin is registered). */
export function registerMotionEases(): void {
  if (easesRegistered || typeof window === "undefined") return;

  (Object.entries(EASE_CURVES) as [MotionEaseName, string][]).forEach(
    ([name, curve]) => {
      CustomEase.create(name, curve);
    },
  );

  easesRegistered = true;
}
