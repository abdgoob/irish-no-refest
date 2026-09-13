import { SectionShell } from "@/components/layout/SectionShell";
import { prologue } from "@/data/restaurant/home";

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
          {prologue.label}
          <span className="sd-prolog__label-mark" aria-hidden="true">
            +++
          </span>
        </p>
        <h2
          className="h2 sd-prolog__quote"
          data-highlight-scrub="true"
        >
          {prologue.quote}
        </h2>
      </div>
    </SectionShell>
  );
}
