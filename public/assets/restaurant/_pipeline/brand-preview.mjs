import sharp from "sharp";
import { readFile } from "node:fs/promises";

const wordmarkRaw = await readFile(
  "public/assets/restaurant/brand/demo-pub-wordmark.svg",
  "utf8",
);

async function wordmarkPng(color, w, h) {
  const svg = wordmarkRaw.replaceAll("currentColor", color);
  return sharp(Buffer.from(svg)).resize(w, h, { fit: "contain" }).png().toBuffer();
}

const cols = [
  { name: "DARK BROWN", bg: { r: 44, g: 40, b: 36 }, ink: "#f3ead8" },
  { name: "TAUPE", bg: { r: 168, g: 148, b: 116 }, ink: "#2c2824" },
];

const sizes = [
  { name: "DESKTOP HEADER  224×24", w: 224, h: 24 },
  { name: "MOBILE HEADER  125×13", w: 125, h: 13 },
  { name: "HERO LOCKUP  800×86", w: 800, h: 86 },
];

const colW = 640;
const rowH = 280;
const labelH = 44;
const width = colW * 3;
const height = labelH + rowH * sizes.length;

const composites = [];

const title = Buffer.from(
  `<svg width="${width}" height="${labelH}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#1c1916"/>
    <text x="24" y="30" fill="#a89474" font-size="20" font-family="Georgia, serif">TEMPORARY DEMO WORDMARK  —  THE HOUSE</text>
  </svg>`,
);
composites.push({ input: title, left: 0, top: 0 });

const heroBg = await sharp("public/assets/restaurant/hero/restaurant-hero-fallback.webp")
  .resize(colW, rowH * sizes.length, { fit: "cover", position: "centre" })
  .modulate({ brightness: 0.55 })
  .toBuffer();
composites.push({ input: heroBg, left: colW * 2, top: labelH });

for (let c = 0; c < 2; c++) {
  const plate = await sharp({
    create: {
      width: colW,
      height: rowH * sizes.length,
      channels: 3,
      background: cols[c].bg,
    },
  })
    .png()
    .toBuffer();
  composites.push({ input: plate, left: c * colW, top: labelH });
}

for (let r = 0; r < sizes.length; r++) {
  const size = sizes[r];
  for (let c = 0; c < 3; c++) {
    const ink = c === 1 ? "#2c2824" : "#f3ead8";
    const mark = await wordmarkPng(ink, size.w, size.h);
    const caption = Buffer.from(
      `<svg width="${colW}" height="28" xmlns="http://www.w3.org/2000/svg">
        <text x="20" y="20" fill="${c === 1 ? "#2c2824" : "#a89474"}" font-size="13" font-family="Georgia, serif">${c === 2 ? "HERO FALLBACK  ·  " : ""}${size.name}</text>
      </svg>`,
    );
    composites.push({
      input: caption,
      left: c * colW,
      top: labelH + r * rowH + 16,
    });
    composites.push({
      input: mark,
      left: c * colW + Math.round((colW - size.w) / 2),
      top: labelH + r * rowH + Math.round((rowH - size.h) / 2) + 8,
    });
  }
}

await sharp({
  create: {
    width,
    height,
    channels: 3,
    background: { r: 28, g: 25, b: 22 },
  },
})
  .composite(composites)
  .webp({ quality: 85 })
  .toFile("public/assets/restaurant/_pipeline/brand-preview.webp");

console.log("brand-preview", width, height);
