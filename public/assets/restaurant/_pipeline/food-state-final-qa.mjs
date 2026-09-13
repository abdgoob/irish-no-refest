import sharp from "sharp";
import path from "node:path";

const src = "public/assets/restaurant/states/restaurant-food-state.webp";
const cellW = 640;
const cellH = 400;
const labelH = 36;
const cols = 3;

const tiles = [
  { title: "FULL FRAME", extract: null },
  { title: "MEAT 100%", extract: { left: 280, top: 720, width: 900, height: 720 } },
  { title: "CHIPS 100%", extract: { left: 1480, top: 640, width: 900, height: 720 } },
  { title: "BREAD 100%", extract: { left: 40, top: 620, width: 780, height: 720 } },
  { title: "CUTLERY 100%", extract: { left: 80, top: 900, width: 720, height: 640 } },
  { title: "GLASS / GUEST", extract: { left: 1680, top: 80, width: 820, height: 700 } },
];

const width = cols * cellW;
let y = 0;
const composites = [];
const rows = Math.ceil(tiles.length / cols);
const meta = await sharp(src).metadata();

for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    const item = tiles[r * cols + c];
    if (!item) continue;
    const svg = Buffer.from(
      `<svg width="${cellW}" height="${labelH}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#2c2824"/>
        <text x="14" y="24" fill="#a89474" font-size="15" font-family="Georgia, serif">${item.title}</text>
      </svg>`,
    );
    composites.push({ input: svg, left: c * cellW, top: y });
  }
  y += labelH;
  for (let c = 0; c < cols; c++) {
    const item = tiles[r * cols + c];
    if (!item) continue;
    let pipeline = sharp(src);
    if (item.extract) {
      const ex = { ...item.extract };
      if (ex.left + ex.width > meta.width) ex.width = meta.width - ex.left;
      if (ex.top + ex.height > meta.height) ex.height = meta.height - ex.top;
      pipeline = pipeline.extract(ex);
    }
    const buf = await pipeline.resize(cellW, cellH, { fit: "cover" }).toBuffer();
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
  .toFile("public/assets/restaurant/_pipeline/food-state-final-qa.webp");

console.log("food-state-final-qa", width, y);
