import sharp from "sharp";
import path from "node:path";

const root = "public/assets/restaurant";
const cellW = 480;
const cellH = 300;
const labelH = 48;
const cols = 4;

const sections = [
  {
    title: "MENU",
    files: [
      "menu/menu-starters.webp",
      "menu/menu-irish-classics.webp",
      "menu/menu-mains.webp",
      "menu/menu-burgers.webp",
      "menu/menu-desserts.webp",
      "menu/menu-drinks.webp",
    ],
  },
  {
    title: "EVENTS",
    files: [
      "events/event-live-music.webp",
      "events/event-match-day.webp",
      "events/event-brunch.webp",
      "events/event-private.webp",
    ],
  },
  {
    title: "ATMOSPHERE",
    files: [
      "atmosphere/restaurant-heritage-bg.webp",
      "atmosphere/restaurant-factoids.webp",
      "atmosphere/restaurant-footer.webp",
    ],
  },
];

let y = 0;
const composites = [];
const width = cols * cellW;

for (const section of sections) {
  const svg = Buffer.from(
    `<svg width="${width}" height="${labelH}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#2c2824"/>
      <text x="24" y="32" fill="#a89474" font-size="22" font-family="Georgia, serif">${section.title}</text>
    </svg>`,
  );
  composites.push({ input: svg, left: 0, top: y });
  y += labelH;

  const rows = Math.ceil(section.files.length / cols);
  for (let i = 0; i < section.files.length; i++) {
    const src = path.join(root, section.files[i]);
    const buf = await sharp(src)
      .resize(cellW, cellH, { fit: "cover", position: "centre" })
      .toBuffer();
    composites.push({
      input: buf,
      left: (i % cols) * cellW,
      top: y + Math.floor(i / cols) * cellH,
    });
  }
  y += rows * cellH;
}

const wordLabel = Buffer.from(
  `<svg width="${width}" height="${labelH}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#2c2824"/>
    <text x="24" y="32" fill="#a89474" font-size="22" font-family="Georgia, serif">WORDMARK</text>
  </svg>`,
);
composites.push({ input: wordLabel, left: 0, top: y });
y += labelH;

const wordSvg = await sharp("public/assets/restaurant/brand/demo-pub-wordmark.svg")
  .resize(720, 77, { fit: "contain", background: { r: 44, g: 40, b: 36, alpha: 1 } })
  .png()
  .toBuffer();
const wordPlate = await sharp({
  create: {
    width: cellW * 2,
    height: cellH,
    channels: 3,
    background: { r: 44, g: 40, b: 36 },
  },
})
  .composite([{ input: wordSvg, gravity: "centre" }])
  .png()
  .toBuffer();
composites.push({ input: wordPlate, left: 0, top: y });

const markSvg = await sharp("public/assets/restaurant/brand/demo-pub-mark.svg")
  .resize(96, 96, { fit: "contain", background: { r: 168, g: 148, b: 116, alpha: 1 } })
  .png()
  .toBuffer();
const markPlate = await sharp({
  create: {
    width: cellW,
    height: cellH,
    channels: 3,
    background: { r: 168, g: 148, b: 116 },
  },
})
  .composite([{ input: markSvg, gravity: "centre" }])
  .png()
  .toBuffer();
composites.push({ input: markPlate, left: cellW * 2, top: y });
y += cellH;

await sharp({
  create: {
    width,
    height: y,
    channels: 3,
    background: { r: 44, g: 40, b: 36 },
  },
})
  .composite(composites)
  .webp({ quality: 82 })
  .toFile("public/assets/restaurant/_pipeline/p1-contact-sheet.webp");

console.log("p1-contact-sheet", width, y);
