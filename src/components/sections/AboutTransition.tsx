import { svg } from "@/data/assets";
import { ThemeTransition } from "@/components/ui/ThemeTransition";

export function AboutTransition() {
  return (
    <ThemeTransition src={svg.transitionLight} data-theme-separator="true" />
  );
}
