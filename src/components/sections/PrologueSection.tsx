import { SectionShell } from "@/components/layout/SectionShell";

export function PrologueSection() {
  return (
    <SectionShell
      id="prolog"
      theme="dark"
      className="sd-prolog"
      containerClassName="sd-prolog__container"
    >
      <div className="sd-prolog__inner">
        <p className="p3 sd-prolog__label" data-reveal="line">
          <span className="sd-prolog__label-mark" aria-hidden="true">
            +++
          </span>
          PROLOGUE
          <span className="sd-prolog__label-mark" aria-hidden="true">
            +++
          </span>
        </p>
        <h2
          className="h2 sd-prolog__quote"
          data-highlight-scrub="true"
        >
          “AMONG THESE MOUNTAINS, WHERE THE WIND BECOMES A VOICE AND FORESTS
          GUARD THE WISDOM OF THOUSANDS OF YEARS, THE CARPATHIAN HERITAGE COMES
          ALIVE—A PRIMAL FORCE THAT RECONNECTS PEOPLE WITH THEIR ROOTS AND
          EMPOWERS THEM TO BRING AN ANCIENT DREAM TO LIFE”
        </h2>
      </div>
    </SectionShell>
  );
}
