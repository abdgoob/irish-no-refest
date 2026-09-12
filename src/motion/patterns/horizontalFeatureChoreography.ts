/** Deterministic per-card motion (index-based, not random). */

export type HorizontalFeatureCardMotion = {
  yFrom: number;
  yTo: number;
  rotateFrom: number;
  rotateTo: number;
  imageYFrom?: number;
  imageYTo?: number;
};

const PRESETS: HorizontalFeatureCardMotion[] = [
  { yFrom: 58, yTo: -38, rotateFrom: -8, rotateTo: 4, imageYFrom: 6, imageYTo: -6 },
  { yFrom: -48, yTo: 52, rotateFrom: 7, rotateTo: -5, imageYFrom: -5, imageYTo: 5 },
  { yFrom: 45, yTo: -55, rotateFrom: -6, rotateTo: 8, imageYFrom: 4, imageYTo: -4 },
  { yFrom: -42, yTo: 48, rotateFrom: 9, rotateTo: -4, imageYFrom: -4, imageYTo: 4 },
  { yFrom: 62, yTo: -32, rotateFrom: -7, rotateTo: 6, imageYFrom: 5, imageYTo: -5 },
  { yFrom: -55, yTo: 44, rotateFrom: 5, rotateTo: -9, imageYFrom: -6, imageYTo: 6 },
  { yFrom: 38, yTo: -50, rotateFrom: -5, rotateTo: 7, imageYFrom: 3, imageYTo: -3 },
  { yFrom: -50, yTo: 36, rotateFrom: 8, rotateTo: -6, imageYFrom: -5, imageYTo: 5 },
];

export function getHorizontalFeatureCardMotion(
  index: number,
  override?: Partial<HorizontalFeatureCardMotion>,
): HorizontalFeatureCardMotion {
  const base = PRESETS[index % PRESETS.length];
  return { ...base, ...override };
}
