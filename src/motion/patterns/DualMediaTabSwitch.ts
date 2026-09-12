"use client";

import { gsap } from "@/motion/core/gsap";
import { DURATION, motionMediaQueries } from "@/motion/config/tokens";
import { logMotionDebug } from "@/motion/core/splitTextUtils";

export type DualMediaTabSwitchConfig = {
  root: HTMLElement;
  duration?: number;
  debug?: boolean;
};

export type DualMediaTabSwitchHandle = {
  switchTo: (id: string, onSettled?: () => void) => void;
  getActiveId: () => string | null;
  cleanup: () => void;
};

/**
 * Two-state media + copy switch (reference seasons / initTabsText + crossfade).
 */
export function bindDualMediaTabSwitch(
  config: DualMediaTabSwitchConfig,
): DualMediaTabSwitchHandle {
  const { root, duration = DURATION.SLOW, debug = false } = config;

  const triggers = [
    ...root.querySelectorAll<HTMLElement>("[data-tab-trigger]"),
  ];
  const mediaLayers = [
    ...root.querySelectorAll<HTMLElement>("[data-tab-media]"),
  ];
  const copyPanels = [
    ...root.querySelectorAll<HTMLElement>("[data-tab-panel]"),
  ];

  let activeId =
    triggers.find((t) => t.classList.contains("is-active"))?.dataset
      .tabTrigger ??
    mediaLayers[0]?.dataset.tabMedia ??
    null;
  let animating = false;

  mediaLayers.forEach((layer) => {
    const on = layer.dataset.tabMedia === activeId;
    gsap.set(layer, { opacity: on ? 1 : 0, scale: on ? 1 : 1.04 });
  });

  copyPanels.forEach((panel) => {
    const on = panel.dataset.tabPanel === activeId;
    gsap.set(panel, {
      display: on ? "block" : "none",
      opacity: on ? 1 : 0,
      yPercent: on ? 0 : 8,
    });
  });

  const switchTo = (nextId: string, onSettled?: () => void) => {
    if (!nextId || nextId === activeId || animating) {
      if (nextId === activeId) onSettled?.();
      return;
    }

    const outMedia = mediaLayers.find((m) => m.dataset.tabMedia === activeId);
    const inMedia = mediaLayers.find((m) => m.dataset.tabMedia === nextId);
    const outCopy = copyPanels.find((p) => p.dataset.tabPanel === activeId);
    const inCopy = copyPanels.find((p) => p.dataset.tabPanel === nextId);

    animating = true;
    triggers.forEach((t) => {
      t.classList.toggle("is-active", t.dataset.tabTrigger === nextId);
    });

    if (outMedia && inMedia) {
      gsap.killTweensOf([outMedia, inMedia]);
      gsap.to(outMedia, { opacity: 0, scale: 1.05, duration, ease: "InOut" });
      gsap.fromTo(
        inMedia,
        { opacity: 0, scale: 1.06 },
        { opacity: 1, scale: 1, duration, ease: "InOut" },
      );
    }

    if (outCopy && inCopy) {
      gsap.killTweensOf([outCopy, inCopy]);
      gsap.to(outCopy, {
        opacity: 0,
        yPercent: -6,
        duration: duration * 0.55,
        ease: "In",
        onComplete: () => gsap.set(outCopy, { display: "none" }),
      });
      gsap.set(inCopy, { display: "block" });
      gsap.fromTo(
        inCopy,
        { opacity: 0, yPercent: 10 },
        {
          opacity: 1,
          yPercent: 0,
          duration,
          ease: "Out",
          delay: duration * 0.25,
          onComplete: () => {
            animating = false;
            activeId = nextId;
            onSettled?.();
            logMotionDebug(debug, "dual media tab settled", { activeId });
          },
        },
      );
    } else {
      animating = false;
      activeId = nextId;
      onSettled?.();
    }
  };

  root.dataset.dualMediaTabsReady = "true";

  const cleanup = () => {
    delete root.dataset.dualMediaTabsReady;
    delete (root as HTMLElement & { __dualMediaTabApi?: DualMediaTabSwitchHandle })
      .__dualMediaTabApi;
    mediaLayers.forEach((layer) =>
      gsap.set(layer, { clearProps: "opacity,transform" }),
    );
    copyPanels.forEach((panel) =>
      gsap.set(panel, { clearProps: "opacity,transform,display" }),
    );
  };

  const handle: DualMediaTabSwitchHandle = {
    switchTo,
    getActiveId: () => activeId,
    cleanup,
  };
  (
    root as HTMLElement & { __dualMediaTabApi?: DualMediaTabSwitchHandle }
  ).__dualMediaTabApi = handle;
  return handle;
}

export function bindDualMediaTabSwitchMatchMedia(
  config: DualMediaTabSwitchConfig,
): () => void {
  const mm = gsap.matchMedia();

  mm.add(motionMediaQueries.desktop, () => {
    const handle = bindDualMediaTabSwitch(config);
    (
      config.root as HTMLElement & { __dualMediaTabApi?: DualMediaTabSwitchHandle }
    ).__dualMediaTabApi = handle;
    return () => {
      handle.cleanup();
      delete (
        config.root as HTMLElement & {
          __dualMediaTabApi?: DualMediaTabSwitchHandle;
        }
      ).__dualMediaTabApi;
    };
  });

  return () => mm.revert();
}

export function getDualMediaTabSwitchHandle(
  root: HTMLElement,
): DualMediaTabSwitchHandle | null {
  return (
    (root as HTMLElement & { __dualMediaTabApi?: DualMediaTabSwitchHandle })
      .__dualMediaTabApi ?? null
  );
}
