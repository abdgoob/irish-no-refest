"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { apartments, type ApartmentId } from "@/data/home.en";
import { SectionShell } from "@/components/layout/SectionShell";
import { MediaImage } from "@/components/ui/MediaImage";
import { ButtonPill } from "@/components/ui/ButtonPill";
import { registerGsapPlugins, useGSAP } from "@/motion/core/gsap";
import { useMotionContext } from "@/motion/core/MotionContext";
import {
  bindCategoryTabPanel,
  getCategoryTabPanelHandle,
} from "@/motion/patterns/CategoryTabPanel";

const tabOrder: ApartmentId[] = [
  "studio",
  "deluxe",
  "superior",
  "suite",
  "family",
  "penthouse",
];

function ApartmentPanel({ id }: { id: ApartmentId }) {
  const apt = apartments[id];

  return (
    <>
      <div>
        <div className="sd-apartments__media">
          <MediaImage src={apt.image} alt={apt.label} sizes="60vw" />
        </div>
        <div className="sd-apartments__layout">
          <Image
            src={apt.layoutSvg}
            alt={`${apt.label} layout`}
            width={400}
            height={300}
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      </div>
      <div>
        <h3 className="h3">{apt.label}</h3>
        <p className="h4 sd-apartments__price">{apt.price}</p>
        <p className="p4 sd-apartments__meta">{apt.guests}</p>
        <p className="p4 sd-apartments__meta">{apt.area}</p>
        <ul className="p5 sd-apartments__features">
          {apt.features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <p className="p5 sd-apartments__description">{apt.description}</p>
        <div className="sd-apartments__inquire">
          <ButtonPill href="mailto:sale@sondaven.com">Inquire about pricing</ButtonPill>
        </div>
      </div>
    </>
  );
}

export function ApartmentsSection() {
  const [active, setActive] = useState<ApartmentId>("studio");
  const tabsRef = useRef<HTMLDivElement>(null);
  const { enhanced, ready } = useMotionContext();
  const motionTabs = enhanced && ready;

  useGSAP(
    () => {
      const root = tabsRef.current;
      if (!root || !motionTabs) return;

      registerGsapPlugins();
      const handle = bindCategoryTabPanel({ root });
      return () => handle.cleanup();
    },
    { scope: tabsRef, dependencies: [motionTabs] },
  );

  const onTabSelect = (id: ApartmentId) => {
    const root = tabsRef.current;
    if (motionTabs && root) {
      const handle = getCategoryTabPanelHandle(root);
      handle?.switchTo(id, () => setActive(id));
      return;
    }
    setActive(id);
  };

  return (
    <SectionShell id="apartments" theme="light" className="sd-apartments">
      <p className="p3">APARTMENTS</p>
      <p className="p4 sd-apartments__intro">
        ONE- TO THREE-BEDROOM UNITS DESIGNED FOR SOLO TRAVELERS, COUPLES, OR FAMILIES. PANORAMIC WINDOWS, SPACIOUS TERRACES, AND NATURAL TEXTURES AND MATERIALS ELEVATE THE EXPERIENCE OF A CARPATHIAN GETAWAY.
      </p>
      <p className="p5 sd-apartments__note">
        The design features Hutsul touches that bring genuine authenticity to the space.
      </p>
      <p className="p3 sd-apartments__types-label">TYPES</p>

      <div ref={tabsRef} data-category-tabs>
        <div
          className="sd-apartments__tabs"
          role="tablist"
          aria-label="Apartment types"
        >
          {tabOrder.map((id) => (
            <button
              key={id}
              type="button"
              role="tab"
              id={`apt-tab-${id}`}
              aria-controls={`apt-panel-${id}`}
              aria-selected={active === id}
              tabIndex={active === id ? 0 : -1}
              className={`sd-apartments__tab p4 ${active === id ? "is-active" : ""}`}
              data-tab-trigger={id}
              onClick={() => onTabSelect(id)}
            >
              {apartments[id].label}
            </button>
          ))}
        </div>

        <div className="sd-apartments__panel" data-category-stage>
          {tabOrder.map((id) => (
            <div
              key={id}
              className="sd-apartments__panel-inner"
              role="tabpanel"
              id={`apt-panel-${id}`}
              aria-labelledby={`apt-tab-${id}`}
              data-tab-panel={id}
              hidden={!motionTabs && active !== id}
              inert={active !== id ? true : undefined}
            >
              <ApartmentPanel id={id} />
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
