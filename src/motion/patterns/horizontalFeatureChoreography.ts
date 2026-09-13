/**
 * Deterministic per-card motion for horizontal feature sequences.
 * Values are px / deg offsets from the stage-centered rest pose (not random).
 */

export type HorizontalFeatureCardMotion = {
  /** Entry offset (px, + = down). */
  yFrom: number;
  /** Hero/read pose (px from rest). */
  yMid: number;
  /** Exit offset (px, − = up). */
  yTo: number;
  rotateFrom: number;
  rotateMid: number;
  rotateTo: number;
  /** Optional inner image parallax (%). */
  imageYFrom?: number;
  imageYTo?: number;
  /** Stacking during overlap. */
  zIndex?: number;
};

/** Measured from sondaven.com/en benefits cards @ ~1440×900 (hero + arc samples). */
export const HORIZONTAL_FEATURE_CARD_PATHS: HorizontalFeatureCardMotion[] = [
  {
    yFrom: 210,
    yMid: -6,
    yTo: -195,
    rotateFrom: -7,
    rotateMid: 0,
    rotateTo: 4,
    imageYFrom: 4,
    imageYTo: -5,
    zIndex: 2,
  },
  {
    yFrom: -175,
    yMid: 10,
    yTo: 205,
    rotateFrom: 6,
    rotateMid: 0,
    rotateTo: -5,
    imageYFrom: -4,
    imageYTo: 4,
    zIndex: 3,
  },
  {
    yFrom: 235,
    yMid: -4,
    yTo: -185,
    rotateFrom: -5,
    rotateMid: 0,
    rotateTo: 6,
    imageYFrom: 3,
    imageYTo: -4,
    zIndex: 4,
  },
  {
    yFrom: -165,
    yMid: 8,
    yTo: 195,
    rotateFrom: 7,
    rotateMid: 0,
    rotateTo: -4,
    imageYFrom: -3,
    imageYTo: 3,
    zIndex: 5,
  },
  {
    yFrom: 198,
    yMid: -12,
    yTo: -205,
    rotateFrom: -6,
    rotateMid: 0,
    rotateTo: 5,
    imageYFrom: 4,
    imageYTo: -3,
    zIndex: 6,
  },
  {
    yFrom: -188,
    yMid: 6,
    yTo: 178,
    rotateFrom: 5,
    rotateMid: 0,
    rotateTo: -6,
    imageYFrom: -4,
    imageYTo: 4,
    zIndex: 7,
  },
  {
    yFrom: 205,
    yMid: -8,
    yTo: -192,
    rotateFrom: -4,
    rotateMid: 0,
    rotateTo: 7,
    imageYFrom: 3,
    imageYTo: -4,
    zIndex: 8,
  },
  {
    yFrom: -170,
    yMid: 12,
    yTo: 165,
    rotateFrom: 8,
    rotateMid: 0,
    rotateTo: -5,
    imageYFrom: -3,
    imageYTo: 3,
    zIndex: 9,
  },
];

export function getHorizontalFeatureCardMotion(
  index: number,
  override?: Partial<HorizontalFeatureCardMotion>,
): HorizontalFeatureCardMotion {
  const base =
    HORIZONTAL_FEATURE_CARD_PATHS[index] ??
    HORIZONTAL_FEATURE_CARD_PATHS[index % HORIZONTAL_FEATURE_CARD_PATHS.length];
  return { ...base, ...override };
}
