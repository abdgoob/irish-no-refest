export type ArcFeatureItem = {
  id: string;
  title: string;
  body: string;
  image: string;
};

export type ArcFeatureCarouselConfig = {
  radiusRatio?: number;
  cardRatio?: number;
  minCardWidth?: number;
  maxCardWidth?: number;
  /** width / height */
  cardAspect?: number;
  overlap?: number;
  arcOffset?: number;
  /** Master follow speed (higher = snappier). */
  smoothing?: number;
  dragSensitivity?: number;
  momentum?: number;
  autoRotateSpeed?: number;
  pauseOnHover?: boolean;
  /** Max angle (rad) from center before card fades out. */
  visibleMaxAngle?: number;
  showDisc?: boolean;
};

export type ArcGeometry = {
  stageWidth: number;
  stageHeight: number;
  cardWidth: number;
  cardHeight: number;
  radius: number;
  step: number;
  centerX: number;
  centerY: number;
  visibleMaxAngle: number;
};
