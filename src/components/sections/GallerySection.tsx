import { GalleryScrollScene } from "@/components/sections/GalleryScrollScene";

export function GallerySection() {
  return (
    <section
      id="gallery"
      className="sd-section sd-gallery theme-dark"
      data-theme="dark"
      data-header-theme="dark"
    >
      <GalleryScrollScene />
    </section>
  );
}
