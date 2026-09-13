import { brand } from "@/data/assets";
import { restaurant } from "@/data/restaurant/home";

export function SvgBlagoMark({ className = "" }: { className?: string }) {
  return (
    <span
      className={className}
      role="img"
      aria-label={restaurant.name}
      style={{
        display: "inline-block",
        width: "1.25em",
        height: "1.25em",
        backgroundColor: "currentColor",
        WebkitMaskImage: `url(${brand.blagoMark})`,
        maskImage: `url(${brand.blagoMark})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );
}
