import { gsap } from "@/motion/core/gsap";
import { BREAKPOINT_DESKTOP } from "@/motion/config/tokens";
import { images } from "@/data/assets";
import { createBirdCanvas } from "@/motion/scenes/birdCanvas";

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
        height: "46%",
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
        y: "38%",
        width: `${t}%`,
        height: "46%",
        blackPoint: 0,
        whitePoint: 255,
        threshold: 255,
        bgOpacity: 1,
        fillOpacity: 1,
      },
    },
  ];
}

type AboutFlightLeg = {
  xFrom: string;
  yFrom: string;
  xTo: string;
  yTo: string;
  duration: number;
};

function randBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

let lastAboutFlightLeg: AboutFlightLeg | null = null;

function pickAboutFlightLeg(t: number): AboutFlightLeg {
  const off = t + randBetween(2, 12);
  const templates: AboutFlightLeg[] = [
    {
      xFrom: `${-off}%`,
      yFrom: `${randBetween(-14, 6)}%`,
      xTo: `${100 + randBetween(2, 10)}%`,
      yTo: `${randBetween(4, 26)}%`,
      duration: randBetween(4.2, 6.4),
    },
    {
      xFrom: `${100 + randBetween(0, 8)}%`,
      yFrom: `${randBetween(32, 52)}%`,
      xTo: `${-off}%`,
      yTo: `${randBetween(-6, 18)}%`,
      duration: randBetween(4.5, 6.8),
    },
    {
      xFrom: `${-off}%`,
      yFrom: `${randBetween(28, 48)}%`,
      xTo: `${100 + randBetween(0, 6)}%`,
      yTo: `${randBetween(-12, 8)}%`,
      duration: randBetween(4.8, 7),
    },
    {
      xFrom: `${100 + randBetween(2, 10)}%`,
      yFrom: `${randBetween(-10, 10)}%`,
      xTo: `${-off}%`,
      yTo: `${randBetween(30, 50)}%`,
      duration: randBetween(4.3, 6.2),
    },
    {
      xFrom: `${randBetween(-28, -8)}%`,
      yFrom: `${randBetween(-18, -4)}%`,
      xTo: `${randBetween(88, 108)}%`,
      yTo: `${randBetween(34, 52)}%`,
      duration: randBetween(5, 7.2),
    },
    {
      xFrom: `${randBetween(92, 108)}%`,
      yFrom: `${randBetween(38, 58)}%`,
      xTo: `${randBetween(-32, -6)}%`,
      yTo: `${randBetween(-8, 14)}%`,
      duration: randBetween(4.6, 6.6),
    },
  ];

  let next = templates[Math.floor(Math.random() * templates.length)];
  if (lastAboutFlightLeg && templates.length > 1) {
    let guard = 0;
    while (
      next.xFrom === lastAboutFlightLeg.xFrom &&
      next.xTo === lastAboutFlightLeg.xTo &&
      guard < 8
    ) {
      next = templates[Math.floor(Math.random() * templates.length)];
      guard += 1;
    }
  }
  lastAboutFlightLeg = next;
  return next;
}

function buildAboutBirdTimeline(
  config: Record<string, unknown>,
  t: number,
): gsap.core.Timeline {
  const tl = gsap.timeline({ paused: true });

  const queueLeg = () => {
    const leg = pickAboutFlightLeg(t);
    tl.set(config, { x: leg.xFrom, y: leg.yFrom })
      .to(config, {
        x: leg.xTo,
        y: leg.yTo,
        duration: leg.duration,
        ease: "none",
      })
      .to({}, { duration: randBetween(3, 5.5) })
      .call(queueLeg);
  };

  queueLeg();
  return tl;
}

/** About intro: small ASCII flock only (no stork / large bird layer). */
function aboutLayers(t: number): VideoLayer[] {
  return [
    {
      type: "video",
      sources: [{ src: images.faqScene.birdsBottom, type: "video/mp4" }],
      loop: true,
      config: {
        x: `${-t}%`,
        y: "0%",
        width: `${t}%`,
        height: "100%",
        blackPoint: 255,
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
  setPlaying: (active: boolean) => void,
): () => void {
  const visibleTargets = new Set<Element>();

  const syncPlayback = () => {
    const active = visibleTargets.size > 0 && !document.hidden;
    setPlaying(active);
    if (active) {
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
    { threshold: 0.01 },
  );

  observer.observe(canvas);
  const section = canvas.closest("#about, #faq");
  if (section) observer.observe(section);
  document.addEventListener("visibilitychange", syncPlayback);
  syncPlayback();

  return () => {
    observer.disconnect();
    document.removeEventListener("visibilitychange", syncPlayback);
  };
}

function mountScene(
  canvas: HTMLCanvasElement,
  layers: VideoLayer[],
  buildTimeline: (layers: VideoLayer[]) => gsap.core.Timeline,
): (() => void) | null {
  if (typeof window === "undefined") return null;

  const scene = createBirdCanvas(canvas, layers);
  if (!scene) return null;

  const timeline = buildTimeline(layers);
  let stopObserving: (() => void) | undefined;
  let disposed = false;

  void scene.loaded.then(() => {
    if (disposed) return;
    stopObserving = observeScenePlayback(canvas, timeline, scene.setPlaying);
  });

  return () => {
    disposed = true;
    stopObserving?.();
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

  const teardown = mountScene(canvas, layers, (layerConfigs) =>
    buildAboutBirdTimeline(layerConfigs[0].config, t),
  );
  if (!teardown) return null;

  return () => {
    lastAboutFlightLeg = null;
    teardown();
  };
}
