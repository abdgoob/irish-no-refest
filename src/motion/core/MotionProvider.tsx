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
import { motionMediaQueries } from "@/motion/config/tokens";
import { registerGsapPlugins, ScrollTrigger } from "@/motion/core/gsap";
import { MotionContext, type MotionContextValue } from "@/motion/core/MotionContext";
import { MotionDevProbe } from "@/motion/dev/MotionDevProbe";
import type { LenisScrollHandle } from "@/motion/core/lenis";

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
      delete document.documentElement.dataset.lenisActive;
      return;
    }

    registerGsapPlugins();

    let lenisHandle: LenisScrollHandle | null = null;
    const desktopMq = window.matchMedia(motionMediaQueries.desktop);

    const syncLenis = () => {
      const useLenis = desktopMq.matches;
      document.documentElement.dataset.lenisActive = String(useLenis);

      if (useLenis && !lenisHandle) {
        document.documentElement.classList.add("lenis", "lenis-smooth");
        lenisHandle = createLenisScroll();
      } else if (!useLenis && lenisHandle) {
        lenisHandle.destroy();
        lenisHandle = null;
        document.documentElement.classList.remove("lenis", "lenis-smooth");
        ScrollTrigger.update();
      }
    };

    syncLenis();
    desktopMq.addEventListener("change", syncLenis);

    void document.fonts.ready.then(() => {
      ScrollTrigger.refresh();
      setLenisReady(true);

      if (process.env.NODE_ENV === "development") {
        (
          window as Window & {
            __motionAudit?: {
              scrollTriggerCount: () => number;
              snapshot: () => Record<string, string | number | boolean>;
            };
          }
        ).__motionAudit = {
          scrollTriggerCount: () => ScrollTrigger.getAll().length,
          snapshot: () => ({
            st: ScrollTrigger.getAll().length,
            lenisActive: document.documentElement.dataset.lenisActive === "true",
            motionEnhanced: document.documentElement.dataset.motionEnhanced === "true",
            motionReduced: document.documentElement.dataset.motionReduced === "true",
            innerWidth: window.innerWidth,
          }),
        };
      }

      if (motionEnv.debug) {
        console.info("[motion] ready", {
          reduced: getReducedMotionPreference(),
          lenis: document.documentElement.dataset.lenisActive === "true",
          scrollTriggers: ScrollTrigger.getAll().length,
        });
      }
    });

    const onResize = () => scheduleScrollTriggerRefresh();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      desktopMq.removeEventListener("change", syncLenis);
      cancelScheduledScrollTriggerRefresh();
      lenisHandle?.destroy();
      lenisHandle = null;
      document.documentElement.classList.remove("lenis", "lenis-smooth");
      delete document.documentElement.dataset.lenisActive;
      delete (
        window as Window & { __motionAudit?: unknown }
      ).__motionAudit;
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
