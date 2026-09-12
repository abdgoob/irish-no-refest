import { images, svg } from "@/data/assets";
import { site } from "@/data/home.en";
import { ButtonPill } from "@/components/ui/ButtonPill";
import { MediaImage } from "@/components/ui/MediaImage";
import { ThemeTransition } from "@/components/ui/ThemeTransition";

export function CtaSection({
  onConsultationOpen,
}: {
  onConsultationOpen: () => void;
}) {
  return (
    <section
      id="cta"
      className="sd-section sd-cta theme-inverted"
      data-theme="inverted"
      data-header-theme="inverted"
    >
      <div className="sd-cta__bg">
        <MediaImage src={images.commissioning.render} alt="" sizes="100vw" />
      </div>
      <div className="sd-cta__veil" aria-hidden="true" />

      <div className="sd-cta__transition sd-cta__transition--top">
        <ThemeTransition src={svg.transitionDarkTop} />
      </div>

      <div className="sd-container sd-cta__content">
        <div className="sd-grid-12">
          <div className="sd-col-5-9 sd-cta__cluster">
            <p className="p6 sd-cta__lead">
              Each investor becomes a co-owner of a premium design hotel that
              redefines the concept of leisure, elevating it to a level of
              sensations, aesthetics, and meaning.
            </p>
            <h2 className="h2 sd-cta__headline">
              BECOME PART OF THE LEGEND
            </h2>
            <ButtonPill onClick={onConsultationOpen}>Consultation</ButtonPill>
            <div className="sd-cta__contacts">
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="p5">
                {site.phone}
              </a>
              <a href={`mailto:${site.email}`} className="p5">
                {site.email}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="sd-cta__transition sd-cta__transition--bot">
        <ThemeTransition src={svg.transitionDarkBot} />
      </div>
    </section>
  );
}
