import { images } from "@/data/assets";
import { ButtonCircle } from "@/components/ui/ButtonCircle";
import { SvgBlagoMark } from "@/components/ui/SvgBlagoMark";
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
          <p className="p3 sd-hero__title">INVESTMENT PROJECT</p>
          <div className="sd-hero__logo">
            <SvgWordmark />
          </div>
        </div>

        <div className="sd-hero__meta">
          <div className="sd-hero__meta-left">
            <p className="p5">DEVELOPMENT</p>
            <p
              className="p5"
              style={{ display: "flex", alignItems: "center", gap: "0.5em" }}
            >
              BY BLAGO <SvgBlagoMark />
            </p>
          </div>
          <div className="sd-hero__meta-center">
            <p className="p5">DESIGN</p>
            <p className="p5">RESORT HOTEL</p>
          </div>
          <div className="sd-hero__meta-right">
            <p className="p5">YAREMCHE,</p>
            <p className="p5">IVANO-FRANKIVSK</p>
          </div>
        </div>
      </div>

      <div className="sd-hero__cta-wrap">
        <ButtonCircle onClick={onInvestClick ?? onConsultationOpen}>
          Invest in Son Daven
        </ButtonCircle>
      </div>
    </HeroScrollScene>
  );
}
