"use client";

import { gsap } from "@/motion/core/gsap";
import { motionMediaQueries, SCRUB } from "@/motion/config/tokens";
import { scheduleScrollTriggerRefresh } from "@/motion/core/refreshScrollTriggers";
import { logMotionDebug } from "@/motion/core/splitTextUtils";

export type GalleryScrollSequenceConfig = {
  wrapper: HTMLElement;
  stage: HTMLElement;
  slides: HTMLElement[];
  thumbs?: HTMLElement[];
  overlay?: HTMLElement;
  /** Viewport heights of scroll per slide transition (reference ~0.72). */
  segmentVhRatio?: number;
  debug?: boolean;
};

function applyCrossfade(
  slides: HTMLElement[],
  progress: number,
  thumbs?: HTMLElement[],
  overlay?: HTMLElement,
): void {
  const count = slides.length;
  const t = Math.max(0, Math.min(count - 1, progress));
  const i0 = Math.floor(t);
  const frac = t - i0;

  slides.forEach((slide, i) => {
    let opacity = 0;
    let scale = 1.05;
    if (count === 1) {
      opacity = 1;
      scale = 1;
    } else if (i === i0) {
      opacity = 1 - frac;
      scale = 1 + frac * 0.04;
    } else if (i === i0 + 1) {
      opacity = frac;
      scale = 1.05 - frac * 0.05;
    }
    gsap.set(slide, { opacity, scale, transformOrigin: "center center" });

    const media = slide.querySelector<HTMLElement>(
      "[data-gallery-media], .sd-benefit-card__media, img",
    );
    if (media) {
      gsap.set(media, {
        yPercent: (i - t) * 5,
        scale: 1.08,
        transformOrigin: "center center",
      });
    }
  });

  if (thumbs?.length) {
    const active = Math.round(t);
    thumbs.forEach((thumb, i) => {
      const isActive = i === active;
      thumb.classList.toggle("is-active", isActive);
      gsap.set(thumb, {
        opacity: isActive ? 1 : 0.55,
        scale: isActive ? 1 : 0.96,
        yPercent: isActive ? -4 : 0,
      });
    });
  }

  if (overlay) {
    const intro = Math.min(1, t / 0.35);
    gsap.set(overlay, { opacity: intro });
  }
}

export function bindGalleryScrollSequence(
  config: GalleryScrollSequenceConfig,
): () => void {
  const {
    wrapper,
    stage,
    slides,
    thumbs,
    overlay,
    segmentVhRatio = 0.72,
    debug = false,
  } = config;

  if (slides.length < 1) return () => {};

  const vh = stage.clientHeight || window.innerHeight;
  const scrollDistance = Math.max(
    vh * 0.5,
    (slides.length - 1) * vh * segmentVhRatio,
  );
  wrapper.style.height = `${Math.round(vh + scrollDistance)}px`;

  logMotionDebug(debug, "gallery sequence measure", {
    runwayPx: wrapper.offsetHeight,
    slides: slides.length,
    scrollDistance,
    segmentVhRatio,
  });

  gsap.set(slides, { opacity: 0, scale: 1.05 });
  gsap.set(slides[0], { opacity: 1, scale: 1 });
  if (overlay) gsap.set(overlay, { opacity: 0, yPercent: 8 });

  const state = { progress: 0 };

  const tween = gsap.to(state, {
    progress: Math.max(0, slides.length - 1),
    ease: "none",
    scrollTrigger: {
      trigger: wrapper,
      start: "top top",
      end: "bottom bottom",
      scrub: SCRUB.STANDARD,
      invalidateOnRefresh: true,
      onRefresh: () => {
        const v = stage.clientHeight || window.innerHeight;
        const dist = Math.max(
          v * 0.5,
          (slides.length - 1) * v * segmentVhRatio,
        );
        wrapper.style.height = `${Math.round(v + dist)}px`;
      },
    },
    onUpdate: () => {
      applyCrossfade(slides, state.progress, thumbs, overlay);
      if (debug) {
        wrapper.dataset.galleryIndex = String(Math.round(state.progress));
      }
    },
  });

  applyCrossfade(slides, 0, thumbs, overlay);

  const onResize = () => scheduleScrollTriggerRefresh();
  window.addEventListener("resize", onResize);

  wrapper.dataset.gallerySequenceReady = "true";

  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
    window.removeEventListener("resize", onResize);
    wrapper.style.height = "";
    delete wrapper.dataset.gallerySequenceReady;
    delete wrapper.dataset.galleryIndex;
    slides.forEach((slide) => {
      gsap.set(slide, { clearProps: "opacity,transform" });
      const media = slide.querySelector<HTMLElement>("[data-gallery-media]");
      if (media) gsap.set(media, { clearProps: "transform" });
    });
    thumbs?.forEach((thumb) => {
      thumb.classList.remove("is-active");
      gsap.set(thumb, { clearProps: "opacity,transform" });
    });
    if (overlay) gsap.set(overlay, { clearProps: "opacity,transform" });
  };
}

export function bindGalleryScrollSequenceMatchMedia(
  config: GalleryScrollSequenceConfig,
): () => void {
  const mm = gsap.matchMedia();

  mm.add(motionMediaQueries.desktop, () => {
    config.wrapper.dataset.galleryMode = "desktop-sequence";
    const cleanup = bindGalleryScrollSequence(config);
    return () => {
      cleanup();
      config.wrapper.dataset.galleryMode = "static";
    };
  });

  return () => {
    mm.revert();
  };
}
