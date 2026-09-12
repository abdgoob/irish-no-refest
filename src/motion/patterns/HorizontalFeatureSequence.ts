"use client";

import { gsap, ScrollTrigger } from "@/motion/core/gsap";
import { motionMediaQueries } from "@/motion/config/tokens";
import { SCRUB } from "@/motion/config/tokens";
import {
  getHorizontalFeatureCardMotion,
  type HorizontalFeatureCardMotion,
} from "@/motion/patterns/horizontalFeatureChoreography";
import { logMotionDebug } from "@/motion/core/splitTextUtils";

export type HorizontalFeatureSequenceConfig = {
  wrapper: HTMLElement;
  stage: HTMLElement;
  track: HTMLElement;
  items: HTMLElement[];
  /** Extra scroll px per px of horizontal travel (reference ~1.85). */
  scrollPacing?: number;
  /** Viewport widths of lead-in before first card centers. */
  leadInRatio?: number;
  /** Viewport widths of trail after last card exits. */
  trailOutRatio?: number;
  cardMotion?: (index: number) => Partial<HorizontalFeatureCardMotion>;
  cardTriggerStart?: string;
  cardTriggerEnd?: string;
  debug?: boolean;
};

function measureHorizontalTravel(
  stage: HTMLElement,
  track: HTMLElement,
  leadInRatio: number,
  trailOutRatio: number,
): {
  xStartPx: number;
  xEndPx: number;
  travelPx: number;
  trackWidth: number;
  viewWidth: number;
} {
  const viewWidth = stage.clientWidth;
  const trackWidth = track.scrollWidth;
  const xStartPx = viewWidth * leadInRatio;
  const xEndPx = -(
    Math.max(0, trackWidth - viewWidth) +
    viewWidth * trailOutRatio
  );
  const travelPx = xStartPx - xEndPx;
  return {
    xStartPx,
    xEndPx,
    travelPx,
    trackWidth,
    viewWidth,
  };
}

/**
 * Scroll-driven horizontal feature track + per-card containerAnimation arcs.
 * Desktop only — caller must guard with matchMedia / enhanced motion.
 */
export function bindHorizontalFeatureSequence(
  config: HorizontalFeatureSequenceConfig,
): () => void {
  const {
    wrapper,
    stage,
    track,
    items,
    scrollPacing = 1.85,
    leadInRatio = 0.22,
    trailOutRatio = 0.12,
    cardMotion,
    cardTriggerStart = "left 120%",
    cardTriggerEnd = "right -20%",
    debug = false,
  } = config;

  const cleanups: Array<() => void> = [];

  const applyRunway = () => {
    const { xStartPx, xEndPx, travelPx, trackWidth, viewWidth } =
      measureHorizontalTravel(stage, track, leadInRatio, trailOutRatio);
    const scrollDistance = travelPx * scrollPacing;
    const vh = stage.clientHeight || window.innerHeight;
    wrapper.style.height = `${Math.round(vh + scrollDistance)}px`;

    logMotionDebug(debug, "horizontal feature measure", {
      runwayPx: wrapper.offsetHeight,
      trackWidth,
      viewWidth,
      xStartPx,
      xEndPx,
      travelPx,
      scrollPacing,
      items: items.length,
    });

    return { xStartPx, xEndPx };
  };

  applyRunway();

  const scrollTween = gsap.fromTo(
    track,
    { x: () => applyRunway().xStartPx },
    {
      x: () => applyRunway().xEndPx,
      ease: "none",
      scrollTrigger: {
        trigger: wrapper,
        start: "top top",
        end: "bottom bottom",
        scrub: SCRUB.STANDARD,
        invalidateOnRefresh: true,
      },
    },
  );

  cleanups.push(() => {
    scrollTween.scrollTrigger?.kill();
    scrollTween.kill();
  });

  items.forEach((item, index) => {
    const motion = getHorizontalFeatureCardMotion(index, cardMotion?.(index));

    const cardTween = gsap.fromTo(
      item,
      {
        yPercent: motion.yFrom,
        rotation: motion.rotateFrom,
        transformOrigin: "50% 50%",
      },
      {
        yPercent: motion.yTo,
        rotation: motion.rotateTo,
        ease: "none",
        scrollTrigger: {
          trigger: item,
          containerAnimation: scrollTween,
          start: cardTriggerStart,
          end: cardTriggerEnd,
          scrub: SCRUB.STANDARD,
        },
      },
    );

    cleanups.push(() => {
      cardTween.scrollTrigger?.kill();
      cardTween.kill();
      gsap.set(item, { clearProps: "transform" });
    });

    const media = item.querySelector<HTMLElement>(".sd-benefit-card__media");
    if (
      media &&
      motion.imageYFrom !== undefined &&
      motion.imageYTo !== undefined
    ) {
      const mediaTween = gsap.fromTo(
        media,
        { yPercent: motion.imageYFrom },
        {
          yPercent: motion.imageYTo,
          ease: "none",
          scrollTrigger: {
            trigger: item,
            containerAnimation: scrollTween,
            start: cardTriggerStart,
            end: cardTriggerEnd,
            scrub: SCRUB.STANDARD,
          },
        },
      );
      cleanups.push(() => {
        mediaTween.scrollTrigger?.kill();
        mediaTween.kill();
        gsap.set(media, { clearProps: "transform" });
      });
    }
  });

  const onResize = () => {
    applyRunway();
    ScrollTrigger.refresh();
  };
  window.addEventListener("resize", onResize);
  cleanups.push(() => window.removeEventListener("resize", onResize));

  wrapper.dataset.horizontalSequenceReady = "true";

  return () => {
    cleanups.forEach((fn) => fn());
    wrapper.style.height = "";
    gsap.set(track, { clearProps: "transform" });
    delete wrapper.dataset.horizontalSequenceReady;
  };
}

/** Desktop-only binding with automatic cleanup on breakpoint revert. */
export function bindHorizontalFeatureSequenceMatchMedia(
  config: HorizontalFeatureSequenceConfig,
): () => void {
  const mm = gsap.matchMedia();

  mm.add(motionMediaQueries.desktop, () => {
    return bindHorizontalFeatureSequence(config);
  });

  return () => {
    mm.revert();
  };
}
