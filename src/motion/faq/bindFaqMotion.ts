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
    let sceneTeardown: (() => void) | undefined;

    const syncScene = () => {
      if (sceneTeardown) return;
      const { width, height } = scenesWrap.getBoundingClientRect();
      if (width < 16 || height < 16) return;
      const mounted = mountFaqScene(canvas);
      if (mounted) sceneTeardown = mounted;
    };

    const resizeObserver = new ResizeObserver(() => syncScene());
    resizeObserver.observe(scenesWrap);
    const onBreakpoint = () => {
      sceneTeardown?.();
      sceneTeardown = undefined;
      syncScene();
    };
    desktopMq.addEventListener("change", onBreakpoint);
    syncScene();
    const frame = requestAnimationFrame(syncScene);

    cleanups.push(() => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      desktopMq.removeEventListener("change", onBreakpoint);
      sceneTeardown?.();
    });
  }

  return () => cleanups.forEach((fn) => fn());
}
