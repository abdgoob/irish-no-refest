"use client";

import { useRef, useState } from "react";
import { images } from "@/data/assets";
import { MediaImage } from "@/components/ui/MediaImage";
import { ButtonPill } from "@/components/ui/ButtonPill";
import { registerGsapPlugins, useGSAP } from "@/motion/core/gsap";
import { useMotionContext } from "@/motion/core/MotionContext";
import { motionMediaQueries } from "@/motion/config/tokens";
import {
  bindDualMediaTabSwitch,
  getDualMediaTabSwitchHandle,
} from "@/motion/patterns/DualMediaTabSwitch";
import { gsap } from "@/motion/core/gsap";

type SeasonId = "summer" | "winter";

export function SeasonsSection({
  onConsultationOpen,
}: {
  onConsultationOpen?: () => void;
}) {
  const [season, setSeason] = useState<SeasonId>("summer");
  const rootRef = useRef<HTMLDivElement>(null);
  const { enhanced, ready } = useMotionContext();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !enhanced || !ready) return;

      registerGsapPlugins();
      const mm = gsap.matchMedia();
      mm.add(motionMediaQueries.desktop, () => {
        const handle = bindDualMediaTabSwitch({ root });
        return () => handle.cleanup();
      });
      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [enhanced, ready] },
  );

  const onSeasonSelect = (next: SeasonId) => {
    const root = rootRef.current;
    const handle = root ? getDualMediaTabSwitchHandle(root) : null;
    if (handle) {
      handle.switchTo(next, () => setSeason(next));
      return;
    }
    setSeason(next);
  };

  return (
    <section
      id="seasons"
      className="sd-section sd-seasons theme-dark"
      data-theme="dark"
      data-header-theme="dark"
    >
      <div ref={rootRef} data-dual-media-tabs>
        <div className="sd-container">
          <div
            className="sd-seasons__tabs"
            role="tablist"
            aria-label="Season"
          >
            <button
              type="button"
              role="tab"
              id="seasons-tab-summer"
              aria-controls="seasons-panel-summer"
              aria-selected={season === "summer"}
              tabIndex={season === "summer" ? 0 : -1}
              className={`sd-seasons__tab p4 ${season === "summer" ? "is-active" : ""}`}
              data-tab-trigger="summer"
              onClick={() => onSeasonSelect("summer")}
            >
              Summer
            </button>
            <button
              type="button"
              role="tab"
              id="seasons-tab-winter"
              aria-controls="seasons-panel-winter"
              aria-selected={season === "winter"}
              tabIndex={season === "winter" ? 0 : -1}
              className={`sd-seasons__tab p4 ${season === "winter" ? "is-active" : ""}`}
              data-tab-trigger="winter"
              onClick={() => onSeasonSelect("winter")}
            >
              winter
            </button>
          </div>
        </div>

        <div className={`sd-seasons__stage sd-seasons__stage--${season}`}>
          <div className="sd-seasons__media-stack">
            <div
              className="sd-seasons__media sd-seasons__media--summer"
              data-tab-media="summer"
              aria-hidden={season !== "summer"}
            >
              <MediaImage src={images.seasons.summer} alt="" sizes="100vw" />
              <div className="sd-seasons__veil" aria-hidden="true" />
            </div>
            <div
              className="sd-seasons__media sd-seasons__media--winter"
              data-tab-media="winter"
              aria-hidden={season !== "winter"}
            >
              <MediaImage src={images.seasons.winter} alt="" sizes="100vw" />
              <div className="sd-seasons__veil" aria-hidden="true" />
            </div>
          </div>

          <div className="sd-container sd-seasons__overlay">
            <div className="sd-grid-12">
              <div className="sd-col-2-9">
                <div
                  className={`sd-seasons__copy-panel${season === "summer" ? " is-visible" : ""}`}
                  role="tabpanel"
                  id="seasons-panel-summer"
                  aria-labelledby="seasons-tab-summer"
                  data-tab-panel="summer"
                  inert={season !== "summer" ? true : undefined}
                >
                  <p className="h5 sd-seasons__copy">
                    SUMMER TURNS THIS AREA INTO AN EXCITING ADVENTURE MAP: HIKING
                    TRAILS, MOUNTAIN RIVER RAFTING, CULTURAL FESTIVALS, AND
                    CULINARY JOURNEYS.
                  </p>
                </div>
                <div
                  className={`sd-seasons__copy-panel${season === "winter" ? " is-visible" : ""}`}
                  role="tabpanel"
                  id="seasons-panel-winter"
                  aria-labelledby="seasons-tab-winter"
                  data-tab-panel="winter"
                  inert={season !== "winter" ? true : undefined}
                >
                  <div className="sd-seasons__km">
                    <p className="h1">35 km</p>
                    <p className="p4 sd-seasons__km-note">
                      to Bukovel, ensuring a steady flow of guests in winter.
                    </p>
                  </div>
                </div>
                {onConsultationOpen ? (
                  <div className="sd-seasons__cta">
                    <ButtonPill onClick={onConsultationOpen}>Consultation</ButtonPill>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
