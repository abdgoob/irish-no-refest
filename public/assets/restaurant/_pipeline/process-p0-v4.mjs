import sharp from "sharp";
import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";

const SRC = "C:/Users/avail/.cursor/projects/c-Users-avail-son-daven-clone/assets";
const OUT = path.resolve("public/assets/restaurant");
const QA = path.resolve("public/assets/restaurant/_pipeline/qa-candidates-v4");

const winners = [
  {
    src: "match-day-c2.png",
    out: "experiences/experience-match-day.webp",
    keep: "experiences/_src-experience-match-day.png",
    w: 1200,
    h: 1935,
  },
  {
    src: "story-c1.png",
    out: "story/restaurant-story.webp",
    keep: "story/_src-restaurant-story.png",
    w: 2560,
    h: 1760,
  },
  {
    src: "food-state-c1.png",
    out: "states/restaurant-food-state.webp",
    keep: "states/_src-restaurant-food-state.png",
    w: 2560,
    h: 1600,
  },
  {
    src: "gallery05-c3.png",
    out: "gallery/features/restaurant-gallery-05.webp",
    keep: "gallery/features/_src-restaurant-gallery-05.png",
    w: 2560,
    h: 1536,
  },
];

const archive = [
  "match-day-c1.png",
  "match-day-c2.png",
  "match-day-c3.png",
  "story-c1.png",
  "story-c2.png",
  "story-c3.png",
  "food-state-c1.png",
  "food-state-c2.png",
  "food-state-c3.png",
  "gallery05-c1.png",
  "gallery05-c2.png",
  "gallery05-c3.png",
];

await mkdir(QA, { recursive: true });
for (const file of archive) {
  await copyFile(path.join(SRC, file), path.join(QA, file));
}

for (const job of winners) {
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
