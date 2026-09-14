import { svg } from "@/data/assets";
import { ThemeTransition } from "@/components/ui/ThemeTransition";

/** Son Daven `about-s_transition`: SVG cut + dark fill behind. */
export function AboutTransition() {
  return (
    <div className="sd-about-transition" aria-hidden="true">
      <div className="sd-about-transition__bg" />
      <ThemeTransition
        src={svg.transitionLight}
        className="sd-about-transition__svg"
        data-theme-separator="true"
      />
    </div>
  );
}
