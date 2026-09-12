import { images } from "@/data/assets";
import { MediaImage } from "@/components/ui/MediaImage";

const thumbs = [
  images.gallery.render5,
  images.gallery.render6,
  images.gallery.render7,
  images.gallery.hero,
];

export function GallerySection() {
  return (
    <section
      id="gallery"
      className="sd-section sd-gallery theme-dark"
      data-theme="dark"
      data-header-theme="dark"
    >
      <div className="sd-gallery__stage">
        <div className="sd-gallery__feature">
          <MediaImage src={images.gallery.render2} alt="Son Daven" priority={false} sizes="100vw" />
          <div className="sd-gallery__feature-grad" aria-hidden="true" />
        </div>
        <div className="sd-container sd-gallery__overlay">
          <p className="p3">PROJECT</p>
          <h2 className="h1 sd-gallery__title">SON DAVEN</h2>
          <p className="p4 sd-gallery__lead">
            Son Daven is designed to restore energy, deliver profit, inspire, and
            prove that true relaxation is not a place—it’s a state of mind. See
            you in Son Daven.
          </p>
        </div>
      </div>

      <div className="sd-container">
        <div className="sd-gallery__thumbs">
          {thumbs.map((src, i) => (
            <div key={src} className="sd-gallery__thumb">
              <MediaImage src={src} alt={`Son Daven view ${i + 1}`} sizes="25vw" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
