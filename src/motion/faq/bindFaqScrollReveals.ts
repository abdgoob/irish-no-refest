import { gsap, ScrollTrigger } from "@/motion/core/gsap";
import {
  DURATION,
  REVEAL_DELAY_DEFAULT,
  STAGGER_DEFAULT,
} from "@/motion/config/tokens";
import {
  createManagedSplit,
  editorialHeadingYOffset,
} from "@/motion/core/splitTextUtils";
import { bindLineReveal } from "@/motion/patterns/LineReveal";

async function bindHeadingReveal(element: HTMLElement): Promise<() => void> {
  const { split, revert } = await createManagedSplit(element, {
    type: "words",
    autoSplit: true,
    wordsClass: "sd-faq-split-word",
    smartWrap: true,
  });

  const words = split.words as HTMLElement[];
  words.forEach((word, index) => {
    gsap.set(word, {
      yPercent: editorialHeadingYOffset(index),
      scale: 0,
      opacity: 0,
    });
  });

  gsap.set(element, { visibility: "visible" });

  const trigger = ScrollTrigger.create({
    trigger: element,
    start: "top bottom",
    once: true,
    onEnter: () => {
      gsap.to(words, {
        yPercent: 0,
        scale: 1,
        opacity: 1,
        duration: DURATION.SLOW,
        stagger: { each: STAGGER_DEFAULT * 0.25, from: "random" },
        ease: "Out",
        overwrite: true,
      });
    },
  });

  return () => {
    trigger.kill();
    revert();
  };
}

function bindContainerReveal(element: HTMLElement): () => void {
  gsap.set(element, { opacity: 0, yPercent: 100, visibility: "hidden" });

  const trigger = ScrollTrigger.create({
    trigger: element,
    start: "top bottom",
    once: true,
    onEnter: () => {
      gsap.set(element, { visibility: "visible" });
      gsap.to(element, {
        opacity: 1,
        yPercent: 0,
        duration: DURATION.SLOW,
        delay: REVEAL_DELAY_DEFAULT,
        ease: "Out",
        overwrite: true,
      });
    },
  });

  return () => trigger.kill();
}

export async function bindFaqScrollReveals(
  root: HTMLElement,
): Promise<() => void> {
  const cleanups: Array<() => void> = [];

  const headings = root.querySelectorAll<HTMLElement>(
    '[data-scroll-reveal="h"]',
  );
  for (const heading of headings) {
    cleanups.push(await bindHeadingReveal(heading));
  }

  root.querySelectorAll<HTMLElement>('[data-scroll-reveal="ctn"]').forEach(
    (el) => {
      cleanups.push(bindContainerReveal(el));
    },
  );

  root.querySelectorAll<HTMLElement>('[data-scroll-reveal="line"]').forEach(
    (el) => {
      cleanups.push(bindLineReveal(el));
    },
  );

  return () => cleanups.forEach((fn) => fn());
}
