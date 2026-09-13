import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const out = "public/assets/restaurant/_pipeline/qa-preview-p1";
await mkdir(out, { recursive: true });

const files = [
  ["public/assets/restaurant/atmosphere/restaurant-heritage-bg.webp", "heritage.png"],
  ["public/assets/restaurant/atmosphere/restaurant-factoids.webp", "factoids.png"],
  ["public/assets/restaurant/atmosphere/restaurant-footer.webp", "footer.png"],
  ["public/assets/restaurant/menu/menu-drinks.webp", "menu-drinks.png"],
];

for (const [src, name] of files) {
  await sharp(src).png().toFile(`${out}/${name}`);
  const m = await sharp(src).metadata();
  console.log(name, m.width, m.height);
}
