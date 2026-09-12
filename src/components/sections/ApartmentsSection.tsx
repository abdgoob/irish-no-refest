"use client";

import Image from "next/image";
import { useState } from "react";
import { apartments, type ApartmentId } from "@/data/home.en";
import { SectionShell } from "@/components/layout/SectionShell";
import { MediaImage } from "@/components/ui/MediaImage";
import { ButtonPill } from "@/components/ui/ButtonPill";

const tabOrder: ApartmentId[] = [
  "studio",
  "deluxe",
  "superior",
  "suite",
  "family",
  "penthouse",
];

export function ApartmentsSection() {
  const [active, setActive] = useState<ApartmentId>("studio");
  const apt = apartments[active];

  return (
    <SectionShell id="apartments" theme="light" className="sd-apartments">
      <p className="p3">APARTMENTS</p>
      <p className="p4" style={{ marginTop: "1.5rem", maxWidth: "70ch", textTransform: "none", letterSpacing: "0.02em", lineHeight: 1.5 }}>
        ONE- TO THREE-BEDROOM UNITS DESIGNED FOR SOLO TRAVELERS, COUPLES, OR FAMILIES. PANORAMIC WINDOWS, SPACIOUS TERRACES, AND NATURAL TEXTURES AND MATERIALS ELEVATE THE EXPERIENCE OF A CARPATHIAN GETAWAY.
      </p>
      <p className="p5" style={{ marginTop: "1rem" }}>
        The design features Hutsul touches that bring genuine authenticity to the space.
      </p>
      <p className="p3" style={{ marginTop: "2rem" }}>
        TYPES
      </p>
      <div className="sd-apartments__tabs">
        {tabOrder.map((id) => (
          <button
            key={id}
            type="button"
            className={`sd-apartments__tab p4 ${active === id ? "is-active" : ""}`}
            onClick={() => setActive(id)}
          >
            {apartments[id].label}
          </button>
        ))}
      </div>
      <div className="sd-apartments__panel">
        <div>
          <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden" }}>
            <MediaImage src={apt.image} alt={apt.label} sizes="60vw" />
          </div>
          <div style={{ marginTop: "1.5rem", maxWidth: "280px" }}>
            <Image src={apt.layoutSvg} alt={`${apt.label} layout`} width={400} height={300} style={{ width: "100%", height: "auto" }} />
          </div>
        </div>
        <div>
          <h3 className="h3">{apt.label}</h3>
          <p className="h4" style={{ marginTop: "1rem" }}>
            {apt.price}
          </p>
          <p className="p4" style={{ marginTop: "0.5rem" }}>
            {apt.guests}
          </p>
          <p className="p4" style={{ marginTop: "0.5rem" }}>
            {apt.area}
          </p>
          <ul className="p5" style={{ marginTop: "1.5rem", paddingLeft: "1.2em", lineHeight: 1.8 }}>
            {apt.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <p className="p5" style={{ marginTop: "1.5rem", textTransform: "none", letterSpacing: "0.02em", lineHeight: 1.6 }}>
            {apt.description}
          </p>
          <div style={{ marginTop: "2rem" }}>
            <ButtonPill href="mailto:sale@sondaven.com">Inquire about pricing</ButtonPill>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
