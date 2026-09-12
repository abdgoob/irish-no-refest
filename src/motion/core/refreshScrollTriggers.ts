"use client";

import { ScrollTrigger, registerGsapPlugins } from "@/motion/core/gsap";

const RESIZE_DEBOUNCE_MS = 200;

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

/** Refresh after fonts are ready (SplitText geometry depends on this later). */
export function refreshScrollTriggersAfterFonts(): void {
  if (typeof window === "undefined") return;
  registerGsapPlugins();

  void document.fonts.ready.then(() => {
    ScrollTrigger.refresh();
  });
}

export function scheduleScrollTriggerRefresh(): void {
  if (typeof window === "undefined") return;

  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    debounceTimer = null;
    refreshScrollTriggersAfterFonts();
  }, RESIZE_DEBOUNCE_MS);
}

export function cancelScheduledScrollTriggerRefresh(): void {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
}
