"use client";

import { useRef, useState } from "react";
import { faq } from "@/data/restaurant/home";
import { gsap, registerGsapPlugins, ScrollTrigger, useGSAP } from "@/motion/core/gsap";
import { DURATION } from "@/motion/config/tokens";
import { useMotionContext } from "@/motion/core/MotionContext";
import { bindFaqMotion } from "@/motion/faq/bindFaqMotion";
import { whenFontsReady } from "@/motion/core/splitTextUtils";

function FaqPlusIcon({ vertical = false }: { vertical?: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      {vertical ? (
        <path d="M11 5H13V19H11V5Z" fill="currentColor" />
      ) : (
        <path d="M19 11V13H5V11H19Z" fill="currentColor" />
      )}
    </svg>
  );
}

export function FaqSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { enhanced, ready } = useMotionContext();
  const [openId, setOpenId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(4);
  const prevVisibleRef = useRef(4);

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
        teardown = await bindFaqMotion(sectionRef.current);
      })();

      return () => {
        disposed = true;
        teardown?.();
      };
    },
    { scope: sectionRef, dependencies: [enhanced, ready] },
  );

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root || !enhanced || !ready) return;
      if (visibleCount <= prevVisibleRef.current) return;

      const items = root.querySelectorAll<HTMLElement>("[data-faq-item]");
      for (let i = prevVisibleRef.current; i < visibleCount; i += 1) {
        const item = items[i];
        if (!item) continue;
        gsap.fromTo(
          item,
          { opacity: 0, yPercent: 15 },
          {
            opacity: 1,
            yPercent: 0,
            duration: DURATION.MEDIUM,
            ease: "Out",
            onComplete: () => ScrollTrigger.refresh(),
          },
        );
      }
      prevVisibleRef.current = visibleCount;
    },
    { scope: sectionRef, dependencies: [visibleCount, enhanced, ready] },
  );

  const motionActive = enhanced && ready;

  const loadMore = () => {
    setVisibleCount((count) => Math.min(count + 4, faq.items.length));
  };

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="sd-section sd-faq theme-dark"
      data-theme="dark"
      data-header-theme="dark"
    >
      <div className="sd-container sd-faq__wrap">
        <div className="sd-faq__title-sticky">
          <div className="sd-faq__title-block">
            <div className="sd-faq__title-grid" data-scroll-reveal="h">
              <div className="sd-faq__letter">
                <span className="h1">F</span>
              </div>
              <div className="sd-faq__title-desc sd-faq__title-desc--1">
                <h3 className="p6">
                  {faq.titleLead}
                  <br />
                  {faq.titleTail}
                </h3>
              </div>
              <div className="sd-faq__letter">
                <span className="h1">A</span>
              </div>
              <div className="sd-faq__title-desc sd-faq__title-desc--2 sd-only-desk">
                <h3 className="p6 sd-faq__title-desc-center">
                  {faq.subtitle.split(" ").slice(0, 2).join(" ")}
                  <br />
                  {faq.subtitle.split(" ").slice(2).join(" ")}
                </h3>
              </div>
              <div className="sd-faq__letter">
                <span className="h1">Q</span>
              </div>
            </div>
          </div>
        </div>
        <div className="sd-faq__scenes sd-only-desk" aria-hidden>
          <canvas className="sd-faq__scene-canvas scene" data-faq-scene="" />
        </div>

        <div className="sd-space-c" aria-hidden />
        <div className="sd-faq__cms">
          <div className="sd-faq__cms-rule">
            <div className="sd-faq__cms-rule-line" />
          </div>

          <div data-faq-load-more-list className="sd-faq__list">
            {faq.items.map((item, index) => {
              const indexLabel = String(index).padStart(2, "0");
              const isOpen = openId === item.id;
              return (
                <div
                  key={item.id}
                  data-faq-item
                  data-scroll-reveal="ctn"
                  className="sd-faq__list-item"
                  hidden={index >= visibleCount}
                >
                  <div
                    className={`sd-faq-card${!motionActive && isOpen ? " sd-faq-card--open" : ""}`}
                    data-hover-faq
                  >
                    <button
                      type="button"
                      className="sd-faq-card__trigger sd-faq-grid-8"
                      data-accordion-btn={item.id}
                      aria-expanded={isOpen}
                      onClick={
                        motionActive
                          ? undefined
                          : () => setOpenId(isOpen ? null : item.id)
                      }
                    >
                      <span className="p4 sd-faq-card__index">{indexLabel}</span>
                      <span className="p4 sd-faq-card__question">{item.q}</span>
                      <span className="sd-faq-card__icon" aria-hidden>
                        <span className="sd-faq-card__icon-bar">
                          <FaqPlusIcon />
                        </span>
                        <span
                          className="sd-faq-card__icon-bar sd-faq-card__icon-bar--ver"
                          data-accordion-icon-ver={item.id}
                        >
                          <FaqPlusIcon vertical />
                        </span>
                      </span>
                    </button>

                    <div className="sd-faq-card__row sd-faq-grid-8">
                      <div
                        className="sd-faq-card__desc"
                        data-accordion-desc={item.id}
                      >
                        <div className="sd-faq-card__desc-spacer" aria-hidden />
                        <div className="sd-faq-card__answer-mask">
                          <p
                            className="p6 sd-faq-card__answer"
                            data-accordion-paragraph={item.id}
                          >
                            {item.a}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      className="sd-faq-card__divider"
                      data-scroll-reveal="line"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {faq.items.length > 4 ? (
            <button
              type="button"
              className="p5 sd-faq__load-more"
              data-faq-load-more-btn
              hidden={visibleCount >= faq.items.length}
              onClick={loadMore}
            >
              {faq.loadMoreLabel}
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
