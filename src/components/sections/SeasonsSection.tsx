"use client";

import { useState } from "react";
import { images } from "@/data/assets";
import { MediaImage } from "@/components/ui/MediaImage";
import { ButtonPill } from "@/components/ui/ButtonPill";

export function SeasonsSection({
  onConsultationOpen,
}: {
  onConsultationOpen?: () => void;
}) {
  const [season, setSeason] = useState<"summer" | "winter">("summer");

  return (
    <section
      id="seasons"
      className="sd-section sd-seasons theme-dark"
      data-theme="dark"
      data-header-theme="dark"
    >
      <div className="sd-container">
        <div className="sd-seasons__tabs">
          <button
            type="button"
            className={`sd-seasons__tab p4 ${season === "summer" ? "is-active" : ""}`}
            onClick={() => setSeason("summer")}
          >
            Summer
          </button>
          <button
            type="button"
            className={`sd-seasons__tab p4 ${season === "winter" ? "is-active" : ""}`}
            onClick={() => setSeason("winter")}
          >
            winter
          </button>
        </div>
      </div>

      <div className="sd-seasons__stage">
        <div className="sd-seasons__media">
          <MediaImage
            src={season === "summer" ? images.seasons.summer : images.seasons.winter}
            alt=""
            sizes="100vw"
          />
          <div className="sd-seasons__veil" aria-hidden="true" />
        </div>

        <div className="sd-container sd-seasons__overlay">
          <div className="sd-grid-12">
            <div className="sd-col-2-9">
              {season === "summer" ? (
                <p className="h5 sd-seasons__copy">
                  SUMMER TURNS THIS AREA INTO AN EXCITING ADVENTURE MAP: HIKING
                  TRAILS, MOUNTAIN RIVER RAFTING, CULTURAL FESTIVALS, AND
                  CULINARY JOURNEYS.
                </p>
              ) : (
                <div className="sd-seasons__km">
                  <p className="h1">35 km</p>
                  <p className="p4 sd-seasons__km-note">
                    to Bukovel, ensuring a steady flow of guests in winter.
                  </p>
                </div>
              )}
              {onConsultationOpen ? (
                <div className="sd-seasons__cta">
                  <ButtonPill onClick={onConsultationOpen}>Consultation</ButtonPill>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
