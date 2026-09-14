"use client";

import { useEffect, useRef } from "react";
import { useMotionContext } from "@/motion/core/MotionContext";
import { BREAKPOINT_DESKTOP } from "@/motion/config/tokens";
import { mountSonDavenAboutBirdScene } from "@/motion/scenes/sonDavenBirdScenes";

export function AboutBirdsScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { enhanced, ready } = useMotionContext();

  useEffect(() => {
    if (!enhanced || !ready) return;
    const canvas = canvasRef.current;
    const intro = canvas?.closest(".sd-about__intro");
    if (!canvas || !intro) return;

    const desktopMq = window.matchMedia(
      `(min-width: ${BREAKPOINT_DESKTOP}px)`,
    );
    let teardown: (() => void) | undefined;

    const sync = () => {
      if (!desktopMq.matches) {
        teardown?.();
        teardown = undefined;
        return;
      }
      const { width, height } = intro.getBoundingClientRect();
      if (width < 16 || height < 16) return;
      if (teardown) return;
      const mounted = mountSonDavenAboutBirdScene(canvas);
      if (mounted) teardown = mounted;
    };

    const resizeObserver = new ResizeObserver(() => sync());
    resizeObserver.observe(intro);
    desktopMq.addEventListener("change", sync);
    sync();
    const frame = requestAnimationFrame(sync);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      desktopMq.removeEventListener("change", sync);
      teardown?.();
    };
  }, [enhanced, ready]);

  return (
    <div className="sd-about__intro sd-only-desk" aria-hidden="true">
      <div className="sd-about__scene">
        <canvas
          ref={canvasRef}
          className="sd-about__scene-canvas scene"
          data-about-scene=""
        />
      </div>
    </div>
  );
}
