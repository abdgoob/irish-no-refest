import { mountSonDavenFaqBirdScene } from "@/motion/scenes/sonDavenBirdScenes";

export function mountFaqScene(canvas: HTMLCanvasElement): (() => void) | null {
  return mountSonDavenFaqBirdScene(canvas);
}
