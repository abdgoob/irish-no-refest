import Image from "next/image";

export function MediaImage({
  src,
  alt,
  className = "",
  priority = false,
  sizes = "100vw",
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={`sd-media-fill ${className}`.trim()}
      sizes={sizes}
      priority={priority}
    />
  );
}
