import { images } from "@/data/assets";
import { MediaImage } from "@/components/ui/MediaImage";
import { SvgBlagoMark } from "@/components/ui/SvgBlagoMark";

export function AboutSection() {
  return (
    <section
      id="about"
      className="sd-section sd-about theme-light"
      data-theme="light"
      data-header-theme="light"
    >
      <div className="sd-container">
        <div className="sd-space-c sd-only-desk" aria-hidden="true" />

        <div className="sd-grid-12 sd-about__title-row">
          <div className="sd-col-7-13">
            <h2 className="h1 sd-about__brand" data-reveal="heading">
              SON DAVEN
            </h2>
            <p className="p5 sd-about__byline">
              by blago <SvgBlagoMark />
            </p>
          </div>
        </div>

        <div className="sd-space-b sd-only-desk" aria-hidden="true" />

        <div className="sd-grid-12 sd-about__copy-row">
          <div className="sd-col-4-7 sd-about__col">
            <h3 className="h4" data-reveal="heading">
              ABOUT US
            </h3>
            <p
              className="p5 sd-prose sd-prose--tight"
              data-reveal="paragraph"
            >
              SON DAVEN IS A NEW PLACE OF POWER IN THE CARPATHIANS, WHERE HUTSUL
              CULTURE IS REINTERPRETED THROUGH ARCHITECTURE, SPATIAL DESIGN,
              HOSPITALITY, AND CONTEMPORARY ART. HERE, TRADITIONS TAKE ON A NEW
              FORM, AND THE ANCIENT SPIRIT OF THE CARPATHIANS MERGES WITH MODERN
              COMFORT.
            </p>
          </div>
          <div className="sd-col-7-10 sd-about__col sd-about__col--offset">
            <div className="sd-space-c sd-only-desk" aria-hidden="true" />
            <h3 className="h4" data-reveal="heading">
              CONCEPT
            </h3>
            <p
              className="p5 sd-prose sd-prose--tight"
              data-reveal="paragraph"
            >
              THE ARCHITECTURE OF THE COMPLEX GROWS FROM THE MOUNTAINS,
              PRESERVING THEIR STRENGTH IN STONE AND WARMTH IN WOOD. PANORAMIC
              TERRACES OPEN UP VIEWS FROM WHICH THE SPIRIT INTERCEPTS, AND
              TRADITIONS INTERTWINE WITH MODERNITY, CREATING A NEW FORMAT OF
              RECREATION: DEEP, MEANINGFUL, FILLED WITH THE ENERGY OF NATURE AND
              CULTURE OF HUTSUL REGION.
            </p>
            <p
              className="p5 sd-prose sd-prose--tight sd-about__closer"
              data-reveal="paragraph"
            >
              A DREAM OF A PLACE WHERE LEGENDS, NATURE, AND MODERN COMFORTS COME
              TOGETHER AS ONE
            </p>
          </div>
        </div>
      </div>

      <div className="sd-about__bleed" data-parallax="container-up">
        <div className="sd-about__image" data-parallax="image">
          <MediaImage
            src={images.about.main}
            alt="Architecture"
            sizes="100vw"
          />
        </div>
      </div>
    </section>
  );
}
