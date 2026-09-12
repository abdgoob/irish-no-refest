"use client";

import { gsap } from "@/motion/core/gsap";
import { DURATION, motionMediaQueries } from "@/motion/config/tokens";
import { logMotionDebug } from "@/motion/core/splitTextUtils";

function getTabPanelMotion(): { travel: number; rotate: number } {
  if (typeof window === "undefined") {
    return { travel: 125, rotate: 15 };
  }
  return window.matchMedia(motionMediaQueries.desktop).matches
    ? { travel: 125, rotate: 15 }
    : { travel: 42, rotate: 4 };
}

export type CategoryTabPanelConfig = {
  root: HTMLElement;
  duration?: number;
  debug?: boolean;
};

export type CategoryTabPanelHandle = {
  switchTo: (id: string, onSettled?: () => void) => void;
  getActiveId: () => string | null;
  cleanup: () => void;
};

/**
 * Panel swap with directional slide + tilt (reference initTabs).
 * Content-agnostic — menu categories, room types, etc.
 */
export function bindCategoryTabPanel(
  config: CategoryTabPanelConfig,
): CategoryTabPanelHandle {
  const { root, duration = DURATION.SLOW, debug = false } = config;

  const triggers = [
    ...root.querySelectorAll<HTMLElement>("[data-tab-trigger]"),
  ];
  const panels = [
    ...root.querySelectorAll<HTMLElement>("[data-tab-panel]"),
  ];
  const stage =
    root.querySelector<HTMLElement>("[data-category-stage]") ?? root;

  let activeId =
    triggers.find((t) => t.classList.contains("is-active"))?.dataset
      .tabTrigger ??
    panels[0]?.dataset.tabPanel ??
    null;
  let animating = false;

  if (panels.length >= 1) {
    gsap.set(stage, { position: "relative", overflow: "hidden" });
    panels.forEach((panel) => {
      const isActive = panel.dataset.tabPanel === activeId;
      gsap.set(panel, {
        display: isActive ? "block" : "none",
        position: isActive ? "relative" : "absolute",
        top: 0,
        left: 0,
        width: "100%",
        xPercent: 0,
        rotate: 0,
        transformOrigin: "top bottom",
      });
    });
  }

  const switchTo = (nextId: string, onSettled?: () => void) => {
    if (!nextId || nextId === activeId || animating || panels.length < 2) {
      if (nextId === activeId) onSettled?.();
      return;
    }

    const outgoing = panels.find((p) => p.dataset.tabPanel === activeId);
    const incoming = panels.find((p) => p.dataset.tabPanel === nextId);
    if (!outgoing || !incoming) return;

    animating = true;

    triggers.forEach((t) => {
      t.classList.toggle("is-active", t.dataset.tabTrigger === nextId);
    });

    gsap.killTweensOf([outgoing, incoming]);

    gsap.set(outgoing, {
      display: "block",
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      xPercent: 0,
      rotate: 0,
    });
    const { travel, rotate } = getTabPanelMotion();

    gsap.set(incoming, {
      display: "block",
      position: "relative",
      xPercent: travel,
      rotate: -rotate,
      transformOrigin: "top bottom",
    });

    gsap.to(outgoing, {
      xPercent: -travel,
      rotate,
      duration,
      ease: "InOut",
      onComplete: () => {
        gsap.set(outgoing, { display: "none", xPercent: 0, rotate: 0 });
      },
    });

    gsap.to(incoming, {
      xPercent: 0,
      rotate: 0,
      duration,
      ease: "InOut",
      onComplete: () => {
        animating = false;
        activeId = nextId;
        onSettled?.();
        logMotionDebug(debug, "category tab settled", { activeId });
      },
    });
  };

  root.dataset.categoryTabsReady = "true";

  const cleanup = () => {
    delete root.dataset.categoryTabsReady;
    delete (root as HTMLElement & { __categoryTabApi?: CategoryTabPanelHandle })
      .__categoryTabApi;
    panels.forEach((panel) => {
      gsap.set(panel, {
        clearProps: "transform,display,position,top,left,width",
      });
    });
    gsap.set(stage, { clearProps: "overflow" });
  };

  const handle: CategoryTabPanelHandle = {
    switchTo,
    getActiveId: () => activeId,
    cleanup,
  };
  (
    root as HTMLElement & { __categoryTabApi?: CategoryTabPanelHandle }
  ).__categoryTabApi = handle;

  return handle;
}

export function getCategoryTabPanelHandle(
  root: HTMLElement,
): CategoryTabPanelHandle | null {
  return (
    (root as HTMLElement & { __categoryTabApi?: CategoryTabPanelHandle })
      .__categoryTabApi ?? null
  );
}
