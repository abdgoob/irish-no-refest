import { gsap } from "@/motion/core/gsap";
import { DURATION, STAGGER_DEFAULT } from "@/motion/config/tokens";
import { createManagedSplit } from "@/motion/core/splitTextUtils";
type LineSplit = {
  split: { lines: Element[] };
  revert: () => void;
};

const splitCache = new WeakMap<HTMLElement, LineSplit>();

async function getLineSplit(element: HTMLElement): Promise<LineSplit> {
  const cached = splitCache.get(element);
  if (cached) return cached;

  const managed = await createManagedSplit(element, {
    type: "lines",
    linesClass: "sd-faq-split-line",
    autoSplit: true,
  });

  splitCache.set(element, managed);
  return managed;
}

export async function setFaqAnswerLinesInitial(
  element: HTMLElement,
): Promise<void> {
  const { split } = await getLineSplit(element);
  const lines = split.lines as HTMLElement[];
  gsap.set(lines, { yPercent: 250, opacity: 0 });
}

export async function revealFaqAnswerLines(
  element: HTMLElement,
  index = 0,
): Promise<void> {
  const { split } = await getLineSplit(element);
  const lines = split.lines as HTMLElement[];
  gsap.fromTo(
    lines,
    { yPercent: 250, opacity: 0 },
    {
      yPercent: 0,
      opacity: 1,
      duration: DURATION.SLOW,
      delay: index * STAGGER_DEFAULT * 0.25,
      stagger: STAGGER_DEFAULT * 0.5,
      ease: "Out",
      overwrite: true,
    },
  );
}

export function hideFaqAnswerLines(element: HTMLElement): void {
  const cached = splitCache.get(element);
  if (!cached) return;
  const lines = cached.split.lines as HTMLElement[];
  gsap.to(lines, {
    yPercent: 250,
    opacity: 0,
    duration: DURATION.FAST,
    stagger: STAGGER_DEFAULT * 0.5,
    ease: "In",
    overwrite: true,
  });
}

export function revertFaqAnswerLines(element: HTMLElement): void {
  const cached = splitCache.get(element);
  if (!cached) return;
  cached.revert();
  splitCache.delete(element);
}
