"use client";

import { useRef } from "react";
import { MediaImage } from "@/components/ui/MediaImage";
import type {
  ArcFeatureCarouselConfig,
  ArcFeatureItem,
} from "@/components/carousel/arcFeatureCarousel.types";
import { useArcFeatureCarouselEngine } from "@/components/carousel/useArcFeatureCarouselEngine";

export type ArcFeatureCarouselProps = {
  items: ArcFeatureItem[];
  config?: ArcFeatureCarouselConfig;
  /** When false, wheel stays at 0 and interaction is off (kill switch / SSR). */
  motionEnabled?: boolean;
  reducedMotion?: boolean;
  className?: string;
  ariaLabel?: string;
};

export function ArcFeatureCarousel({
  items,
  config,
  motionEnabled = true,
  reducedMotion = false,
  className = "",
  ariaLabel = "Feature carousel",
}: ArcFeatureCarouselProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const discRef = useRef<HTMLDivElement>(null);

  useArcFeatureCarouselEngine({
    stageRef,
    discRef,
    itemCount: items.length,
    config,
    motionEnabled,
    reducedMotion,
  });

  return (
    <div
      className={`sd-arc-carousel ${className}`.trim()}
      data-arc-carousel
    >
      <div
        ref={stageRef}
        className="sd-arc-carousel__stage"
        role="region"
        aria-label={ariaLabel}
        aria-roledescription="carousel"
      >
        <div
          ref={discRef}
          className="sd-arc-carousel__disc"
          aria-hidden="true"
        />
        {items.map((item, index) => (
          <article
            key={item.id}
            className="sd-benefit-card sd-arc-carousel__card"
            data-arc-card
            data-arc-active="false"
            style={{ width: "var(--arc-card-w)", height: "var(--arc-card-h)" }}
          >
            <div className="sd-benefit-card__media">
              <MediaImage
                src={item.image}
                alt=""
                sizes="(max-width: 991px) 80vw, 360px"
              />
            </div>
            <div className="sd-benefit-card__grad" aria-hidden="true" />
            <div className="sd-benefit-card__index p5">
              {String(index + 1).padStart(2, "0")}
            </div>
            <div className="sd-benefit-card__body">
              <h3 className="h5 sd-benefit-card__name">{item.title}</h3>
              <p className="p5 sd-benefit-card__desc">{item.body}</p>
            </div>
          </article>
        ))}
      </div>
      <p className="sd-arc-carousel__hint p5" aria-hidden="true">
        Drag or scroll horizontally to browse
      </p>
    </div>
  );
}
