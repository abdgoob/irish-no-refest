"use client";

import { gsap } from "@/motion/core/gsap";
import { SCRUB, STAGGER_DEFAULT } from "@/motion/config/tokens";
import { createManagedSplit } from "@/motion/core/splitTextUtils";
import type { HighlightScrubOptions } from "@/motion/patterns/types";

/**
 * Character scrub highlight (Prologue-style quote).
 * Generic — not tied to hotel copy.
 */
export async function bindHighlightScrubText(
  element: HTMLElement,
  options: HighlightScrubOptions = {},
): Promise<() => void> {
  const trigger = options.trigger ?? element;
  const start = options.start ?? "top 75%";
  const end = options.end ?? "bottom 50%";
  const scrub = options.scrub ?? SCRUB.STANDARD;
  const stagger = options.stagger ?? STAGGER_DEFAULT;
  const ease = options.ease ?? "Out";
  const minOpacity = options.minOpacity ?? 0.1;

  let cleanupSplit: (() => void) | null = null;
  let tween: gsap.core.Tween | null = null;

  const build = async () => {
    cleanupSplit?.();
    cleanupSplit = null;
    tween?.scrollTrigger?.kill();
    tween?.kill();

    const { split, revert } = await createManagedSplit(element, {
      type: "chars",
      autoSplit: options.autoSplit ?? true,
    });
    cleanupSplit = revert;

    const chars = split.chars as HTMLElement[];
    gsap.set(chars, { opacity: minOpacity });

    tween = gsap.to(chars, {
      opacity: 1,
      ease,
      stagger,
      scrollTrigger: {
        trigger,
        start,
        end,
        scrub,
      },
    });
  };

  await build();

  return () => {
    tween?.scrollTrigger?.kill();
    tween?.kill();
    cleanupSplit?.();
  };
}
