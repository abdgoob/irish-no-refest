"use client";

import { useRef, useSyncExternalStore, type ReactNode } from "react";
import { heroSceneConfig, getActiveHeroLayers } from "@/data/hero-assets";
import { motionMediaQueries, SCRUB } from "@/motion/config/tokens";
import { gsap, useGSAP, registerGsapPlugins } from "@/motion/core/gsap";
import { useMotionContext } from "@/motion/core/MotionContext";
import { ScrollFrameCanvas } from "@/motion/hero/ScrollFrameCanvas";
import {
  HeroSceneLayers,
  bindAmbientMedia,
} from "@/motion/hero/HeroSceneLayers";

function subscribeDesktop(onChange: () => void) {
  const mq = window.matchMedia(motionMediaQueries.desktop);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getDesktopSnapshot() {
  return window.matchMedia(motionMediaQueries.desktop).matches;
}

export function HeroScrollScene({
  fallback,
  children,
}: {
  fallback: ReactNode;
  children: ReactNode;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const uiRef = useRef<HTMLDivElement>(null);
  const debugRef = useRef<HTMLParagraphElement>(null);
  const { enhanced, debug } = useMotionContext();
  const desktop = useSyncExternalStore(
    subscribeDesktop,
    getDesktopSnapshot,
    () => false,
  );

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      root.dataset.heroMode = enhanced
        ? desktop
          ? "desktop"
          : "mobile"
        : "static";

      if (!enhanced) {
        root.style.height = "";
        return;
      }

      registerGsapPlugins();
      root.style.height = desktop
        ? heroSceneConfig.desktopRunway
        : heroSceneConfig.mobileRunway;

      const mm = gsap.matchMedia();

      mm.add(motionMediaQueries.desktop, () => {
        const canvasEl = canvasRef.current;
        const media = mediaRef.current;
        const ui = uiRef.current;
        if (!canvasEl || !media || !ui) return;

        const renderer = new ScrollFrameCanvas(canvasEl, {
          urls: heroSceneConfig.frames,
          onFirstFrame: () => {
            canvasEl.dataset.ready = "true";
          },
        });

        void renderer.start();

        const state = { frame: 0 };
        gsap.to(state, {
          frame: Math.max(0, renderer.frameCount - 1),
          ease: "none",
          snap: "frame",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            // Map the 120 frames across the full pin. Ending at 75% bottom
            // finished the pullback too early and left a long static hold.
            end: "bottom bottom",
            scrub: SCRUB.HERO,
          },
          onUpdate: () => {
            renderer.draw(state.frame);
            if (debug && debugRef.current) {
              debugRef.current.textContent = `hero desktop · frame ${Math.round(state.frame)}/${renderer.frameCount - 1} · loaded ${renderer.loadedCount}`;
            }
          },
        });

        gsap.to(ui, {
          scale: 0.5,
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "70% bottom",
            scrub: SCRUB.HERO,
          },
        });

        const exit = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "70% bottom",
            end: "bottom bottom",
            scrub: SCRUB.STANDARD,
          },
        });
        // Live scales .hero-w to 0.3 over a separate 1800px overlay canvas.
        // That overlay needs the hotel threshold compositor; without it the
        // body taupe (#a89474) reads as an empty field around a tiny postcard.
        // Frame-only mode stays full-bleed, then dissolves into the brown
        // stage (same as Prologue) as the sticky pin releases.
        exit.to(ui, { opacity: 0, ease: "Out", duration: 0.45 }, 0);
        exit.to(media, { opacity: 0, ease: "Out", duration: 0.55 }, 0.45);

        const activeLayers = getActiveHeroLayers(heroSceneConfig);
        activeLayers.forEach((layer) => {
          if (!layer.parallaxX) return;
          const el = root.querySelector(`[data-hero-layer="${layer.id}"]`);
          if (!el) return;
          gsap.fromTo(
            el,
            { x: layer.parallaxX.from },
            {
              x: layer.parallaxX.to,
              ease: "none",
              scrollTrigger: {
                trigger: root,
                start: "top bottom",
                end: "bottom 50%",
                scrub: true,
              },
            },
          );
        });

        const unbindMedia = bindAmbientMedia(root);

        return () => {
          unbindMedia();
          renderer.destroy();
          canvasEl.dataset.ready = "false";
        };
      });

      mm.add(motionMediaQueries.mobile, () => {
        const media = mediaRef.current;
        const ui = uiRef.current;
        if (!media || !ui) return;

        gsap.to(ui, {
          scale: 0.78,
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "70% bottom",
            scrub: SCRUB.HERO,
          },
        });

        const exit = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "70% bottom",
            end: "bottom bottom",
            scrub: SCRUB.STANDARD,
          },
        });
        exit.to(ui, { opacity: 0, ease: "Out", duration: 0.45 }, 0);
        exit.to(media, { opacity: 0, ease: "Out", duration: 0.55 }, 0.45);
      });

      return () => {
        mm.revert();
        root.style.height = "";
      };
    },
    { scope: rootRef, dependencies: [enhanced, debug, desktop] },
  );

  return (
    <section
      id="hero"
      ref={rootRef}
      className="sd-hero-runway theme-dark"
      data-hero-mode="static"
      data-header-theme="dark"
    >
      <a className="sd-skip-hero" href="#prolog">
        Skip to content
      </a>
      <div className="sd-hero-stage">
        <div ref={mediaRef} className="sd-hero__media" data-hero-media>
          {fallback}
          <canvas
            ref={canvasRef}
            className="sd-hero__frames"
            aria-hidden
            data-ready="false"
          />
          {enhanced && desktop && getActiveHeroLayers(heroSceneConfig).length > 0 ? (
            <HeroSceneLayers
              layers={getActiveHeroLayers(heroSceneConfig)}
              desktop
            />
          ) : null}
        </div>
        <div ref={uiRef} className="sd-hero__ui" data-hero-ui>
          {children}
        </div>
        {debug ? (
          <p ref={debugRef} className="sd-hero__debug" aria-hidden>
            hero debug
          </p>
        ) : null}
      </div>
    </section>
  );
}
