"use client";

import { useMemo, useSyncExternalStore } from "react";
import { benefits } from "@/data/home.en";
import { MediaImage } from "@/components/ui/MediaImage";
import { ArcFeatureCarousel } from "@/components/carousel/ArcFeatureCarousel";
import { useMotionContext } from "@/motion/core/MotionContext";
import { motionMediaQueries } from "@/motion/config/tokens";

function subscribeDesktopMq(onChange: () => void): () => void {
  const mq = window.matchMedia(motionMediaQueries.desktop);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getDesktopMq(): boolean {
  return window.matchMedia(motionMediaQueries.desktop).matches;
}

function slugify(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export function BenefitsFeatureSequence() {
  const { enabled, enhanced, reducedMotion } = useMotionContext();
  const desktop = useSyncExternalStore(
    subscribeDesktopMq,
    getDesktopMq,
    () => false,
  );

  const arcItems = useMemo(
    () =>
      benefits.map((item) => ({
        id: slugify(item.title),
        title: item.title,
        body: item.body,
        image: item.image,
      })),
    [],
  );

  if (desktop && enhanced) {
    return (
      <div className="sd-benefits__arc" data-benefits-mode="arc">
        <ArcFeatureCarousel
          items={arcItems}
          motionEnabled={enabled}
          reducedMotion={reducedMotion}
          ariaLabel="Resort features"
        />
      </div>
    );
  }

  return (
    <div className="sd-benefits__static" data-benefits-mode="static">
      <div
        className="sd-benefits__strip"
        data-horizontal-track
        role="list"
      >
        {benefits.map((item, i) => (
          <article
            key={item.title}
            className="sd-benefit-card"
            role="listitem"
          >
            <div className="sd-benefit-card__media">
              <MediaImage
                src={item.image}
                alt=""
                sizes="(max-width: 991px) 80vw, 40vw"
              />
            </div>
            <div className="sd-benefit-card__grad" aria-hidden="true" />
            <div className="sd-benefit-card__index p5">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="sd-benefit-card__body">
              <h3 className="h5 sd-benefit-card__name">{item.title}</h3>
              <p className="p5 sd-benefit-card__desc">{item.body}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
