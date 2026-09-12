"use client";

import { gsap, ScrollTrigger } from "@/motion/core/gsap";
import { motionMediaQueries, SCRUB } from "@/motion/config/tokens";
import { logMotionDebug } from "@/motion/core/splitTextUtils";

export type FooterParallaxSceneConfig = {
  scene: HTMLElement;
  atmosphere: HTMLElement;
  content?: HTMLElement;
  debug?: boolean;
};

/** Scroll-linked footer atmosphere drift (reference footer canvas parallax feel). */
export function bindFooterParallaxScene(
  config: FooterParallaxSceneConfig,
): () => void {
  const { scene, atmosphere, content, debug = false } = config;

  const tween = gsap.to(
    { p: 0 },
    {
      p: 1,
      ease: "none",
      scrollTrigger: {
        trigger: scene,
        start: "top bottom",
        end: "bottom top",
        scrub: SCRUB.STANDARD,
      },
      onUpdate() {
        const t = (this.targets()[0] as { p: number }).p;
        gsap.set(atmosphere, {
          yPercent: -8 + t * 16,
          scale: 1.05 + t * 0.04,
          transformOrigin: "center bottom",
        });
        if (content) {
          gsap.set(content, { yPercent: (t - 0.5) * 4 });
        }
      },
    },
  );

  logMotionDebug(debug, "footer parallax active", {
    scrollTriggers: ScrollTrigger.getAll().length,
  });

  scene.dataset.footerSceneReady = "true";

  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
    delete scene.dataset.footerSceneReady;
    gsap.set(atmosphere, { clearProps: "transform" });
    if (content) gsap.set(content, { clearProps: "transform" });
  };
}

export function bindFooterParallaxSceneMatchMedia(
  config: FooterParallaxSceneConfig,
): () => void {
  const mm = gsap.matchMedia();
  mm.add(motionMediaQueries.desktop, () => bindFooterParallaxScene(config));
  return () => mm.revert();
}
