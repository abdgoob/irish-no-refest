import { images } from "@/data/assets";
import { MediaImage } from "@/components/ui/MediaImage";

const stats = [
  { value: "20+", caption: "years of experience in the real estate market", offset: "a" },
  { value: "2", caption: "Ranked 2nd among developers in Ukraine by Forbes Ukraine", offset: "b" },
  { value: "37", caption: "completed projects", offset: "c" },
  { value: "7", caption: "International Property Awards in London", offset: "d" },
];

export function FactoidsSection() {
  return (
    <section
      id="factoids"
      className="sd-section sd-factoids theme-dark"
      data-theme="dark"
      data-header-theme="dark"
    >
      <div className="sd-container">
        <div className="sd-grid-12 sd-factoids__row">
          {stats.map((s) => (
            <div key={s.value} className={`sd-factoid sd-factoid--${s.offset}`}>
              <p className="h1 sd-factoid__value">{s.value}</p>
              <p className="p5 sd-factoid__caption">{s.caption}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="sd-factoids__scene">
        <MediaImage src={images.footer.mountain} alt="" sizes="100vw" />
      </div>
    </section>
  );
}
