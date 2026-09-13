import sharp from "sharp";
import path from "node:path";

const root = "public/assets/restaurant";
const cellW = 720;
const cellH = 480;
const labelH = 40;
const cols = 2;

const crops = [
  {
    title: "MATCH-DAY FACES / GLASSES",
    file: "experiences/experience-match-day.webp",
    extract: { left: 40, top: 180, width: 1120, height: 980 },
  },
  {
    title: "STORY HANDS + FOOD",
    file: "story/restaurant-story.webp",
    extract: { left: 520, top: 180, width: 1700, height: 1400 },
  },
  {
    title: "FOOD-STATE CHIPS / MEAT",
    file: "states/restaurant-food-state.webp",
    extract: { left: 620, top: 220, width: 1700, height: 1200 },
  },
  {
    title: "GALLERY-05 WINDOWS / STREET",
    file: "gallery/features/restaurant-gallery-05.webp",
    extract: { left: 680, top: 160, width: 1700, height: 1200 },
  },
];

const width = cols * cellW;
let y = 0;
const composites = [];
const rows = Math.ceil(crops.length / cols);

for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    const item = crops[r * cols + c];
    if (!item) continue;
    const svg = Buffer.from(
      `<svg width="${cellW}" height="${labelH}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#2c2824"/>
        <text x="16" y="26" fill="#a89474" font-size="16" font-family="Georgia, serif">${item.title}</text>
      </svg>`,
    );
    composites.push({ input: svg, left: c * cellW, top: y });
  }
  y += labelH;
  for (let c = 0; c < cols; c++) {
    const item = crops[r * cols + c];
    if (!item) continue;
    const meta = await sharp(path.join(root, item.file)).metadata();
    const ex = { ...item.extract };
    if (ex.left + ex.width > meta.width) ex.width = meta.width - ex.left;
    if (ex.top + ex.height > meta.height) ex.height = meta.height - ex.top;
    const buf = await sharp(path.join(root, item.file))
      .extract(ex)
      .resize(cellW, cellH, { fit: "cover" })
      .toBuffer();
    composites.push({ input: buf, left: c * cellW, top: y });
  }
  y += cellH;
}

await sharp({
  create: {
    width,
    height: y,
    channels: 3,
    background: { r: 44, g: 40, b: 36 },
  },
})
  .composite(composites)
  .webp({ quality: 85 })
  .toFile("public/assets/restaurant/_pipeline/p0-final-detail-qa.webp");

console.log("p0-final-detail-qa", width, y);
