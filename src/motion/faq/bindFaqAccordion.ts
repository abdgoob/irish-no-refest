import { gsap, ScrollTrigger } from "@/motion/core/gsap";
import { DURATION } from "@/motion/config/tokens";
import {
  hideFaqAnswerLines,
  revealFaqAnswerLines,
  setFaqAnswerLinesInitial,
} from "@/motion/faq/faqAnswerLines";

function measurePanelHeight(panel: HTMLElement): number {
  gsap.set(panel, { height: "auto", display: "block" });
  const height = panel.offsetHeight;
  gsap.set(panel, { height: 0 });
  return height;
}

function openPanel(
  panel: HTMLElement,
  iconVer: HTMLElement | null,
  paragraph: HTMLElement | null,
  itemIndex: number,
): void {
  const targetHeight = measurePanelHeight(panel);

  gsap.to(panel, {
    height: targetHeight,
    duration: DURATION.SLOW,
    ease: "Out",
    onComplete: () => {
      gsap.set(panel, { height: "auto" });
      ScrollTrigger.refresh();
    },
  });

  if (iconVer) {
    gsap.fromTo(
      iconVer,
      { rotate: 0 },
      { rotate: 90, duration: DURATION.MEDIUM, ease: "InOut", overwrite: true },
    );
  }

  if (paragraph) {
    void revealFaqAnswerLines(paragraph, itemIndex);
  }
}

function closePanel(
  panel: HTMLElement,
  iconVer: HTMLElement | null,
  paragraph: HTMLElement | null,
): void {
  const currentHeight = panel.offsetHeight;
  gsap.set(panel, { height: currentHeight });

  gsap.to(panel, {
    height: 0,
    duration: DURATION.SLOW,
    ease: "Out",
    overwrite: true,
    onComplete: () => ScrollTrigger.refresh(),
  });

  if (iconVer) {
    gsap.to(iconVer, {
      rotate: 0,
      duration: DURATION.MEDIUM,
      ease: "InOut",
      overwrite: true,
    });
  }

  if (paragraph) {
    hideFaqAnswerLines(paragraph);
  }
}

export async function bindFaqAccordion(root: HTMLElement): Promise<() => void> {
  const buttons = root.querySelectorAll<HTMLElement>("[data-accordion-btn]");
  let openBtn: HTMLElement | null = null;
  const listeners: Array<() => void> = [];

  for (const [itemIndex, button] of [...buttons].entries()) {
    const id = button.getAttribute("data-accordion-btn");
    if (!id) continue;

    const panel = root.querySelector<HTMLElement>(
      `[data-accordion-desc="${id}"]`,
    );
    const iconVer = root.querySelector<HTMLElement>(
      `[data-accordion-icon-ver="${id}"]`,
    );
    const paragraph = root.querySelector<HTMLElement>(
      `[data-accordion-paragraph="${id}"]`,
    );

    if (!panel) continue;

    gsap.set(panel, { height: 0, overflow: "hidden" });
    if (paragraph) {
      await setFaqAnswerLinesInitial(paragraph);
    }

    const onClick = () => {
      if (openBtn && openBtn !== button) {
        const prevId = openBtn.getAttribute("data-accordion-btn");
        if (prevId) {
          const prevPanel = root.querySelector<HTMLElement>(
            `[data-accordion-desc="${prevId}"]`,
          );
          const prevIcon = root.querySelector<HTMLElement>(
            `[data-accordion-icon-ver="${prevId}"]`,
          );
          const prevParagraph = root.querySelector<HTMLElement>(
            `[data-accordion-paragraph="${prevId}"]`,
          );
          if (prevPanel) closePanel(prevPanel, prevIcon, prevParagraph);
        }
      }

      if (openBtn !== button) {
        openPanel(panel, iconVer, paragraph, itemIndex);
        openBtn = button;
        button.setAttribute("aria-expanded", "true");
      } else {
        closePanel(panel, iconVer, paragraph);
        openBtn = null;
        button.setAttribute("aria-expanded", "false");
      }
    };

    button.addEventListener("click", onClick);
    listeners.push(() => button.removeEventListener("click", onClick));
  }

  return () => listeners.forEach((fn) => fn());
}
