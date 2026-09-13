export type CanvasEffectLayer =
  | {
      type: "video";
      sources: { src: string; type?: string }[];
      loop?: boolean;
      config?: Record<string, unknown>;
    }
  | {
      type: "image";
      src: string;
      config?: Record<string, unknown>;
    };

export function initCanvasEffect(
  target: HTMLCanvasElement | string,
  layers: CanvasEffectLayer[],
  options?: Record<string, unknown>,
): { destroy: () => void; loaded: Promise<unknown[]> } | undefined;
