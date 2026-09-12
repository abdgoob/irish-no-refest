import { benefits } from "@/data/home.en";
import { MediaImage } from "@/components/ui/MediaImage";
import { images } from "@/data/assets";

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

      <div className="sd-benefits__intro sd-container">
        <div className="sd-benefits__intro-img">
          <MediaImage src={images.benefits.intro} alt="" sizes="100vw" />
        </div>
      </div>

      <div className="sd-benefits__strip" role="list">
        {benefits.map((item, i) => (
          <article
            key={item.title}
            className="sd-benefit-card"
            role="listitem"
          >
            <div className="sd-benefit-card__media">
              <MediaImage src={item.image} alt="" sizes="(max-width: 991px) 80vw, 40vw" />
            </div>
            <div className="sd-benefit-card__grad" aria-hidden="true" />
            <div className="sd-benefit-card__index p5">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="sd-benefit-card__body">
              <h3 className="h5 sd-benefit-card__name">{item.title}</h3>
              <p className="p5 sd-benefit-card__desc">{item.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
