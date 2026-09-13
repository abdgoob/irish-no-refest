import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const SRC_ROOT = "C:/Users/avail/.cursor/projects/c-Users-avail-son-daven-clone/assets";
const OUT_ROOT = path.resolve("public/assets/restaurant");

const jobs = [
  { src: "restaurant-story-src.png", out: "story/restaurant-story.webp", w: 2560, h: 1760 },
  { src: "restaurant-hero-mobile-src.png", out: "hero/restaurant-hero-mobile.webp", w: 1080, h: 1920 },
  ...["experience-signature","experience-guinness","experience-live-music","experience-match-day","experience-brunch","experience-cocktails","experience-private-dining","experience-night"].map((name)=>({ src:`${name}-src.png`, out:`experiences/${name}.webp`, w:1200, h:1935 })),
  { src: "restaurant-food-state-src.png", out: "states/restaurant-food-state.webp", w: 2560, h: 1600 },
  { src: "restaurant-drinks-state-src.png", out: "states/restaurant-drinks-state.webp", w: 2560, h: 1600 },
  ...[1,2,3,4,5].map((n)=>({ src:`restaurant-gallery-0${n}-src.png`, out:`gallery/features/restaurant-gallery-0${n}.webp`, w:2560, h:1536 })),
  ...[1,2,3,4,5].map((n)=>({ src:`restaurant-gallery-thumb-0${n}-src.png`, out:`gallery/thumbs/restaurant-gallery-thumb-0${n}.webp`, w:1200, h:1600 })),
  { src: "restaurant-cta-src.png", out: "atmosphere/restaurant-cta.webp", w: 2560, h: 1536 },
];

const report = [];
for (const job of jobs) {
  const srcPath = path.join(SRC_ROOT, job.src);
  const outPath = path.join(OUT_ROOT, job.out);
  await mkdir(path.dirname(outPath), { recursive: true });
  const info = await sharp(srcPath).resize(job.w, job.h, { fit: "cover", position: "centre" }).webp({ quality: 85 }).toFile(outPath);
  report.push({ out: job.out, width: info.width, height: info.height, bytes: info.size });
}
console.log(JSON.stringify(report, null, 2));
