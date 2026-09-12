"use client";

import Image from "next/image";
import { useState } from "react";
import { svg } from "@/data/assets";
import { locationPois, site } from "@/data/home.en";
import { SectionShell } from "@/components/layout/SectionShell";
import { MediaImage } from "@/components/ui/MediaImage";
import { ButtonCircle } from "@/components/ui/ButtonCircle";

export function LocationSection({
  onConsultationOpen,
}: {
  onConsultationOpen: () => void;
}) {
  const [poiIndex, setPoiIndex] = useState(0);
  const poi = locationPois[poiIndex];

  return (
    <SectionShell id="location" theme="dark" className="sd-location">
      <h2 className="h2 sd-location__title">WHERE THE MOUNTAINS SPEAK</h2>
      <div className="sd-location__map">
        <Image src={svg.map} alt="Yaremche map" width={1200} height={800} style={{ width: "100%", height: "auto" }} />
      </div>
      <div className="sd-grid-12 sd-location__poi">
        <div style={{ gridColumn: "span 6" }}>
          <div style={{ position: "relative", aspectRatio: "16/10", overflow: "hidden" }}>
            <MediaImage src={poi.image} alt={poi.title} sizes="50vw" />
          </div>
          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <button type="button" className="p5" style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }} onClick={() => setPoiIndex((i) => (i === 0 ? locationPois.length - 1 : i - 1))}>
              Previous
            </button>
            <button type="button" className="p5" style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }} onClick={() => setPoiIndex((i) => (i + 1) % locationPois.length)}>
              Next
            </button>
          </div>
        </div>
        <div style={{ gridColumn: "span 6" }}>
          <h3 className="h4">{poi.title}</h3>
          <p className="h3" style={{ marginTop: "1rem" }}>
            {poi.distance}
          </p>
          <p className="p4" style={{ marginTop: "1rem" }}>
            {poi.note}
          </p>
          <p className="p4" style={{ marginTop: "2rem", textTransform: "none", letterSpacing: "0.02em", lineHeight: 1.5 }}>
            Son Daven is located at the foothills of the Carpathian Mountains, in the very heart of Yaremche—the capital of Hutsul heritage and enchanting nature.
          </p>
          <h4 className="h5" style={{ marginTop: "3rem" }}>
            Infrastructure
          </h4>
          <p className="p5" style={{ marginTop: "1rem" }}>
            {site.address}
          </p>
          <div style={{ marginTop: "2rem" }}>
            <ButtonCircle onClick={onConsultationOpen}>Invest in Son Daven</ButtonCircle>
          </div>
        </div>
      </div>
      <div className="sd-only-desk theme-dark sd-location-gap" aria-hidden="true" />
    </SectionShell>
  );
}
