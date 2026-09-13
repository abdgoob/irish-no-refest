import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const files = [
  "hero/restaurant-hero-fallback.webp",
  "hero/restaurant-hero-mobile.webp",
  "story/restaurant-story.webp",
  "experiences/experience-signature.webp",
  "experiences/experience-guinness.webp",
  "experiences/experience-live-music.webp",
  "experiences/experience-match-day.webp",
  "experiences/experience-brunch.webp",
  "experiences/experience-cocktails.webp",
  "experiences/experience-private-dining.webp",
  "experiences/experience-night.webp",
  "states/restaurant-food-state.webp",
  "states/restaurant-drinks-state.webp",
  "gallery/features/restaurant-gallery-01.webp",
  "gallery/features/restaurant-gallery-02.webp",
  "gallery/features/restaurant-gallery-03.webp",
  "gallery/features/restaurant-gallery-04.webp",
  "gallery/features/restaurant-gallery-05.webp",
  "gallery/thumbs/restaurant-gallery-thumb-01.webp",
  "gallery/thumbs/restaurant-gallery-thumb-02.webp",
  "gallery/thumbs/restaurant-gallery-thumb-03.webp",
  "gallery/thumbs/restaurant-gallery-thumb-04.webp",
  "gallery/thumbs/restaurant-gallery-thumb-05.webp",
  "atmosphere/restaurant-cta.webp",
];

const destDir = "public/assets/restaurant/_pipeline/qa-preview";
await mkdir(destDir, { recursive: true });

for (const f of files) {
  const src = path.join("public/assets/restaurant", f);
  const dest = path.join(destDir, path.basename(f, ".webp") + ".png");
  await sharp(src)
    .resize({ width: 1400, height: 1400, fit: "inside", withoutEnlargement: true })
    .png({ compressionLevel: 6 })
    .toFile(dest);
  console.log(dest);
}
