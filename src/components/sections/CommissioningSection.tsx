import { images } from "@/data/assets";
import { SectionShell } from "@/components/layout/SectionShell";
import { MediaImage } from "@/components/ui/MediaImage";

const milestones = [
  { label: "Construction begins", when: "in Q4 2025" },
  { label: "Section 1 ready", when: "in Q4 2027" },
  { label: "Section 2 ready", when: "in Q4 2028" },
];

export function CommissioningSection() {
  return (
    <SectionShell id="commissioning" theme="light" className="sd-commissioning">
      <h2 className="h2">CONSTRUCTION TIMELINE</h2>
      <p className="p3" style={{ marginTop: "1rem", opacity: 0.6 }}>
        ‘26 ‘29
      </p>
      <div className="sd-timeline">
        {milestones.map((m) => (
          <div key={m.label}>
            <h3 className="h5">{m.label}</h3>
            <p className="p4" style={{ marginTop: "0.75rem" }}>
              {m.when}
            </p>
          </div>
        ))}
      </div>
      <div style={{ position: "relative", marginTop: "3rem", aspectRatio: "16/9", overflow: "hidden" }}>
        <MediaImage src={images.commissioning.render} alt="Construction render" sizes="100vw" />
      </div>
    </SectionShell>
  );
}
