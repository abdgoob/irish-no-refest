import { gsap } from "@/motion/core/gsap";
import { BREAKPOINT_DESKTOP } from "@/motion/config/tokens";
import { images } from "@/data/assets";
import { initCanvasEffect } from "@/motion/prologue/asciiCanvasEffect.js";

const CANVAS_DPR_CAP = 1.5;

export type BirdsScenePreset = "faq-dark" | "about-light";

type LayerSpec = {
  type: "video";
  sources: { src: string; type: string }[];
  loop: boolean;
  config: Record<string, unknown>;
};

function sizeSceneCanvas(
  canvas: HTMLCanvasElement,
  wrapSelector: string,
): boolean {
  const wrap = canvas.closest(wrapSelector);
  if (!wrap) return false;
  const { width, height } = wrap.getBoundingClientRect();
  if (width < 16 || height < 16) return false;
  const dpr = Math.min(window.devicePixelRatio || 1, CANVAS_DPR_CAP);
  const w = Math.round(width * dpr);
  const h = Math.round(height * dpr);
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }
  return true;
}

function buildLayers(preset: BirdsScenePreset, band: number): LayerSpec[] {
  const birdAscii = {
    ySquares: 125,
    xSquares: 125,
    threshold: 255,
    bgOpacity: 0,
    fillOpacity: 1,
  };

  if (preset === "faq-dark") {
    return [
      {
        type: "video",
        sources: [{ src: images.faqScene.birdsTop, type: "video/mp4" }],
        loop: true,
        config: {
          x: `${-band}%`,
          y: "0%",
          width: `${band}%`,
          height: `${band}vw`,
          blackPoint: 0,
          whitePoint: 255,
          ...birdAscii,
        },
      },
      {
        type: "video",
        sources: [{ src: images.faqScene.birdsBottom, type: "video/mp4" }],
        loop: true,
        config: {
          x: `${-band}%`,
          y: "55%",
          width: `${band}%`,
          height: `${band}vw`,
          blackPoint: 0,
          whitePoint: 255,
          ...birdAscii,
        },
      },
    ];
  }

  return [
    {
      type: "video",
      sources: [{ src: images.faqScene.birdsBottom, type: "video/mp4" }],
      loop: true,
      config: {
        x: `${-band}%`,
        y: "10%",
        width: `${band}%`,
        height: `${band}vw`,
        blackPoint: 255,
        whitePoint: 0,
        ...birdAscii,
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
        ...birdAscii,
      },
    },
  ];
}

function bindTimeline(
  preset: BirdsScenePreset,
  layers: LayerSpec[],
  desktop: boolean,
): gsap.core.Timeline {
  if (preset === "faq-dark") {
    const duration = desktop ? 5 : 2.5;
    return gsap
      .timeline({ paused: true, repeat: -1 })
      .to(layers[0].config, { x: "100%", duration, ease: "none" })
      .to(layers[1].config, { x: "100%", duration, ease: "none" })
      .to({}, { duration: 5 });
  }

  return gsap
    .timeline({ paused: true })
    .to(layers[0].config, {
      x: "100%",
      duration: 5,
      ease: "none",
      repeat: -1,
      repeatDelay: 5,
    })
    .to(
      layers[1].config,
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
    );
}

export function mountBirdsScene(
  canvas: HTMLCanvasElement,
  options: {
    preset: BirdsScenePreset;
    wrapSelector: string;
  },
): (() => void) | null {
  if (typeof window === "undefined") return null;

  const desktopMq = window.matchMedia(`(min-width: ${BREAKPOINT_DESKTOP}px)`);
  if (!sizeSceneCanvas(canvas, options.wrapSelector)) return null;

  const band = desktopMq.matches ? 33.33 : 100;
  const layers = buildLayers(options.preset, band);
  const scene = initCanvasEffect(canvas, layers);
  if (!scene) return null;

  let timeline: gsap.core.Timeline | null = null;
  let observer: IntersectionObserver | null = null;

  void scene.loaded.then(() => {
    timeline = bindTimeline(options.preset, layers, desktopMq.matches);
    observer = new IntersectionObserver(
      (entries) => {
        const visible = entries[0]?.isIntersecting ?? false;
        if (!timeline) return;
        if (visible) {
          if (timeline.paused()) timeline.play();
        } else if (!timeline.paused()) {
          timeline.pause();
        }
      },
      { threshold: 0.01, rootMargin: "20% 0px 20% 0px" },
    );
    observer.observe(canvas);
  });

  return () => {
    observer?.disconnect();
    timeline?.kill();
    scene.destroy();
  };
}
