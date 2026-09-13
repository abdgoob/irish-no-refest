import { BREAKPOINT_DESKTOP } from "@/motion/config/tokens";
import { bindFaqAccordion } from "@/motion/faq/bindFaqAccordion";
import { bindFaqScrollReveals } from "@/motion/faq/bindFaqScrollReveals";
import { mountFaqScene } from "@/motion/faq/mountFaqScene";

export async function bindFaqMotion(root: HTMLElement): Promise<() => void> {
  const cleanups: Array<() => void> = [];

  cleanups.push(await bindFaqScrollReveals(root));
  cleanups.push(await bindFaqAccordion(root));

  const canvas = root.querySelector<HTMLCanvasElement>("[data-faq-scene]");
  const scenesWrap = root.querySelector<HTMLElement>(".sd-faq__scenes");

  if (canvas && scenesWrap) {
    const desktopMq = window.matchMedia(
      `(min-width: ${BREAKPOINT_DESKTOP}px)`,
    );
    let sceneTeardown: (() => void) | undefined;

    const syncScene = () => {
      if (!desktopMq.matches) {
        sceneTeardown?.();
        sceneTeardown = undefined;
        return;
      }
      if (sceneTeardown) return;
      const { width, height } = scenesWrap.getBoundingClientRect();
      if (width < 16 || height < 16) return;
      const mounted = mountFaqScene(canvas);
      if (mounted) sceneTeardown = mounted;
    };

    const resizeObserver = new ResizeObserver(() => syncScene());
    resizeObserver.observe(scenesWrap);
    desktopMq.addEventListener("change", syncScene);
    syncScene();
    requestAnimationFrame(() => syncScene());

    cleanups.push(() => {
      resizeObserver.disconnect();
      desktopMq.removeEventListener("change", syncScene);
      sceneTeardown?.();
    });
  }

  return () => cleanups.forEach((fn) => fn());
}
