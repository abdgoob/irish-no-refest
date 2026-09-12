"use client";

import type { HeroLayerConfig } from "@/motion/hero/types";

export function HeroSceneLayers({
  layers,
  desktop,
}: {
  layers: HeroLayerConfig[];
  desktop: boolean;
}) {
  return (
    <div className="sd-hero__layers" aria-hidden>
      {layers.map((layer) => {
        if (layer.enabled === false) return null;
        if (layer.desktopOnly && !desktop) return null;
        const style = {
          ...layer.style,
          zIndex: layer.zIndex,
        };

        if (layer.kind === "video") {
          return (
            <video
              key={layer.id}
              data-hero-layer={layer.id}
              className="sd-hero__layer"
              style={style}
              src={layer.src}
              muted
              loop
              playsInline
              preload="none"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          );
        }

        return (
          // eslint-disable-next-line @next/next/no-img-element -- decorative motion layer
          <img
            key={layer.id}
            data-hero-layer={layer.id}
            className="sd-hero__layer"
            style={style}
            src={layer.src}
            alt=""
          />
        );
      })}
    </div>
  );
}

export function bindAmbientMedia(root: HTMLElement): () => void {
  const videos = [...root.querySelectorAll<HTMLVideoElement>("video[data-hero-layer]")];
  if (!videos.length) return () => {};

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target as HTMLVideoElement;
        if (entry.isIntersecting) {
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    },
    { threshold: 0.01, rootMargin: "20% 0px" },
  );

  videos.forEach((video) => io.observe(video));

  return () => {
    io.disconnect();
    videos.forEach((video) => {
      video.pause();
    });
  };
}
