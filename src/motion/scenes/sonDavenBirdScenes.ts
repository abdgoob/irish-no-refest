import { gsap } from "@/motion/core/gsap";
import { BREAKPOINT_DESKTOP } from "@/motion/config/tokens";
import { images } from "@/data/assets";
import { initCanvasEffect } from "@/motion/prologue/asciiCanvasEffect.js";

type VideoLayer = {
  type: "video";
  sources: { src: string; type: string }[];
  loop: boolean;
  config: Record<string, unknown>;
};

function isDesktop(): boolean {
  return window.innerWidth >= BREAKPOINT_DESKTOP;
}

function bandPercent(): number {
  return isDesktop() ? 33.33 : 100;
}

/** Son Daven initSceneFaq — pixel-for-parameter port. */
function faqLayers(t: number): VideoLayer[] {
  return [
    {
      type: "video",
      sources: [{ src: images.faqScene.birdsTop, type: "video/mp4" }],
      loop: true,
      config: {
        x: `${-t}%`,
        y: "0%",
        width: `${t}%`,
        height: `${t}vw`,
        blackPoint: 0,
        whitePoint: 255,
        threshold: 255,
        bgOpacity: 1,
        fillOpacity: 1,
      },
    },
    {
      type: "video",
      sources: [{ src: images.faqScene.birdsBottom, type: "video/mp4" }],
      loop: true,
      config: {
        x: `${-t}%`,
        y: "55%",
        width: `${t}%`,
        height: `${t}vw`,
        blackPoint: 0,
        whitePoint: 255,
        threshold: 255,
        bgOpacity: 1,
        fillOpacity: 1,
      },
    },
  ];
}

/** Son Daven initSceneAbout — pixel-for-parameter port. */
function aboutLayers(t: number): VideoLayer[] {
  return [
    {
      type: "video",
      sources: [{ src: images.faqScene.birdsBottom, type: "video/mp4" }],
      loop: true,
      config: {
        x: `${-t}%`,
        y: "10%",
        width: `${t}%`,
        height: `${t}vw`,
        blackPoint: 255,
        whitePoint: 0,
        threshold: 255,
        bgOpacity: 1,
        fillOpacity: 1,
      },
    },
    {
      type: "video",
      sources: [{ src: images.aboutScene.stork, type: "video/mp4" }],
      loop: true,
      config: {
        x: "45%",
        y: "65%",
        width: "40%",
        height: "36vw",
        blackPoint: 160,
        whitePoint: 0,
        threshold: 255,
        bgOpacity: 1,
        fillOpacity: 1,
      },
    },
  ];
}

function observeScenePlayback(
  canvas: HTMLCanvasElement,
  timeline: gsap.core.Timeline,
  extraTargets: Element[] = [],
): IntersectionObserver {
  const visibleTargets = new Set<Element>();

  const syncPlayback = () => {
    if (visibleTargets.size > 0) {
      if (timeline.paused()) timeline.play();
    } else if (!timeline.paused()) {
      timeline.pause();
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visibleTargets.add(entry.target);
        else visibleTargets.delete(entry.target);
      });
      syncPlayback();
    },
    { threshold: 0, rootMargin: "12% 0px 12% 0px" },
  );

  observer.observe(canvas);
  extraTargets.forEach((el) => observer.observe(el));
  syncPlayback();

  return observer;
}

function mountScene(
  canvas: HTMLCanvasElement,
  layers: VideoLayer[],
  buildTimeline: (layers: VideoLayer[]) => gsap.core.Timeline,
  extraPlaybackTargets: Element[] = [],
): (() => void) | null {
  if (typeof window === "undefined") return null;

  const scene = initCanvasEffect(canvas, layers);
  if (!scene) return null;

  const timeline = buildTimeline(layers);
  let observer: IntersectionObserver | null = null;

  void scene.loaded.then(() => {
    observer = observeScenePlayback(canvas, timeline, extraPlaybackTargets);
  });

  return () => {
    observer?.disconnect();
    timeline.kill();
    scene.destroy();
  };
}

export function mountSonDavenFaqBirdScene(
  canvas: HTMLCanvasElement,
): (() => void) | null {
  const t = bandPercent();
  const layers = faqLayers(t);

  return mountScene(canvas, layers, (layerConfigs) =>
    gsap
      .timeline({ paused: true, repeat: -1 })
      .to(layerConfigs[0].config, {
        x: "100%",
        duration: isDesktop() ? 5 : 2.5,
        ease: "none",
      })
      .to(layerConfigs[1].config, {
        x: "100%",
        duration: isDesktop() ? 5 : 2.5,
        ease: "none",
      })
      .to({}, { duration: 5 }),
  );
}

export function mountSonDavenAboutBirdScene(
  canvas: HTMLCanvasElement,
): (() => void) | null {
  const t = bandPercent();
  const layers = aboutLayers(t);
  const transition = document.querySelector(".sd-about-transition");
  const section = canvas.closest("#about");
  const extraTargets = [transition, section].filter(Boolean) as Element[];

  return mountScene(
    canvas,
    layers,
    (layerConfigs) =>
    gsap
      .timeline({ paused: true })
      .to(layerConfigs[0].config, {
        x: "100%",
        duration: 5,
        ease: "none",
        repeat: -1,
        repeatDelay: 5,
      })
      .to(
        layerConfigs[1].config,
        {
          x: "-40%",
          y: "0%",
          duration: 6,
          ease: "none",
          delay: 4,
          repeat: -1,
          repeatDelay: 6,
        },
        "<",
      ),
    extraTargets,
  );
}
