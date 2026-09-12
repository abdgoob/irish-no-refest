"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { motionEnv } from "@/motion/config/motionEnv";
import {
  getReducedMotionPreference,
  isEnhancedMotionAllowed,
  subscribeReducedMotion,
} from "@/motion/core/reducedMotion";
import { createLenisScroll } from "@/motion/core/lenis";
import {
  cancelScheduledScrollTriggerRefresh,
  refreshScrollTriggersAfterFonts,
  scheduleScrollTriggerRefresh,
} from "@/motion/core/refreshScrollTriggers";
import { registerGsapPlugins, ScrollTrigger } from "@/motion/core/gsap";
import { MotionContext, type MotionContextValue } from "@/motion/core/MotionContext";
import { MotionDevProbe } from "@/motion/dev/MotionDevProbe";

type MotionProviderProps = {
  children: ReactNode;
};

export function MotionProvider({ children }: MotionProviderProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [lenisReady, setLenisReady] = useState(false);

  const enabled = motionEnv.enabled;
  const enhanced = isEnhancedMotionAllowed(enabled, reducedMotion);
  const ready = !enhanced || lenisReady;

  useEffect(() => {
    return subscribeReducedMotion(setReducedMotion);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.motionEnabled = String(enabled);
    root.dataset.motionReduced = String(reducedMotion);
    root.dataset.motionEnhanced = String(enhanced);

    if (reducedMotion) {
      root.dataset.motionReducedActive = "true";
    } else {
      delete root.dataset.motionReducedActive;
    }

    return () => {
      delete root.dataset.motionEnabled;
      delete root.dataset.motionReduced;
      delete root.dataset.motionEnhanced;
      delete root.dataset.motionReducedActive;
    };
  }, [enabled, reducedMotion, enhanced]);

  useEffect(() => {
    if (!enhanced) {
      document.documentElement.classList.remove("lenis", "lenis-smooth");
      return;
    }

    registerGsapPlugins();
    document.documentElement.classList.add("lenis", "lenis-smooth");

    const { destroy } = createLenisScroll();

    void document.fonts.ready.then(() => {
      ScrollTrigger.refresh();
      setLenisReady(true);

      if (motionEnv.debug) {
        console.info("[motion] ready", {
          reduced: getReducedMotionPreference(),
          scrollTriggers: ScrollTrigger.getAll().length,
        });
      }
    });

    const onResize = () => scheduleScrollTriggerRefresh();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelScheduledScrollTriggerRefresh();
      destroy();
      document.documentElement.classList.remove("lenis", "lenis-smooth");
      setLenisReady(false);
    };
  }, [enhanced]);

  useEffect(() => {
    if (!ready || !enabled) return;
    refreshScrollTriggersAfterFonts();
  }, [ready, enabled]);

  const value = useMemo<MotionContextValue>(
    () => ({
      ready,
      enabled,
      reducedMotion,
      enhanced,
      debug: motionEnv.debug,
    }),
    [ready, enabled, reducedMotion, enhanced],
  );

  return (
    <MotionContext.Provider value={value}>
      {children}
      <MotionDevProbe />
    </MotionContext.Provider>
  );
}
