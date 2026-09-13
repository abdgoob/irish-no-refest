"use client";

import { useRef } from "react";
import { images, svg } from "@/data/assets";
import { site } from "@/data/home.en";
import { ButtonPill } from "@/components/ui/ButtonPill";
import { MediaImage } from "@/components/ui/MediaImage";
import { ThemeTransition } from "@/components/ui/ThemeTransition";
import {
  registerGsapPlugins,
  useGSAP,
} from "@/motion/core/gsap";
import { useMotionContext } from "@/motion/core/MotionContext";
import { bindStickyAtmosphereScrollBlockMatchMedia } from "@/motion/patterns/StickyAtmosphereScrollBlock";

export function CtaScrollScene({
  onConsultationOpen,
}: {
  onConsultationOpen: () => void;
}) {
  const runwayRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const { enhanced, ready } = useMotionContext();

  useGSAP(
    () => {
      const wrapper = runwayRef.current;
      const stage = stageRef.current;
      if (!wrapper || !stage) return;

      if (!enhanced || !ready) {
        wrapper.dataset.ctaMode = "static";
        return;
      }

      registerGsapPlugins();
      wrapper.dataset.ctaMode = "static";

      const atmosphere = wrapper.querySelector<HTMLElement>(
        "[data-atmosphere-layer]",
      );
      const content = wrapper.querySelector<HTMLElement>("[data-cta-content]");
      if (!atmosphere) return;

      const unbind = bindStickyAtmosphereScrollBlockMatchMedia({
        wrapper,
        stage,
        atmosphere,
        content: content ?? undefined,
      });

      return () => {
        unbind();
        wrapper.dataset.ctaMode = "static";
      };
    },
    { scope: runwayRef, dependencies: [enhanced, ready] },
  );

  return (
    <section
      id="cta"
      className="sd-section sd-cta theme-inverted"
      data-theme="inverted"
      data-header-theme="inverted"
    >
      <div
        ref={runwayRef}
        className="sd-cta__runway"
        data-cta-runway
        data-cta-mode="static"
      >
        <div ref={stageRef} className="sd-cta__stage" data-cta-stage>
          <div className="sd-cta__bg" data-atmosphere-layer>
            <MediaImage src={images.commissioning.render} alt="" sizes="100vw" />
          </div>
          <div className="sd-cta__veil" aria-hidden="true" />

          <div className="sd-cta__transition sd-cta__transition--top">
            <ThemeTransition src={svg.transitionDarkTop} />
          </div>

          <div
            className="sd-container sd-cta__content"
            data-cta-content
          >
            <div className="sd-grid-12">
              <div className="sd-col-5-9 sd-cta__cluster">
                <p className="p6 sd-cta__lead">
                  Each investor becomes a co-owner of a premium design hotel that
                  redefines the concept of leisure, elevating it to a level of
                  sensations, aesthetics, and meaning.
                </p>
                <h2 className="h2 sd-cta__headline">BECOME PART OF THE LEGEND</h2>
                <ButtonPill onClick={onConsultationOpen}>Consultation</ButtonPill>
                <div className="sd-cta__contacts">
                  <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="p5">
                    {site.phone}
                  </a>
                  <a href={`mailto:${site.email}`} className="p5">
                    {site.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="sd-cta__transition sd-cta__transition--bot">
            <ThemeTransition src={svg.transitionDarkBot} />
          </div>
        </div>
      </div>
    </section>
  );
}
