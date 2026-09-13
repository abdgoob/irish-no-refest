"use client";

import { useState } from "react";
import { faq } from "@/data/restaurant/home";
import { SectionShell } from "@/components/layout/SectionShell";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <SectionShell id="faq" theme="dark" className="sd-faq">
      <div className="sd-faq__head">
        <h2 className="h2 sd-faq__title">{faq.title}</h2>
        <p className="p5 sd-faq__subtitle">{faq.subtitle}</p>
      </div>
      <div className="sd-faq__list">
        {faq.items.map((item, index) => (
          <div key={item.q} className="sd-faq__item">
            <button
              type="button"
              className="sd-faq__trigger"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              aria-expanded={openIndex === index}
            >
              {item.q}
            </button>
            {openIndex === index ? (
              <p className="sd-faq__answer">{item.a}</p>
            ) : null}
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
