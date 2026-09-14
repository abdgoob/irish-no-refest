import { BREAKPOINT_DESKTOP } from "@/motion/config/tokens";
import { bindFaqAccordion } from "@/motion/faq/bindFaqAccordion";
import { bindFaqScrollReveals } from "@/motion/faq/bindFaqScrollReveals";
import { mountFaqScene } from "@/motion/faq/mountFaqScene";

export async function bindFaqMotion(root: HTMLElement): Promise<() => void> {
  const cleanups: Array<() => void> = [];

  cleanups.push(await bindFaqScrollReveals(root));
  if (root.querySelector("[data-accordion-btn]")) {
    cleanups.push(await bindFaqAccordion(root));
  }

  const canvas = root.querySelector<HTMLCanvasElement>("[data-faq-scene]");
  const scenesWrap =
    root.querySelector<HTMLElement>("[data-faq-scene-bounds]") ??
    root.querySelector<HTMLElement>(".sd-faq__scenes");

  if (canvas && scenesWrap) {
    const desktopMq = window.matchMedia(
      `(min-width: ${BREAKPOINT_DESKTOP}px)`,
    );
    const faqPin = root.querySelector<HTMLElement>("#faq [data-gp-pin]");
    let sceneTeardown: (() => void) | undefined;
    let crowsDismissed = false;
    let entryRaf = 0;

    const dismissCrows = () => {
      if (crowsDismissed) return;
      crowsDismissed = true;
      if (entryRaf) {
        cancelAnimationFrame(entryRaf);
        entryRaf = 0;
      }
      sceneTeardown?.();
      sceneTeardown = undefined;
      scenesWrap.classList.add("sd-faq-glyph-portal__birds--off");
    };

    const faqEntered = () => {
      if (!faqPin) return false;
      return faqPin.getBoundingClientRect().top <= 1;
    };

    const syncScene = () => {
      if (crowsDismissed || sceneTeardown) return;
      const { width, height } = scenesWrap.getBoundingClientRect();
      if (width < 16 || height < 16) return;
      const mounted = mountFaqScene(canvas);
      if (mounted) sceneTeardown = mounted;
    };

    const watchFaqEntry = () => {
      entryRaf = 0;
      if (crowsDismissed) return;
      if (faqEntered()) {
        dismissCrows();
        return;
      }
      entryRaf = requestAnimationFrame(watchFaqEntry);
    };

    const resizeObserver = new ResizeObserver(() => syncScene());
    resizeObserver.observe(scenesWrap);
    const onBreakpoint = () => {
      if (crowsDismissed) return;
      sceneTeardown?.();
      sceneTeardown = undefined;
      syncScene();
    };
    desktopMq.addEventListener("change", onBreakpoint);
    syncScene();
    const frame = requestAnimationFrame(syncScene);
    watchFaqEntry();

    const onScroll = () => {
      if (!crowsDismissed && faqEntered()) dismissCrows();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    cleanups.push(() => {
      cancelAnimationFrame(frame);
      if (entryRaf) cancelAnimationFrame(entryRaf);
      window.removeEventListener("scroll", onScroll);
      resizeObserver.disconnect();
      desktopMq.removeEventListener("change", onBreakpoint);
      sceneTeardown?.();
      scenesWrap.classList.remove("sd-faq-glyph-portal__birds--off");
    });
  }

  return () => cleanups.forEach((fn) => fn());
}
