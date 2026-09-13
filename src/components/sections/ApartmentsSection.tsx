"use client";

import { useRef, useState } from "react";
import {
  actionHref,
  menuCategories,
  menuHead,
  menuTabOrder,
  type MenuCategoryId,
} from "@/data/restaurant/home";
import { SectionShell } from "@/components/layout/SectionShell";
import { MediaImage } from "@/components/ui/MediaImage";
import { ButtonPill } from "@/components/ui/ButtonPill";
import { registerGsapPlugins, useGSAP } from "@/motion/core/gsap";
import { useMotionContext } from "@/motion/core/MotionContext";
import {
  bindCategoryTabPanel,
  getCategoryTabPanelHandle,
} from "@/motion/patterns/CategoryTabPanel";

function MenuPanel({ id }: { id: MenuCategoryId }) {
  const category = menuCategories[id];

  return (
    <>
      <div>
        <div className="sd-apartments__media">
          <MediaImage src={category.image} alt={category.label} sizes="60vw" />
        </div>
        <div className="sd-apartments__layout" aria-hidden="true" />
      </div>
      <div>
        <h3 className="h3">{category.label}</h3>
        <p className="h4 sd-apartments__price">{category.statement}</p>
        <p className="p4 sd-apartments__meta">{category.line}</p>
        <p className="p4 sd-apartments__meta">{menuHead.examplesLabel}</p>
        <ul className="p5 sd-apartments__features">
          {category.examples.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="p5 sd-apartments__description">{category.body}</p>
        <div className="sd-apartments__inquire">
          <ButtonPill href={actionHref("menu")}>{menuHead.cta}</ButtonPill>
        </div>
      </div>
    </>
  );
}

export function ApartmentsSection() {
  const [active, setActive] = useState<MenuCategoryId>("starters");
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

  const onTabSelect = (id: MenuCategoryId) => {
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
      <p className="p3">{menuHead.eyebrow}</p>
      <p className="p4 sd-apartments__intro">{menuHead.title}</p>
      <p className="p5 sd-apartments__note">{menuHead.note}</p>
      <p className="p3 sd-apartments__types-label">{menuHead.typesLabel}</p>

      <div ref={tabsRef} data-category-tabs>
        <div
          className="sd-apartments__tabs"
          role="tablist"
          aria-label="Menu categories"
        >
          {menuTabOrder.map((id) => (
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
              {menuCategories[id].label}
            </button>
          ))}
        </div>

        <div className="sd-apartments__panel" data-category-stage>
          {menuTabOrder.map((id) => (
            <div
              key={id}
              className="sd-apartments__panel-inner"
              role="tabpanel"
              id={`apt-panel-${id}`}
              aria-labelledby={`apt-tab-${id}`}
              data-tab-panel={id}
              hidden={!motionTabs && active !== id}
              aria-hidden={active !== id}
              inert={active !== id ? true : undefined}
            >
              <MenuPanel id={id} />
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
