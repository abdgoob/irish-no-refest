import { Container } from "@/components/layout/Container";
import { prologue } from "@/data/restaurant/home";
import { PrologueSceneCanvas } from "@/components/sections/PrologueSceneCanvas";

export function PrologueSection() {
  return (
    <section
      id="prolog"
      className="sd-section sd-prolog theme-dark"
      data-theme="dark"
      data-header-theme="dark"
    >
      <div className="sd-prolog__scene sd-only-desk" aria-hidden="true">
        <PrologueSceneCanvas />
      </div>

      <Container className="sd-prolog__container">
        <div className="sd-prolog__inner">
          <p className="p3 sd-prolog__label" data-reveal="line">
            <span className="sd-prolog__label-mark" aria-hidden="true">
              +++
            </span>
            {prologue.label}
            <span className="sd-prolog__label-mark" aria-hidden="true">
              +++
            </span>
          </p>
          <h2
            className="h5 sd-prolog__quote"
            data-highlight-scrub="true"
          >
            {prologue.quote}
          </h2>
        </div>
      </Container>
    </section>
  );
}
