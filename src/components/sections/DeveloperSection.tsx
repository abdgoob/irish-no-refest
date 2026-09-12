import { images } from "@/data/assets";
import { MediaImage } from "@/components/ui/MediaImage";
import { SvgBlagoMark } from "@/components/ui/SvgBlagoMark";

export function DeveloperSection() {
  return (
    <section
      id="developer"
      className="sd-section sd-developer theme-dark"
      data-theme="dark"
      data-header-theme="dark"
    >
      <div className="sd-developer__scene" aria-hidden="true">
        <MediaImage src={images.footer.mountain} alt="" sizes="100vw" />
      </div>

      <div className="sd-container">
        <div className="sd-grid-12">
          <div className="sd-col-3-11 sd-developer__lead">
            <p className="p3">DEVELOPER</p>
            <h2 className="h3 sd-developer__title">
              A LEGEND BROUGHT TO LIFE IN THE VERY HEART OF THE CARPATHIANS,
              UNITING PAST AND FUTURE
            </h2>
          </div>
        </div>

        <div className="sd-space-c" aria-hidden="true" />

        <div className="sd-grid-12">
          <div className="sd-col-5-9 sd-developer__card">
            <p className="p4 sd-prose">
              urban tech developer creates a future-ready environment where real
              estate means more than just square meters. It’s a combination of
              services, infrastructure, and people-focused care, which shapes a
              new standard of living.
            </p>
          </div>
        </div>

        <div className="sd-developer__lockup">
          <SvgBlagoMark className="sd-developer__mark" />
          <p className="p3">
            urban tech
            <br />
            developer
          </p>
        </div>
      </div>
    </section>
  );
}
