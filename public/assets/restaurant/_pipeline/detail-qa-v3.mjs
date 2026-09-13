import sharp from "sharp";
import path from "node:path";

const root = "public/assets/restaurant";
const cellW = 640;
const cellH = 420;
const labelH = 40;
const cols = 3;

const crops = [
  {
    title: "MATCH-DAY SIGNAGE",
    file: "experiences/experience-match-day.webp",
    extract: { left: 80, top: 40, width: 1040, height: 720 },
  },
  {
    title: "GUINNESS GLASS",
    file: "experiences/experience-guinness.webp",
    extract: { left: 260, top: 80, width: 680, height: 900 },
  },
  {
    title: "FOOD-STATE PROTEIN",
    file: "states/restaurant-food-state.webp",
    extract: { left: 480, top: 280, width: 1400, height: 1000 },
  },
  {
    title: "GALLERY-03 TAPS",
    file: "gallery/features/restaurant-gallery-03.webp",
    extract: { left: 720, top: 0, width: 1400, height: 1100 },
  },
  {
    title: "GALLERY-05 EXTERIOR",
    file: "gallery/features/restaurant-gallery-05.webp",
    extract: { left: 900, top: 80, width: 1500, height: 1300 },
  },
  {
    title: "CTA CENTER-SAFE",
    file: "atmosphere/restaurant-cta.webp",
    extract: { left: 640, top: 345, width: 1280, height: 690 },
  },
];

const width = cols * cellW;
let y = 0;
const composites = [];

for (let i = 0; i < crops.length; i++) {
  const col = i % cols;
  const row = Math.floor(i / cols);
  if (col === 0) {
    // labels for the row
  }
}

// Build label+cell pairs in row-major order
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
  .toFile("public/assets/restaurant/_pipeline/p0-detail-qa-v3.webp");

console.log("detail-qa-v3", width, y);
