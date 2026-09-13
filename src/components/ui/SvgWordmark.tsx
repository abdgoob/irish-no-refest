import { brand } from "@/data/assets";
import { restaurant } from "@/data/restaurant/home";

/** Masked SVG wordmark so `currentColor` matches source theme behavior. */
export function SvgWordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={className}
      role="img"
      aria-label={restaurant.name}
      style={{
        display: "block",
        width: "100%",
        aspectRatio: "224 / 24",
        backgroundColor: "currentColor",
        WebkitMaskImage: `url(${brand.wordmark})`,
        maskImage: `url(${brand.wordmark})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}
