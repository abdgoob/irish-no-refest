import sharp from "sharp";
import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";

const SRC = "C:/Users/avail/.cursor/projects/c-Users-avail-son-daven-clone/assets";
const OUT = path.resolve("public/assets/restaurant");
const QA = path.resolve("public/assets/restaurant/_pipeline/qa-candidates-food-final");

const archive = [
  "food-final-c1.png",
  "food-final-c2.png",
  "food-final-c3.png",
  "food-final-c4.png",
  "food-final-c5.png",
  "food-final-c6.png",
  "food-final-c7.png",
  "food-final-c8.png",
  "food-final-c9.png",
  "food-final-c10.png",
];

await mkdir(QA, { recursive: true });
for (const file of archive) {
  await copyFile(path.join(SRC, file), path.join(QA, file));
}

const dest = path.join(OUT, "states/restaurant-food-state.webp");
const keep = path.join(OUT, "states/_src-restaurant-food-state.png");
await mkdir(path.dirname(dest), { recursive: true });
await copyFile(path.join(SRC, "food-final-c6.png"), keep);

const info = await sharp(path.join(SRC, "food-final-c6.png"))
  .resize(2560, 1600, { fit: "cover", position: "centre" })
  .webp({ quality: 85 })
  .toFile(dest);

console.log("food-state", info.width, info.height, info.size);
