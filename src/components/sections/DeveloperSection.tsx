import { MediaImage } from "@/components/ui/MediaImage";
import { SvgBlagoMark } from "@/components/ui/SvgBlagoMark";
import { houseCraft } from "@/data/restaurant/home";

export function DeveloperSection() {
  return (
    <section
      id="developer"
      className="sd-section sd-developer theme-dark"
      data-theme="dark"
      data-header-theme="dark"
    >
      <div className="sd-developer__scene" aria-hidden="true">
        <MediaImage src={houseCraft.image} alt="" sizes="100vw" />
      </div>

      <div className="sd-container">
        <div className="sd-grid-12">
          <div className="sd-col-3-11 sd-developer__lead">
            <p className="p3">{houseCraft.eyebrow}</p>
            <h2 className="h3 sd-developer__title">{houseCraft.title}</h2>
          </div>
        </div>

        <div className="sd-space-c" aria-hidden="true" />

        <div className="sd-grid-12">
          <div className="sd-col-5-9 sd-developer__card">
            <p className="p4 sd-prose">{houseCraft.body}</p>
          </div>
        </div>

        <div className="sd-developer__lockup">
          <SvgBlagoMark className="sd-developer__mark" />
          <p className="p3">
            {houseCraft.lockupLines[0]}
            <br />
            {houseCraft.lockupLines[1]}
          </p>
        </div>
      </div>
    </section>
  );
}
