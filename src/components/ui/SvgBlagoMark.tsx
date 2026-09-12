import { brand } from "@/data/assets";

export function SvgBlagoMark({ className = "" }: { className?: string }) {
  return (
    <span
      className={className}
      role="img"
      aria-label="blago"
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
