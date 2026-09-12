import { images } from "@/data/assets";
import type { HeroSceneConfig } from "@/motion/hero/types";

const FRAME_COUNT = 120;

/** Desktop pullback sequence: `000.webp` … `119.webp` (live source used 120 frames). */
export const heroFrameSources = Array.from({ length: FRAME_COUNT }, (_, i) => {
  const n = String(i).padStart(3, "0");
  return `/assets/hero/frames/${n}.webp`;
});

/**
 * Verified live sources (Phase 2C):
 * - Frames: https://assets.sondaven.com/hero-video/{000-119}.webp
 * - Overlay stills: Webflow CDN intro/mid/background AVIFs
 * - Ambient loops: assets.sondaven.com/scenes/*.mp4
 *
 * Local copies live under public/assets/hero/.
 */
export const heroSceneConfig: HeroSceneConfig = {
  frames: heroFrameSources,
  fallbackImage: images.hero.desktop,
  mobileImage: images.hero.mobile,
  desktopRunway: "400svh",
  /** Shorter than reference — faster handoff to content on phones (2H). */
  mobileRunway: "140svh",
  // Frame-only until a real-alpha compositor exists. Assets remain on disk.
  layersEnabled: false,
  layers: [
    {
      id: "atmosphere",
      src: "/assets/hero/video/atmosphere-loop.mp4",
      kind: "video",
      enabled: false,
      desktopOnly: true,
      zIndex: 3,
      style: { left: "5%", top: "25%", width: "65%", height: "45vw" },
      parallaxX: { from: "0%", to: "-35%" },
    },
    {
      id: "sky",
      src: "/assets/hero/video/sky-loop.mp4",
      kind: "video",
      enabled: false,
      desktopOnly: true,
      zIndex: 3,
      style: { left: "-33%", top: "30%", width: "33%", height: "33vw" },
    },
    {
      id: "midground",
      src: "/assets/hero/layers/midground.avif",
      kind: "image",
      enabled: false,
      zIndex: 5,
      style: { left: "56%", top: "66%", width: "14%", height: "12%" },
    },
    {
      id: "side",
      src: "/assets/hero/video/side-loop.mp4",
      kind: "video",
      enabled: false,
      desktopOnly: true,
      zIndex: 5,
      style: { left: "70%", top: "42%", width: "43.5%", height: "52%" },
    },
    {
      id: "foreground",
      src: "/assets/hero/video/foreground-loop.mp4",
      kind: "video",
      enabled: false,
      zIndex: 6,
      style: { left: "0%", top: "72%", width: "72%", height: "32%" },
    },
  ],
};

export function getActiveHeroLayers(config: HeroSceneConfig): HeroSceneConfig["layers"] {
  if (!config.layersEnabled) return [];
  return config.layers.filter((layer) => layer.enabled);
}
