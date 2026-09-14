"use client";

import { useRef } from "react";
import GlyphPortal from "@/components/ui/glyph-portal";
import { faq } from "@/data/restaurant/home";
import { registerGsapPlugins, useGSAP } from "@/motion/core/gsap";
import { useMotionContext } from "@/motion/core/MotionContext";
import { bindFaqMotion } from "@/motion/faq/bindFaqMotion";
import { whenFontsReady } from "@/motion/core/splitTextUtils";

const FAQ_DISPLAY_FONT = '"KTF Metro Roman", "Times New Roman", serif';

export function FaqSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { enhanced, ready } = useMotionContext();
  const motionActive = enhanced && ready;

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root || !enhanced || !ready) return;

      registerGsapPlugins();
      let disposed = false;
      let teardown: (() => void) | undefined;

      void (async () => {
        await whenFontsReady();
        if (disposed || !sectionRef.current) return;
        const cleanup = await bindFaqMotion(sectionRef.current);
        if (disposed) cleanup();
        else teardown = cleanup;
      })();

      return () => {
        disposed = true;
        teardown?.();
      };
    },
    { scope: sectionRef, dependencies: [enhanced, ready], revertOnUpdate: true },
  );

  return (
    <div
      ref={sectionRef}
      className="sd-section sd-faq theme-dark"
      data-theme="dark"
      data-header-theme="dark"
    >
      <GlyphPortal
        id="faq"
        word="FAQ"
        focusChar="A"
        className="sd-faq-glyph-portal"
        scrollLength={2.2}
        scrollLeadVh={0.55}
        interactive={motionActive}
        annotations={false}
        enterLabel="Keep scrolling"
        fontFamily={FAQ_DISPLAY_FONT}
        fontWeight={400}
        letterSpacing="1.22em"
        style={{
          "--gp-paper": "#2c2824",
          "--gp-ink": "#a89474",
          "--gp-field": "#a89474",
          "--gp-foreground": "#2c2824",
        }}
        background={
          <div className="sd-faq-glyph-portal__birds" data-faq-scene-bounds>
            <canvas className="sd-faq__scene-canvas scene" data-faq-scene="" />
          </div>
        }
        front={
          <div className="sd-faq-glyph-portal__front">
            <div className="sd-grid-12 sd-faq-glyph-portal__title-grid">
              <p className="p6 sd-faq-glyph-portal__lead sd-faq__title-desc sd-faq__title-desc--1">
                {faq.titleLead}
                <br />
                {faq.titleTail}
              </p>
              <p className="p6 sd-faq-glyph-portal__subtitle sd-faq__title-desc sd-faq__title-desc--2 sd-only-desk">
                {faq.subtitle}
              </p>
            </div>
          </div>
        }
      >
        <div className="sd-faq-glyph-portal__after" aria-hidden="true" />
      </GlyphPortal>
    </div>
  );
}
