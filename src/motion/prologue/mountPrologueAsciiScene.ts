import { BREAKPOINT_DESKTOP } from "@/motion/config/tokens";
import { images } from "@/data/assets";
// Son Daven ASCII/WebGL scene (prolog side florals).
import { initCanvasEffect } from "./asciiCanvasEffect.js";
import { bindPrologueVideoPingPong } from "./bindPrologueVideoPingPong";

const PROLOG_LAYER_CONFIG = {
  blackPoint: 200,
  whitePoint: 25,
  threshold: 255,
  ySquares: 150,
  xSquares: 125,
  bgOpacity: 1,
  fillOpacity: 1,
} as const;

const CANVAS_DPR_CAP = 1.5;

function sizePrologueCanvas(canvas: HTMLCanvasElement): boolean {
  const section = canvas.closest("#prolog");
  if (!section) return false;
  const { width, height } = section.getBoundingClientRect();
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

/** Mount production-style prologue floral scene on a canvas element. */
export function mountPrologueAsciiScene(
  canvas: HTMLCanvasElement,
): (() => void) | null {
  if (typeof window === "undefined") {
    return null;
  }

  const desktopMq = window.matchMedia(`(min-width: ${BREAKPOINT_DESKTOP}px)`);
  if (!desktopMq.matches || !sizePrologueCanvas(canvas)) {
    return null;
  }

  const layers = [
    {
      type: "video" as const,
      sources: [{ src: images.prologue.videoLeft, type: "video/mp4" }],
      loop: false,
      config: {
        x: "-14%",
        y: "3%",
        width: "44%",
        height: "96%",
        ...PROLOG_LAYER_CONFIG,
      },
    },
    {
      type: "video" as const,
      sources: [{ src: images.prologue.videoRight, type: "video/mp4" }],
      loop: false,
      config: {
        x: "70%",
        y: "3%",
        width: "44%",
        height: "96%",
        ...PROLOG_LAYER_CONFIG,
      },
    },
  ];

  const scene = initCanvasEffect(canvas, layers);
  if (!scene) return null;

  const pingPongCleanups: Array<() => void> = [];
  void scene.loaded.then((loadedLayers) => {
    for (const layer of loadedLayers) {
      if (
        layer &&
        typeof layer === "object" &&
        "type" in layer &&
        layer.type === "video" &&
        "el" in layer &&
        layer.el instanceof HTMLVideoElement
      ) {
        pingPongCleanups.push(bindPrologueVideoPingPong(layer.el));
      }
    }
  });

  return () => {
    pingPongCleanups.forEach((cleanup) => cleanup());
    scene.destroy();
  };
}
