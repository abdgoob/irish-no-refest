import { images } from "@/data/assets";
import { hero } from "@/data/restaurant/home";
import { ButtonCircle } from "@/components/ui/ButtonCircle";
import { SvgWordmark } from "@/components/ui/SvgWordmark";
import { MediaImage } from "@/components/ui/MediaImage";
import { HeroScrollScene } from "@/motion/hero/HeroScrollScene";

export function HeroSection({
  onInvestClick,
  onConsultationOpen,
}: {
  onInvestClick?: () => void;
  onConsultationOpen: () => void;
}) {
  return (
    <HeroScrollScene
      fallback={
        <>
          <div className="sd-hero__bg sd-only-desk">
            <MediaImage
              src={images.hero.desktop}
              alt=""
              priority
              sizes="100vw"
            />
          </div>
          <div className="sd-hero__bg sd-only-mob">
            <MediaImage
              src={images.hero.mobile}
              alt=""
              priority
              sizes="100vw"
            />
          </div>
          <div className="sd-hero__grad-top" />
          <div className="sd-hero__grad-bot" />
        </>
      }
    >
      <div className="sd-container sd-hero__content">
        <div className="sd-hero__cluster">
          <p className="p3 sd-hero__title">{hero.eyebrow}</p>
          <div className="sd-hero__logo">
            <SvgWordmark />
          </div>
        </div>

        <div className="sd-hero__meta">
          <div className="sd-hero__meta-left">
            <p className="p5">{hero.metaLeft[0]}</p>
            <p className="p5">{hero.metaLeft[1]}</p>
          </div>
          <div className="sd-hero__meta-center">
            <p className="p5">{hero.metaCenter[0]}</p>
            <p className="p5">{hero.metaCenter[1]}</p>
          </div>
          <div className="sd-hero__meta-right">
            <p className="p5">{hero.metaRight[0]}</p>
            <p className="p5">{hero.metaRight[1]}</p>
          </div>
        </div>
      </div>

      <div className="sd-hero__cta-wrap">
        <ButtonCircle onClick={onInvestClick ?? onConsultationOpen}>
          {hero.primaryCta}
        </ButtonCircle>
      </div>
    </HeroScrollScene>
  );
}
