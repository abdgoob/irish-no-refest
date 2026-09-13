import type { ArcFeatureCarouselConfig } from "@/components/carousel/arcFeatureCarousel.types";

/** Defaults aligned with ArcFlowCarousel reference; tuned for Son Daven benefits stage. */
export const ARC_FEATURE_CAROUSEL_DEFAULTS: Required<ArcFeatureCarouselConfig> =
  {
    radiusRatio: 0.85,
    cardRatio: 0.24,
    minCardWidth: 220,
    maxCardWidth: 360,
    cardAspect: 0.62,
    overlap: -0.04,
    arcOffset: 0.52,
    smoothing: 5.5,
    dragSensitivity: 1.2,
    momentum: 1,
    autoRotateSpeed: 0.1,
    pauseOnHover: true,
    visibleMaxAngle: 1.35,
    showDisc: true,
  };
