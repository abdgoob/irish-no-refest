import { BenefitsFeatureSequence } from "@/components/sections/BenefitsFeatureSequence";

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
          <p className="p3">UNIQUENESS</p>
          <h2 className="h2 sd-benefits__title">WHY SON DAVEN CAPTIVATE</h2>
        </div>
      </div>

      <BenefitsFeatureSequence />
    </section>
  );
}
