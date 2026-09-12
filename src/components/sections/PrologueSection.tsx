import { SectionShell } from "@/components/layout/SectionShell";

export function PrologueSection() {
  return (
    <SectionShell id="prolog" theme="dark" className="sd-prolog">
      <p className="p3" data-reveal="line">
        PROLOGUE
      </p>
      <h2
        className="h2 sd-prolog__quote"
        data-highlight-scrub="true"
      >
        “AMONG THESE MOUNTAINS, WHERE THE WIND BECOMES A VOICE AND FORESTS GUARD
        THE WISDOM OF THOUSANDS OF YEARS, THE CARPATHIAN HERITAGE COMES ALIVE—A
        PRIMAL FORCE THAT RECONNECTS PEOPLE WITH THEIR ROOTS AND EMPOWERS THEM
        TO BRING AN ANCIENT DREAM TO LIFE”
      </h2>
    </SectionShell>
  );
}
