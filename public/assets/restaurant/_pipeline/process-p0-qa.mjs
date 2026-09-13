import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const SRC = "C:/Users/avail/.cursor/projects/c-Users-avail-son-daven-clone/assets";
const OUT = path.resolve("public/assets/restaurant");

const jobs = [
  { src: "restaurant-story-src.png", out: "story/restaurant-story.webp", w: 2560, h: 1760 },
  { src: "experience-signature-src.png", out: "experiences/experience-signature.webp", w: 1200, h: 1935 },
  { src: "experience-guinness-src.png", out: "experiences/experience-guinness.webp", w: 1200, h: 1935 },
  { src: "experience-match-day-src.png", out: "experiences/experience-match-day.webp", w: 1200, h: 1935 },
  { src: "experience-brunch-src.png", out: "experiences/experience-brunch.webp", w: 1200, h: 1935 },
  { src: "experience-private-dining-src.png", out: "experiences/experience-private-dining.webp", w: 1200, h: 1935 },
  { src: "experience-night-src.png", out: "experiences/experience-night.webp", w: 1200, h: 1935 },
  { src: "restaurant-food-state-src.png", out: "states/restaurant-food-state.webp", w: 2560, h: 1600 },
  { src: "restaurant-drinks-state-src.png", out: "states/restaurant-drinks-state.webp", w: 2560, h: 1600 },
  { src: "restaurant-gallery-01-src.png", out: "gallery/features/restaurant-gallery-01.webp", w: 2560, h: 1536 },
  { src: "restaurant-gallery-05-src.png", out: "gallery/features/restaurant-gallery-05.webp", w: 2560, h: 1536 },
  { src: "restaurant-gallery-thumb-01-src.png", out: "gallery/thumbs/restaurant-gallery-thumb-01.webp", w: 1200, h: 1600 },
  { src: "restaurant-gallery-thumb-03-src.png", out: "gallery/thumbs/restaurant-gallery-thumb-03.webp", w: 1200, h: 1600 },
  { src: "restaurant-gallery-thumb-05-src.png", out: "gallery/thumbs/restaurant-gallery-thumb-05.webp", w: 1200, h: 1600 },
  { src: "restaurant-cta-src.png", out: "atmosphere/restaurant-cta.webp", w: 2560, h: 1536 },
];

for (const job of jobs) {
  const dest = path.join(OUT, job.out);
  await mkdir(path.dirname(dest), { recursive: true });
  const info = await sharp(path.join(SRC, job.src))
    .resize(job.w, job.h, { fit: "cover", position: "centre" })
    .webp({ quality: 85 })
    .toFile(dest);
  console.log(job.out, info.width, info.height, info.size);
}
