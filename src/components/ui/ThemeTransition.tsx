import Image from "next/image";
import type { ComponentPropsWithoutRef } from "react";

/** Static theme-change separator. Decorative only — no motion. */
export function ThemeTransition({
  src,
  className = "",
  ...rest
}: {
  src: string;
  className?: string;
} & ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={`sd-transition ${className}`.trim()}
      aria-hidden="true"
      {...rest}
    >
      <Image
        src={src}
        alt=""
        width={1920}
        height={480}
        style={{ width: "100%", height: "auto" }}
      />
    </div>
  );
}
