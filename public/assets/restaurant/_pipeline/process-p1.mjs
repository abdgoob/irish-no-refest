import sharp from "sharp";
import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";

const SRC = "C:/Users/avail/.cursor/projects/c-Users-avail-son-daven-clone/assets";
const OUT = path.resolve("public/assets/restaurant");
const QA = path.resolve("public/assets/restaurant/_pipeline/qa-candidates-p1");

const jobs = [
  {
    src: "p1-menu-starters.png",
    out: "menu/menu-starters.webp",
    keep: "menu/_src-menu-starters.png",
    w: 2400,
    h: 1800,
  },
  {
    src: "p1-menu-irish-classics.png",
    out: "menu/menu-irish-classics.webp",
    keep: "menu/_src-menu-irish-classics.png",
    w: 2400,
    h: 1800,
  },
  {
    src: "p1-menu-mains.png",
    out: "menu/menu-mains.webp",
    keep: "menu/_src-menu-mains.png",
    w: 2400,
    h: 1800,
  },
  {
    src: "p1-menu-burgers.png",
    out: "menu/menu-burgers.webp",
    keep: "menu/_src-menu-burgers.png",
    w: 2400,
    h: 1800,
  },
  {
    src: "p1-menu-desserts.png",
    out: "menu/menu-desserts.webp",
    keep: "menu/_src-menu-desserts.png",
    w: 2400,
    h: 1800,
  },
  {
    src: "p1-menu-drinks.png",
    out: "menu/menu-drinks.webp",
    keep: "menu/_src-menu-drinks.png",
    w: 2400,
    h: 1800,
  },
  {
    src: "p1-event-live-music.png",
    out: "events/event-live-music.webp",
    keep: "events/_src-event-live-music.png",
    w: 1600,
    h: 1200,
  },
  {
    src: "p1-event-match-day.png",
    out: "events/event-match-day.webp",
    keep: "events/_src-event-match-day.png",
    w: 1600,
    h: 1200,
  },
  {
    src: "p1-event-brunch.png",
    out: "events/event-brunch.webp",
    keep: "events/_src-event-brunch.png",
    w: 1600,
    h: 1200,
  },
  {
    src: "p1-event-private.png",
    out: "events/event-private.webp",
    keep: "events/_src-event-private.png",
    w: 1600,
    h: 1200,
  },
  {
    src: "p1-heritage-bg-v2.png",
    out: "atmosphere/restaurant-heritage-bg.webp",
    keep: "atmosphere/_src-restaurant-heritage-bg.png",
    w: 2560,
    h: 1440,
  },
  {
    src: "p1-factoids-v2.png",
    out: "atmosphere/restaurant-factoids.webp",
    keep: "atmosphere/_src-restaurant-factoids.png",
    w: 2560,
    h: 1200,
  },
  {
    src: "p1-footer-v2.png",
    out: "atmosphere/restaurant-footer.webp",
    keep: "atmosphere/_src-restaurant-footer.png",
    w: 2560,
    h: 1536,
  },
];

const archive = [
  "p1-menu-starters.png",
  "p1-menu-irish-classics.png",
  "p1-menu-mains.png",
  "p1-menu-burgers.png",
  "p1-menu-desserts.png",
  "p1-menu-drinks.png",
  "p1-event-live-music.png",
  "p1-event-match-day.png",
  "p1-event-brunch.png",
  "p1-event-private.png",
  "p1-heritage-bg.png",
  "p1-heritage-bg-v2.png",
  "p1-factoids.png",
  "p1-factoids-v2.png",
  "p1-footer.png",
  "p1-footer-v2.png",
];

await mkdir(QA, { recursive: true });
for (const file of archive) {
  await copyFile(path.join(SRC, file), path.join(QA, file));
}

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
