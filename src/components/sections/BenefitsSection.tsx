import { BenefitsFeatureSequence } from "@/components/sections/BenefitsFeatureSequence";
import { experiencesHead } from "@/data/restaurant/home";

export function BenefitsSection() {
  return (
    <section
      id="benefits"
      className="sd-section sd-benefits theme-light"
      data-theme="light"
      data-header-theme="light"
    >
      <div className="sd-container">
        <div className="sd-benefits__head">
          <p className="p3">{experiencesHead.eyebrow}</p>
          <h2 className="h2 sd-benefits__title">{experiencesHead.title}</h2>
        </div>
      </div>

      <BenefitsFeatureSequence />
    </section>
  );
}
