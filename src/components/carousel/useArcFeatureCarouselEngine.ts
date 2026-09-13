"use client";

import { useEffect, type RefObject } from "react";
import { ARC_FEATURE_CAROUSEL_DEFAULTS } from "@/components/carousel/arcFeatureCarousel.config";
import type {
  ArcFeatureCarouselConfig,
  ArcGeometry,
} from "@/components/carousel/arcFeatureCarousel.types";

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function computeArcGeometry(
  stageWidth: number,
  stageHeight: number,
  config: Required<ArcFeatureCarouselConfig>,
): ArcGeometry {
  const cardWidth = clamp(
    stageWidth * config.cardRatio,
    config.minCardWidth,
    config.maxCardWidth,
  );
  const cardHeight = cardWidth / config.cardAspect;
  const radius = Math.max(
    stageWidth * config.radiusRatio,
    cardWidth * 4.2,
  );
  const step = (cardWidth * (1 - config.overlap)) / radius;
  const centerX = stageWidth / 2;
  const centerY = stageHeight * config.arcOffset + radius;

  return {
    stageWidth,
    stageHeight,
    cardWidth,
    cardHeight,
    radius,
    step,
    centerX,
    centerY,
    visibleMaxAngle: config.visibleMaxAngle,
  };
}

type EngineOptions = {
  stageRef: RefObject<HTMLElement | null>;
  discRef: RefObject<HTMLElement | null>;
  itemCount: number;
  config?: ArcFeatureCarouselConfig;
  motionEnabled: boolean;
  reducedMotion: boolean;
};

export function useArcFeatureCarouselEngine({
  stageRef,
  discRef,
  itemCount,
  config: userConfig,
  motionEnabled,
  reducedMotion,
}: EngineOptions): void {
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || itemCount === 0) return;

    const config: Required<ArcFeatureCarouselConfig> = {
      ...ARC_FEATURE_CAROUSEL_DEFAULTS,
      ...userConfig,
    };

    if (reducedMotion) {
      config.autoRotateSpeed = 0;
      config.momentum = 0.35;
      config.smoothing = 12;
    }

    let geometry = computeArcGeometry(
      stage.clientWidth,
      stage.clientHeight,
      config,
    );

    let wheelTarget = 0;
    let wheelCurrent = 0;
    const cardWheel = new Float64Array(itemCount);
    cardWheel.fill(0);

    let velocity = 0;
    let dragging = false;
    let pointerId: number | null = null;
    let lastPointerX = 0;
    let lastMoveTime = 0;
    let hoverPause = false;
    let raf = 0;
    let lastFrame = performance.now();

    const applyGeometryVars = () => {
      stage.style.setProperty("--arc-card-w", `${geometry.cardWidth}px`);
      stage.style.setProperty("--arc-card-h", `${geometry.cardHeight}px`);
      stage.style.setProperty("--arc-radius", `${geometry.radius}px`);
      stage.style.setProperty("--arc-cx", `${geometry.centerX}px`);
      stage.style.setProperty("--arc-cy", `${geometry.centerY}px`);

      const disc = discRef.current;
      if (disc) {
        const d = geometry.radius * 2;
        disc.style.width = `${d}px`;
        disc.style.height = `${d}px`;
        disc.style.left = `${geometry.centerX - geometry.radius}px`;
        disc.style.top = `${geometry.centerY - geometry.radius}px`;
      }
    };

    const layoutCards = () => {
      const cardEls = stage.querySelectorAll<HTMLElement>("[data-arc-card]");

      for (let i = 0; i < itemCount; i++) {
        const el = cardEls[i];
        if (!el) continue;

        const angle = (i - cardWheel[i]) * geometry.step;
        const absAngle = Math.abs(angle);
        const visible = absAngle <= geometry.visibleMaxAngle;

        if (!visible) {
          el.style.opacity = "0";
          el.style.pointerEvents = "none";
          continue;
        }

        const x =
          geometry.centerX + Math.sin(angle) * geometry.radius - geometry.cardWidth / 2;
        const y =
          geometry.centerY - Math.cos(angle) * geometry.radius - geometry.cardHeight / 2;
        const rotDeg = (angle * 180) / Math.PI;
        const dist = Math.abs(i - wheelCurrent);
        const scale = clamp(1.04 - dist * 0.045 - absAngle * 0.06, 0.78, 1.04);
        const opacity = clamp(1 - (absAngle / geometry.visibleMaxAngle) * 0.55, 0.35, 1);

        el.style.opacity = String(opacity);
        el.style.pointerEvents = opacity > 0.5 ? "auto" : "none";
        el.style.zIndex = String(1000 - Math.round(dist * 20 + absAngle * 40));
        el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rotDeg}deg) scale(${scale})`;

        const active = dist < 0.45;
        el.dataset.arcActive = active ? "true" : "false";
      }
    };

    const tick = (now: number) => {
      const dt = clamp((now - lastFrame) / 1000, 0.001, 0.05);
      lastFrame = now;

      if (
        motionEnabled &&
        !reducedMotion &&
        config.autoRotateSpeed > 0 &&
        !dragging &&
        !hoverPause
      ) {
        wheelTarget += config.autoRotateSpeed * dt;
      }

      if (!dragging && Math.abs(velocity) > 0.0005) {
        wheelTarget += velocity * dt * 60;
        velocity *= 0.92;
      }

      const masterAlpha = 1 - Math.exp(-config.smoothing * dt);
      wheelCurrent += (wheelTarget - wheelCurrent) * masterAlpha;

      for (let i = 0; i < itemCount; i++) {
        const dist = Math.abs(i - wheelCurrent);
        const lag = config.smoothing / (1 + dist * 0.55);
        const alpha = 1 - Math.exp(-lag * dt);
        cardWheel[i] += (wheelCurrent - cardWheel[i]) * alpha;
      }

      layoutCards();
      raf = requestAnimationFrame(tick);
    };

    const onResize = () => {
      geometry = computeArcGeometry(
        stage.clientWidth,
        stage.clientHeight,
        config,
      );
      applyGeometryVars();
      layoutCards();
    };

    const ro = new ResizeObserver(onResize);
    ro.observe(stage);
    applyGeometryVars();
    layoutCards();
    raf = requestAnimationFrame(tick);

    const onPointerDown = (e: PointerEvent) => {
      if (!motionEnabled) return;
      dragging = true;
      pointerId = e.pointerId;
      lastPointerX = e.clientX;
      lastMoveTime = performance.now();
      velocity = 0;
      stage.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== pointerId) return;
      const dx = e.clientX - lastPointerX;
      const now = performance.now();
      const dt = Math.max(now - lastMoveTime, 1);
      wheelTarget -= (dx / geometry.cardWidth) * config.dragSensitivity;
      velocity = clamp(
        (-dx / geometry.cardWidth) * config.dragSensitivity * (16 / dt) * 0.08 * config.momentum,
        -2.5,
        2.5,
      );
      lastPointerX = e.clientX;
      lastMoveTime = now;
    };

    const endDrag = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return;
      dragging = false;
      pointerId = null;
      try {
        stage.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (!motionEnabled) return;
      const absX = Math.abs(e.deltaX);
      const absY = Math.abs(e.deltaY);
      if (absX <= absY * 0.65 && absY > 2) return;

      e.preventDefault();
      const delta = absX >= absY ? e.deltaX : e.deltaY;
      wheelTarget += (delta / geometry.cardWidth) * config.dragSensitivity * 0.35;
      velocity = clamp(
        (delta / geometry.cardWidth) * config.dragSensitivity * 0.02,
        -1.2,
        1.2,
      );
    };

    const onEnter = () => {
      if (config.pauseOnHover) hoverPause = true;
    };
    const onLeave = () => {
      hoverPause = false;
    };

    stage.addEventListener("pointerdown", onPointerDown);
    stage.addEventListener("pointermove", onPointerMove);
    stage.addEventListener("pointerup", endDrag);
    stage.addEventListener("pointercancel", endDrag);
    stage.addEventListener("wheel", onWheel, { passive: false });
    stage.addEventListener("mouseenter", onEnter);
    stage.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      stage.removeEventListener("pointerdown", onPointerDown);
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerup", endDrag);
      stage.removeEventListener("pointercancel", endDrag);
      stage.removeEventListener("wheel", onWheel);
      stage.removeEventListener("mouseenter", onEnter);
      stage.removeEventListener("mouseleave", onLeave);
    };
  }, [stageRef, discRef, itemCount, userConfig, motionEnabled, reducedMotion]);
}
