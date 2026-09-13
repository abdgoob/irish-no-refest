"use client";

import { gsap } from "@/motion/core/gsap";
import { motionMediaQueries } from "@/motion/config/tokens";
import { SCRUB } from "@/motion/config/tokens";
import {
  getHorizontalFeatureCardMotion,
  type HorizontalFeatureCardMotion,
} from "@/motion/patterns/horizontalFeatureChoreography";
import { scheduleScrollTriggerRefresh } from "@/motion/core/refreshScrollTriggers";
import { logMotionDebug } from "@/motion/core/splitTextUtils";

export type HorizontalFeatureSequenceConfig = {
  wrapper: HTMLElement;
  stage: HTMLElement;
  track: HTMLElement;
  items: HTMLElement[];
  /** Extra scroll px per px of horizontal travel (live benefits ~1.45). */
  scrollPacing?: number;
  /** Viewport widths of lead-in before first card centers. */
  leadInRatio?: number;
  /** Viewport widths of trail after last card exits. */
  trailOutRatio?: number;
  cardMotion?: (index: number) => Partial<HorizontalFeatureCardMotion>;
  cardTriggerStart?: string;
  cardTriggerEnd?: string;
  /** Portion of card trigger spent in entry → center (0–1). */
  centerAt?: number;
  debug?: boolean;
};

function measureHorizontalTravel(
  stage: HTMLElement,
  track: HTMLElement,
  items: HTMLElement[],
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
  const first = items[0];
  const last = items[items.length - 1];

  if (!first || !last) {
    const xStartPx = viewWidth * leadInRatio;
    const xEndPx = -(Math.max(0, trackWidth - viewWidth) + viewWidth * trailOutRatio);
    const travelPx = xStartPx - xEndPx;
    return { xStartPx, xEndPx, travelPx, trackWidth, viewWidth };
  }

  const firstCenterInTrack = first.offsetLeft + first.offsetWidth / 2;
  const lastCenterInTrack = last.offsetLeft + last.offsetWidth / 2;

  const xStartPx =
    viewWidth / 2 - firstCenterInTrack - viewWidth * leadInRatio;
  const xEndPx =
    viewWidth / 2 - lastCenterInTrack + viewWidth * trailOutRatio;

  const travelPx = xStartPx - xEndPx;
  return {
    xStartPx,
    xEndPx,
    travelPx,
    trackWidth,
    viewWidth,
  };
}

function bindCardArc(
  item: HTMLElement,
  scrollTween: gsap.core.Tween,
  motion: HorizontalFeatureCardMotion,
  cardTriggerStart: string,
  cardTriggerEnd: string,
  centerAt: number,
): () => void {
  const cleanups: Array<() => void> = [];
  const origin = "50% 50%";
  const entryDur = Math.max(0.15, Math.min(0.55, centerAt));
  const exitDur = 1 - entryDur;

  if (motion.zIndex !== undefined) {
    gsap.set(item, { zIndex: motion.zIndex });
  }

  const arcTween = gsap.timeline({
    scrollTrigger: {
      trigger: item,
      containerAnimation: scrollTween,
      start: cardTriggerStart,
      end: cardTriggerEnd,
      scrub: SCRUB.STANDARD,
    },
  });

  arcTween
    .fromTo(
      item,
      {
        y: motion.yFrom,
        rotation: motion.rotateFrom,
        transformOrigin: origin,
      },
      {
        y: motion.yMid,
        rotation: motion.rotateMid,
        duration: entryDur,
        ease: "none",
      },
    )
    .to(item, {
      y: motion.yTo,
      rotation: motion.rotateTo,
      duration: exitDur,
      ease: "none",
    });

  cleanups.push(() => {
    arcTween.scrollTrigger?.kill();
    arcTween.kill();
    gsap.set(item, { clearProps: "transform,zIndex" });
  });

  const media = item.querySelector<HTMLElement>("[data-feature-media]");
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

  return () => cleanups.forEach((fn) => fn());
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
    scrollPacing = 1.45,
    leadInRatio = 0.06,
    trailOutRatio = 0.05,
    cardMotion,
    cardTriggerStart = "left 92%",
    cardTriggerEnd = "right 8%",
    centerAt = 0.42,
    debug = false,
  } = config;

  const cleanups: Array<() => void> = [];

  const metrics = {
    xStartPx: 0,
    xEndPx: 0,
  };

  const refreshMetrics = () => {
    const measured = measureHorizontalTravel(
      stage,
      track,
      items,
      leadInRatio,
      trailOutRatio,
    );
    metrics.xStartPx = measured.xStartPx;
    metrics.xEndPx = measured.xEndPx;
    const scrollDistance = measured.travelPx * scrollPacing;
    const vh = stage.clientHeight || window.innerHeight;
    wrapper.style.height = `${Math.round(vh + scrollDistance)}px`;

    logMotionDebug(debug, "horizontal feature measure", {
      runwayPx: wrapper.offsetHeight,
      trackWidth: measured.trackWidth,
      viewWidth: measured.viewWidth,
      xStartPx: measured.xStartPx,
      xEndPx: measured.xEndPx,
      travelPx: measured.travelPx,
      scrollPacing,
      scrollDistance: Math.round(scrollDistance),
      items: items.length,
    });
  };

  refreshMetrics();

  const scrollTween = gsap.fromTo(
    track,
    { x: () => metrics.xStartPx },
    {
      x: () => metrics.xEndPx,
      ease: "none",
      scrollTrigger: {
        trigger: wrapper,
        start: "top top",
        end: "bottom bottom",
        scrub: SCRUB.STANDARD,
        invalidateOnRefresh: true,
        onRefresh: refreshMetrics,
      },
    },
  );

  cleanups.push(() => {
    scrollTween.scrollTrigger?.kill();
    scrollTween.kill();
  });

  items.forEach((item, index) => {
    const motion = getHorizontalFeatureCardMotion(index, cardMotion?.(index));
    const unbindCard = bindCardArc(
      item,
      scrollTween,
      motion,
      cardTriggerStart,
      cardTriggerEnd,
      centerAt,
    );
    cleanups.push(unbindCard);
  });

  const onResize = () => {
    refreshMetrics();
    scheduleScrollTriggerRefresh();
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
    config.wrapper.dataset.benefitsMode = "desktop-sequence";
    const cleanup = bindHorizontalFeatureSequence(config);
    return () => {
      cleanup();
      config.wrapper.dataset.benefitsMode = "static";
    };
  });

  return () => {
    mm.revert();
  };
}
