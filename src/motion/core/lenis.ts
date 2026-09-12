"use client";

import Lenis from "lenis";
import { gsap, ScrollTrigger, registerGsapPlugins } from "@/motion/core/gsap";
import { DURATION } from "@/motion/config/tokens";

/** Reference site exponential-out easing for Lenis duration mode. */
export const lenisDefaultEasing = (t: number) =>
  Math.min(1, 1.001 - Math.pow(2, -10 * t));

export type LenisScrollHandle = {
  lenis: Lenis;
  destroy: () => void;
};

export function createLenisScroll(): LenisScrollHandle {
  registerGsapPlugins();

  const lenis = new Lenis({
    wrapper: window,
    duration: DURATION.SLOW,
    smoothWheel: true,
    touchMultiplier: 2,
        infinite: false,
    easing: lenisDefaultEasing,
    anchors: true,
  });

  lenis.on("scroll", ScrollTrigger.update);

  const onTick = (time: number) => {
    lenis.raf(time * 1000);
  };

  gsap.ticker.add(onTick);
  gsap.ticker.lagSmoothing(0);

  return {
    lenis,
    destroy: () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
    },
  };
}
