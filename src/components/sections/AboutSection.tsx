import { AboutBirdsScene } from "@/components/sections/AboutBirdsScene";
import { about } from "@/data/restaurant/home";

export function AboutSection() {
  return (
    <section
      id="about"
      className="sd-section sd-about theme-light"
      data-theme="light"
      data-header-theme="light"
    >
      <AboutBirdsScene />
      <div className="sd-container sd-about__content">
        <div className="sd-grid-12 sd-about__title-row">
          <div className="sd-col-7-13">
            <h2 className="h1 sd-about__brand" data-reveal="heading">
              {about.heading}
            </h2>
            <p className="p5 sd-about__byline">{about.byline}</p>
          </div>
        </div>

        <div className="sd-space-b sd-only-desk" aria-hidden="true" />

        <div className="sd-grid-12 sd-about__copy-row">
          <div className="sd-col-4-7 sd-about__col">
            <h3 className="h4" data-reveal="heading">
              {about.columns[0].title}
            </h3>
            <p
              className="p5 sd-prose sd-prose--tight"
              data-reveal="paragraph"
            >
              {about.columns[0].body}
            </p>
          </div>
          <div className="sd-col-7-10 sd-about__col sd-about__col--offset">
            <div className="sd-space-c sd-only-desk" aria-hidden="true" />
            <h3 className="h4" data-reveal="heading">
              {about.columns[1].title}
            </h3>
            <p
              className="p5 sd-prose sd-prose--tight"
              data-reveal="paragraph"
            >
              {about.columns[1].body}
            </p>
            <p
              className="p5 sd-prose sd-prose--tight sd-about__closer"
              data-reveal="paragraph"
            >
              {about.closer}
            </p>
          </div>
        </div>
      </div>

      <div className="sd-about-carousel-transition" aria-hidden="true">
        <div
          className="sd-about-carousel-transition__orbit"
          data-parallax="container-up"
        >
          <span className="sd-about-carousel-transition__dot" />
          <span className="p6 sd-about-carousel-transition__label">
            THE HOUSE / EIGHT WAYS IN
          </span>
        </div>
        <div className="sd-about-carousel-transition__axis" />
      </div>
    </section>
  );
}
