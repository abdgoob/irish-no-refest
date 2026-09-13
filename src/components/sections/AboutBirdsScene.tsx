"use client";

import { useEffect, useRef } from "react";
import { BREAKPOINT_DESKTOP } from "@/motion/config/tokens";
import { mountSonDavenAboutBirdScene } from "@/motion/scenes/sonDavenBirdScenes";

export function AboutBirdsScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = canvas?.closest("#about");
    if (!canvas || !section) return;

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
      if (teardown) return;
      const { width, height } = section.getBoundingClientRect();
      if (width < 16 || height < 16) return;
      const mounted = mountSonDavenAboutBirdScene(canvas);
      if (mounted) teardown = mounted;
    };

    const resizeObserver = new ResizeObserver(() => sync());
    resizeObserver.observe(section);
    desktopMq.addEventListener("change", sync);
    sync();
    requestAnimationFrame(() => sync());

    return () => {
      resizeObserver.disconnect();
      desktopMq.removeEventListener("change", sync);
      teardown?.();
    };
  }, []);

  return (
    <div className="sd-about__scene sd-only-desk" aria-hidden>
      <canvas
        ref={canvasRef}
        className="sd-about__scene-canvas scene"
        data-about-scene=""
      />
    </div>
  );
}
