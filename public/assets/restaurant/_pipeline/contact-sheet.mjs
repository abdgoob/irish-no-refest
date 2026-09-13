import sharp from "sharp";
import path from "node:path";
const root = "public/assets/restaurant";
const picks = [
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
  "atmosphere/restaurant-cta.webp",
];
const cellW = 320, cellH = 200, cols = 4;
const rows = Math.ceil(picks.length / cols);
const composites = [];
for (let i = 0; i < picks.length; i++) {
  const p = path.join(root, picks[i]);
  const buf = await sharp(p).resize(cellW, cellH, { fit: "cover" }).toBuffer();
  composites.push({ input: buf, left: (i % cols) * cellW, top: Math.floor(i / cols) * cellH });
}
await sharp({ create: { width: cols * cellW, height: rows * cellH, channels: 3, background: { r: 44, g: 40, b: 36 } } })
  .composite(composites)
  .webp({ quality: 82 })
  .toFile("public/assets/restaurant/_pipeline/p0-contact-sheet.webp");
console.log("ok", picks.length);
