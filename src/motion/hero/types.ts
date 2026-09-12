export type HeroLayerKind = "image" | "video";

export type HeroLayerConfig = {
  id: string;
  src: string;
  kind: HeroLayerKind;
  desktopOnly?: boolean;
  zIndex?: number;
  style: {
    left: string;
    top: string;
    width: string;
    height: string;
  };
  /** Optional horizontal scrub on the layer element (desktop). */
  parallaxX?: { from: string; to: string };
  /**
   * Per-layer switch. Ignored unless `layersEnabled` is true on the scene.
   * Default false — unmatted hotel videos must not render.
   */
  enabled?: boolean;
};

export type HeroSceneConfig = {
  frames: string[];
  fallbackImage: string;
  mobileImage: string;
  desktopRunway: string;
  mobileRunway: string;
  /**
   * Master switch for optional atmosphere layers.
   * Frame-only mode is first-class: set this false and/or pass layers: [].
   */
  layersEnabled?: boolean;
  layers: HeroLayerConfig[];
};
