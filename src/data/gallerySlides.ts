import { images } from "@/data/assets";

/** Content-agnostic gallery slide list (restaurant imagery can replace later). */
export const gallerySlides = [
  {
    id: "feature",
    src: images.gallery.render2,
    alt: "Son Daven architecture",
  },
  {
    id: "render-5",
    src: images.gallery.render5,
    alt: "Son Daven view 1",
  },
  {
    id: "render-6",
    src: images.gallery.render6,
    alt: "Son Daven view 2",
  },
  {
    id: "render-7",
    src: images.gallery.render7,
    alt: "Son Daven view 3",
  },
  {
    id: "hero-view",
    src: images.gallery.hero,
    alt: "Son Daven view 4",
  },
] as const;
