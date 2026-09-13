"use client";

import { useRef } from "react";
import { gallerySlides } from "@/data/gallerySlides";
import { MediaImage } from "@/components/ui/MediaImage";
import {
  registerGsapPlugins,
  ScrollTrigger,
  useGSAP,
} from "@/motion/core/gsap";
import { useMotionContext } from "@/motion/core/MotionContext";
import { bindGalleryScrollSequenceMatchMedia } from "@/motion/patterns/GalleryScrollSequence";
import { logMotionDebug } from "@/motion/core/splitTextUtils";

export function GalleryScrollScene() {
  const runwayRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const { enhanced, ready, debug } = useMotionContext();

  useGSAP(
    () => {
      const wrapper = runwayRef.current;
      const stage = stageRef.current;
      if (!wrapper || !stage) return;

      if (!enhanced || !ready) {
        wrapper.dataset.galleryMode = "static";
        return;
      }

      registerGsapPlugins();
      wrapper.dataset.galleryMode = "static";

      const slides = [
        ...wrapper.querySelectorAll<HTMLElement>("[data-gallery-slide]"),
      ];
      const thumbs = [
        ...wrapper.querySelectorAll<HTMLElement>("[data-gallery-thumb]"),
      ];
      const overlay = wrapper.querySelector<HTMLElement>(
        "[data-gallery-overlay]",
      );

      const unbind = bindGalleryScrollSequenceMatchMedia({
        wrapper,
        stage,
        slides,
        thumbs,
        overlay: overlay ?? undefined,
        debug,
      });

      if (debug) {
        logMotionDebug(true, "gallery sequence active", {
          scrollTriggers: ScrollTrigger.getAll().length,
          slides: slides.length,
        });
      }

      return () => {
        unbind();
        wrapper.dataset.galleryMode = "static";
      };
    },
    { scope: runwayRef, dependencies: [enhanced, ready, debug] },
  );

  return (
    <div
      ref={runwayRef}
      className="sd-gallery__runway"
      data-gallery-runway
      data-gallery-mode="static"
    >
      <div ref={stageRef} className="sd-gallery__stage" data-gallery-stage>
        <div className="sd-gallery__feature-stack">
          {gallerySlides.map((slide, i) => (
            <div
              key={slide.id}
              className="sd-gallery__slide"
              data-gallery-slide
              aria-hidden={i !== 0}
            >
              <div className="sd-gallery__feature" data-gallery-media>
                <MediaImage
                  src={slide.src}
                  alt={slide.alt}
                  sizes="100vw"
                  priority={i === 0}
                />
              </div>
              <div className="sd-gallery__feature-grad" aria-hidden="true" />
            </div>
          ))}
        </div>

        <div
          className="sd-container sd-gallery__overlay"
          data-gallery-overlay
        >
          <p className="p3">PROJECT</p>
          <h2 className="h1 sd-gallery__title">SON DAVEN</h2>
          <p className="p4 sd-gallery__lead">
            Son Daven is designed to restore energy, deliver profit, inspire, and
            prove that true relaxation is not a place—it’s a state of mind. See
            you in Son Daven.
          </p>
        </div>
      </div>

      <div className="sd-container">
        <div className="sd-gallery__thumbs">
          {gallerySlides.map((slide, i) => (
            <div
              key={`thumb-${slide.id}`}
              className="sd-gallery__thumb"
              data-gallery-thumb
              data-index={i}
            >
              <MediaImage src={slide.src} alt="" sizes="25vw" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
