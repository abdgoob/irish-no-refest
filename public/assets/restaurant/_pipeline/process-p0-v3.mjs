import sharp from "sharp";
import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";

const SRC = "C:/Users/avail/.cursor/projects/c-Users-avail-son-daven-clone/assets";
const OUT = path.resolve("public/assets/restaurant");

const jobs = [
  {
    src: "experience-match-day-src.png",
    out: "experiences/experience-match-day.webp",
    keep: "experiences/_src-experience-match-day.png",
    w: 1200,
    h: 1935,
  },
  {
    src: "restaurant-story-src.png",
    out: "story/restaurant-story.webp",
    keep: "story/_src-restaurant-story.png",
    w: 2560,
    h: 1760,
  },
  {
    src: "restaurant-gallery-01-src.png",
    out: "gallery/features/restaurant-gallery-01.webp",
    keep: "gallery/features/_src-restaurant-gallery-01.png",
    w: 2560,
    h: 1536,
  },
  {
    src: "restaurant-cta-src.png",
    out: "atmosphere/restaurant-cta.webp",
    keep: "atmosphere/_src-restaurant-cta.png",
    w: 2560,
    h: 1536,
  },
  {
    src: "restaurant-gallery-05-src.png",
    out: "gallery/features/restaurant-gallery-05.webp",
    keep: "gallery/features/_src-restaurant-gallery-05.png",
    w: 2560,
    h: 1536,
  },
  {
    src: "experience-guinness-src.png",
    out: "experiences/experience-guinness.webp",
    keep: "experiences/_src-experience-guinness.png",
    w: 1200,
    h: 1935,
  },
  {
    src: "restaurant-food-state-src.png",
    out: "states/restaurant-food-state.webp",
    keep: "states/_src-restaurant-food-state.png",
    w: 2560,
    h: 1600,
  },
  {
    src: "restaurant-gallery-thumb-03-src.png",
    out: "gallery/thumbs/restaurant-gallery-thumb-03.webp",
    keep: "gallery/thumbs/_src-restaurant-gallery-thumb-03.png",
    w: 1200,
    h: 1600,
  },
];

for (const job of jobs) {
  const dest = path.join(OUT, job.out);
  const keep = path.join(OUT, job.keep);
  await mkdir(path.dirname(dest), { recursive: true });
  await copyFile(path.join(SRC, job.src), keep);
  const info = await sharp(path.join(SRC, job.src))
    .resize(job.w, job.h, { fit: "cover", position: "centre" })
    .webp({ quality: 85 })
    .toFile(dest);
  console.log(job.out, info.width, info.height, info.size);
}
