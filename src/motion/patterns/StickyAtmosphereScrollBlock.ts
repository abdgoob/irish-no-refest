"use client";

import { gsap } from "@/motion/core/gsap";
import { motionMediaQueries, SCRUB } from "@/motion/config/tokens";
import { scheduleScrollTriggerRefresh } from "@/motion/core/refreshScrollTriggers";
import { logMotionDebug } from "@/motion/core/splitTextUtils";

export type StickyAtmosphereScrollBlockConfig = {
  wrapper: HTMLElement;
  stage: HTMLElement;
  atmosphere: HTMLElement;
  content?: HTMLElement;
  /** Extra scroll distance as multiple of stage height (reference ~0.45). */
  runwayRatio?: number;
  debug?: boolean;
};

export function bindStickyAtmosphereScrollBlock(
  config: StickyAtmosphereScrollBlockConfig,
): () => void {
  const {
    wrapper,
    stage,
    atmosphere,
    content,
    runwayRatio = 0.45,
    debug = false,
  } = config;

  const vh = stage.clientHeight || window.innerHeight;
  wrapper.style.height = `${Math.round(vh * (1 + runwayRatio))}px`;

  logMotionDebug(debug, "atmosphere block measure", {
    runwayPx: wrapper.offsetHeight,
    runwayRatio,
  });

  if (content) {
    gsap.set(content, { opacity: 0.35, yPercent: 6 });
  }

  const tween = gsap.to(
    { p: 0 },
    {
      p: 1,
      ease: "none",
      scrollTrigger: {
        trigger: wrapper,
        start: "top top",
        end: "bottom bottom",
        scrub: SCRUB.STANDARD,
        invalidateOnRefresh: true,
        onRefresh: () => {
          const v = stage.clientHeight || window.innerHeight;
          wrapper.style.height = `${Math.round(v * (1 + runwayRatio))}px`;
        },
      },
      onUpdate() {
        const t = (this.targets()[0] as { p: number }).p;
        gsap.set(atmosphere, {
          yPercent: t * 14,
          scale: 1 + t * 0.07,
          transformOrigin: "center center",
        });
        if (content) {
          gsap.set(content, {
            opacity: 0.35 + t * 0.65,
            yPercent: 6 - t * 6,
          });
        }
      },
    },
  );

  const onResize = () => scheduleScrollTriggerRefresh();
  window.addEventListener("resize", onResize);
  wrapper.dataset.atmosphereBlockReady = "true";

  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
    window.removeEventListener("resize", onResize);
    wrapper.style.height = "";
    delete wrapper.dataset.atmosphereBlockReady;
    gsap.set(atmosphere, { clearProps: "transform" });
    if (content) gsap.set(content, { clearProps: "opacity,transform" });
  };
}

export function bindStickyAtmosphereScrollBlockMatchMedia(
  config: StickyAtmosphereScrollBlockConfig,
): () => void {
  const mm = gsap.matchMedia();
  mm.add(motionMediaQueries.desktop, () => {
    config.wrapper.dataset.ctaMode = "desktop-runway";
    const cleanup = bindStickyAtmosphereScrollBlock(config);
    return () => {
      cleanup();
      config.wrapper.dataset.ctaMode = "static";
    };
  });
  return () => mm.revert();
}
