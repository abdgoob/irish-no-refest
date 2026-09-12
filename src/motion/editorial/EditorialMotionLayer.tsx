"use client";

import { useRef } from "react";
import {
  registerGsapPlugins,
  useGSAP,
} from "@/motion/core/gsap";
import { useMotionContext } from "@/motion/core/MotionContext";
import { bindEditorialMotion } from "@/motion/editorial/bindEditorialMotion";
import { whenFontsReady } from "@/motion/core/splitTextUtils";

/** Wires Phase 2D editorial patterns (Prologue + About only). */
export function EditorialMotionLayer() {
  const scopeRef = useRef<HTMLDivElement>(null);
  const { enhanced, ready, debug } = useMotionContext();

  useGSAP(
    () => {
      if (!enhanced || !ready) return;

      registerGsapPlugins();
      let disposed = false;
      const cleanups: Array<() => void> = [];

      void (async () => {
        await whenFontsReady();
        if (disposed) return;

        const root = scopeRef.current?.closest("main") ?? document;
        const result = await bindEditorialMotion(root, debug);
        if (disposed) {
          result.cleanups.forEach((fn) => fn());
          return;
        }
        cleanups.push(...result.cleanups);
        document.documentElement.dataset.motionEditorialReady = "true";

        if (debug) {
          console.info("[motion] editorial ready", {
            scrollTriggers: result.scrollTriggerCount,
          });
        }
      })();

      return () => {
        disposed = true;
        cleanups.forEach((fn) => fn());
        delete document.documentElement.dataset.motionEditorialReady;
      };
    },
    { scope: scopeRef, dependencies: [enhanced, ready, debug] },
  );

  return (
    <div
      ref={scopeRef}
      className="sd-editorial-motion-layer"
      aria-hidden
      hidden
    />
  );
}
