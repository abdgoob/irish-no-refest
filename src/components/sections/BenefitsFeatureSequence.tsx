"use client";

import { useRef } from "react";
import { benefits } from "@/data/home.en";
import { images } from "@/data/assets";
import { MediaImage } from "@/components/ui/MediaImage";
import {
  registerGsapPlugins,
  ScrollTrigger,
  useGSAP,
} from "@/motion/core/gsap";
import { useMotionContext } from "@/motion/core/MotionContext";
import { bindHorizontalFeatureSequenceMatchMedia } from "@/motion/patterns/HorizontalFeatureSequence";
import { logMotionDebug } from "@/motion/core/splitTextUtils";

export function BenefitsFeatureSequence() {
  const runwayRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { enhanced, ready, debug } = useMotionContext();

  useGSAP(
    () => {
      const wrapper = runwayRef.current;
      const stage = stageRef.current;
      const track = trackRef.current;
      if (!wrapper || !stage || !track) return;

      if (!enhanced || !ready) {
        wrapper.dataset.benefitsMode = "static";
        return;
      }

      registerGsapPlugins();
      wrapper.dataset.benefitsMode = "desktop-sequence";

      const items = [
        ...track.querySelectorAll<HTMLElement>("[data-feature-item]"),
      ];

      const unbind = bindHorizontalFeatureSequenceMatchMedia({
        wrapper,
        stage,
        track,
        items,
        debug,
      });

      if (debug) {
        const stCount = ScrollTrigger.getAll().length;
        logMotionDebug(true, "benefits sequence active", {
          scrollTriggers: stCount,
          cards: items.length,
        });
      }

      return () => {
        unbind();
        wrapper.dataset.benefitsMode = "static";
      };
    },
    { scope: runwayRef, dependencies: [enhanced, ready, debug] },
  );

  return (
    <>
      <div className="sd-benefits__intro sd-container">
        <div className="sd-benefits__intro-img">
          <MediaImage src={images.benefits.intro} alt="" sizes="100vw" />
        </div>
      </div>

      <div
        ref={runwayRef}
        className="sd-benefits__horiz-runway"
        data-benefits-runway
        data-benefits-mode="static"
      >
        <div
          ref={stageRef}
          className="sd-benefits__horiz-stage"
          data-benefits-stage
        >
          <div
            ref={trackRef}
            className="sd-benefits__strip"
            data-horizontal-track
            role="list"
          >
            {benefits.map((item, i) => (
              <article
                key={item.title}
                className="sd-benefit-card"
                role="listitem"
                data-feature-item
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
      </div>
    </>
  );
}
