"use client";

import { gsap } from "@/motion/core/gsap";
import { DURATION } from "@/motion/config/tokens";

const COLS = 20;
const ROWS = 12;
const CELL_STAGGER = 0.03;
const CELL_DURATION = 0.4;
const OVERLAY_FADE = DURATION.SLOW;

export type AtmosphereTransitionHandle = {
  overlay: HTMLDivElement;
  playCover: () => Promise<void>;
  playUncover: () => Promise<void>;
  destroy: () => void;
};

/**
 * 20×12 grid wipe primitive (Phase 2A reference).
 * Not wired to homepage scroll — for future menu/route/scene transitions.
 */
export function createAtmosphereTransition(
  host: HTMLElement = document.body,
): AtmosphereTransitionHandle {
  const overlay = document.createElement("div");
  overlay.className = "sd-atmosphere-transition";
  overlay.setAttribute("aria-hidden", "true");
  overlay.style.pointerEvents = "none";

  const grid = document.createElement("div");
  grid.className = "sd-atmosphere-transition__grid";
  overlay.appendChild(grid);

  const cells: HTMLDivElement[] = [];
  for (let i = 0; i < COLS * ROWS; i++) {
    const cell = document.createElement("div");
    cell.className = "sd-atmosphere-transition__cell";
    grid.appendChild(cell);
    cells.push(cell);
  }

  host.appendChild(overlay);

  gsap.set(overlay, { opacity: 1 });
  gsap.set(cells, { scaleX: 0, transformOrigin: "left center" });

  const playCover = () =>
    new Promise<void>((resolve) => {
      gsap.set(overlay, { opacity: 1, pointerEvents: "auto" });
      gsap.to(cells, {
        scaleX: 1,
        duration: CELL_DURATION,
        ease: "InOut",
        stagger: CELL_STAGGER,
        onComplete: () => resolve(),
      });
    });

  const playUncover = () =>
    new Promise<void>((resolve) => {
      gsap.to(cells, {
        scaleX: 0,
        duration: CELL_DURATION,
        ease: "InOut",
        stagger: CELL_STAGGER,
        transformOrigin: "right center",
        onComplete: () => {
          gsap.to(overlay, {
            opacity: 0,
            duration: OVERLAY_FADE,
            ease: "Out",
            onComplete: () => {
              overlay.style.pointerEvents = "none";
              resolve();
            },
          });
        },
      });
    });

  const destroy = () => {
    gsap.killTweensOf(cells);
    gsap.killTweensOf(overlay);
    overlay.remove();
  };

  return { overlay, playCover, playUncover, destroy };
}
