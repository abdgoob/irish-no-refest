"use client";

/**
 * Debug-only scroll probe (NEXT_PUBLIC_MOTION_DEBUG=true).
 * Verifies Lenis + ScrollTrigger sync without changing Phase 1 layouts.
 */
import { useRef } from "react";
import {
  useGSAP,
  gsap,
  ScrollTrigger,
  registerGsapPlugins,
} from "@/motion/core/gsap";
import { useMotionContext } from "@/motion/core/MotionContext";
import { SCRUB } from "@/motion/config/tokens";

export function MotionDevProbe() {
  const boxRef = useRef<HTMLDivElement>(null);
  const { enhanced, debug, reducedMotion } = useMotionContext();

  useGSAP(
    () => {
      if (!enhanced || !boxRef.current) return;

      registerGsapPlugins();

      gsap.fromTo(
        boxRef.current,
        { opacity: 0.35, y: 24 },
        {
          opacity: 1,
          y: 0,
          ease: "Out",
          scrollTrigger: {
            trigger: boxRef.current,
            start: "top 95%",
            end: "top 70%",
            scrub: SCRUB.HERO,
          },
        },
      );
    },
    { scope: boxRef, dependencies: [enhanced] },
  );

  if (!debug) return null;

  const stCount =
    enhanced && typeof window !== "undefined"
      ? ScrollTrigger.getAll().length
      : 0;

  return (
    <div
      className="fixed bottom-3 right-3 z-[9999] pointer-events-none flex flex-col items-end gap-2"
      aria-hidden
    >
      <div
        ref={boxRef}
        className="h-3 w-12 rounded-sm bg-[var(--sd-color-dark,#1a1a1a)] opacity-40"
      />
      <p className="rounded bg-black/75 px-2 py-1 font-mono text-[10px] text-white">
        motion debug · enhanced={String(enhanced)} · reduced=
        {String(reducedMotion)} · ST={stCount}
      </p>
    </div>
  );
}
