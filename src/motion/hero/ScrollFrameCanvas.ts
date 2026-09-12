const MAX_DPR = 2;
const INITIAL_WINDOW = 8;
const BATCH_SIZE = 6;

export type ScrollFrameCanvasOptions = {
  urls: string[];
  onFirstFrame?: () => void;
  onProgress?: (loaded: number, total: number) => void;
};

/** Imperative cover-cropped frame renderer. No React state per scroll tick. */
export class ScrollFrameCanvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null;
  private urls: string[];
  private images: Array<HTMLImageElement | null>;
  private loaded = new Set<number>();
  private aborted = false;
  private lastDrawn = -1;
  private resizeObserver: ResizeObserver | null = null;
  private onFirstFrame?: () => void;
  private onProgress?: (loaded: number, total: number) => void;
  private firstFrameNotified = false;

  constructor(canvas: HTMLCanvasElement, options: ScrollFrameCanvasOptions) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: false });
    this.urls = options.urls;
    this.images = new Array(options.urls.length).fill(null);
    this.onFirstFrame = options.onFirstFrame;
    this.onProgress = options.onProgress;
  }

  get frameCount(): number {
    return this.urls.length;
  }

  get loadedCount(): number {
    return this.loaded.size;
  }

  async start(): Promise<void> {
    this.syncBitmapSize();
    this.resizeObserver = new ResizeObserver(() => {
      this.syncBitmapSize();
      if (this.lastDrawn >= 0) this.draw(this.lastDrawn, true);
    });
    this.resizeObserver.observe(this.canvas);

    await this.loadIndex(0);
    void this.loadRange(1, Math.min(INITIAL_WINDOW, this.urls.length - 1));
    void this.loadRemainder();
  }

  draw(frame: number, force = false): void {
    if (!this.ctx) return;
    const index = this.nearestLoaded(Math.round(frame));
    if (index < 0) return;
    if (!force && index === this.lastDrawn) return;

    const img = this.images[index];
    if (!img) return;

    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const cssW = this.canvas.clientWidth;
    const cssH = this.canvas.clientHeight;
    const w = Math.max(1, Math.round(cssW * dpr));
    const h = Math.max(1, Math.round(cssH * dpr));

    const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    const dx = (w - dw) / 2;
    const dy = (h - dh) / 2;

    this.ctx.drawImage(img, dx, dy, dw, dh);
    this.lastDrawn = index;
  }

  destroy(): void {
    this.aborted = true;
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.images = [];
    this.loaded.clear();
    this.ctx = null;
  }

  private syncBitmapSize(): void {
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const cssW = Math.max(1, this.canvas.clientWidth);
    const cssH = Math.max(1, this.canvas.clientHeight);
    const w = Math.round(cssW * dpr);
    const h = Math.round(cssH * dpr);
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
      this.lastDrawn = -1;
    }
  }

  private nearestLoaded(index: number): number {
    if (this.loaded.has(index)) return index;
    for (let d = 1; d < this.urls.length; d++) {
      if (this.loaded.has(index - d)) return index - d;
      if (this.loaded.has(index + d)) return index + d;
    }
    return -1;
  }

  private loadIndex(index: number): Promise<void> {
    if (this.aborted || this.loaded.has(index) || !this.urls[index]) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        if (this.aborted) return resolve();
        this.images[index] = img;
        this.loaded.add(index);
        this.onProgress?.(this.loaded.size, this.urls.length);
        if (index === 0 && !this.firstFrameNotified) {
          this.firstFrameNotified = true;
          this.draw(0, true);
          this.onFirstFrame?.();
        }
        resolve();
      };
      img.onerror = () => resolve();
      img.src = this.urls[index];
    });
  }

  private async loadRange(from: number, to: number): Promise<void> {
    for (let i = from; i <= to; i++) {
      if (this.aborted) return;
      await this.loadIndex(i);
    }
  }

  private async loadRemainder(): Promise<void> {
    const start = INITIAL_WINDOW + 1;
    for (let i = start; i < this.urls.length; i += BATCH_SIZE) {
      if (this.aborted) return;
      const slice = [];
      for (let j = i; j < Math.min(i + BATCH_SIZE, this.urls.length); j++) {
        slice.push(this.loadIndex(j));
      }
      await Promise.all(slice);
      await new Promise((r) => setTimeout(r, 0));
    }
  }
}
