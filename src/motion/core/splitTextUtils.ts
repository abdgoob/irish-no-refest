"use client";

import { SplitText, registerGsapPlugins } from "@/motion/core/gsap";

export type ManagedSplit = {
  split: SplitText;
  revert: () => void;
};

/** Wait for web fonts before measuring text geometry. */
export async function whenFontsReady(): Promise<void> {
  if (typeof document === "undefined") return;
  registerGsapPlugins();
  await document.fonts.ready;
}

/**
 * Create SplitText after fonts are ready. Caller must revert on cleanup.
 * Uses GSAP SplitText accessibility defaults (aria: auto).
 */
export async function createManagedSplit(
  element: Element,
  config: Record<string, unknown>,
): Promise<ManagedSplit> {
  await whenFontsReady();
  registerGsapPlugins();

  const split = SplitText.create(element, {
    aria: "auto",
    ...config,
  } as Parameters<typeof SplitText.create>[1]);

  return {
    split,
    revert: () => {
      split.revert();
    },
  };
}

/** Stable editorial offset from index (not random per load). */
export function editorialHeadingYOffset(index: number): number {
  const variants = [-150, 75, -75, 150];
  return variants[(index * 5 + 2) % variants.length];
}

export function logMotionDebug(
  debug: boolean,
  label: string,
  payload?: Record<string, unknown>,
): void {
  if (!debug) return;
  console.info(`[motion] ${label}`, payload ?? "");
}
