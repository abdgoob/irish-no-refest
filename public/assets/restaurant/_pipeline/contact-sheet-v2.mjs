import sharp from "sharp";
import path from "node:path";

const root = "public/assets/restaurant";
const cellW = 480;
const cellH = 300;
const labelH = 48;
const cols = 4;

const sections = [
  {
    title: "HERO",
    files: [
      "hero/restaurant-hero-fallback.webp",
      "hero/restaurant-hero-mobile.webp",
    ],
  },
  {
    title: "STORY",
    files: ["story/restaurant-story.webp"],
  },
  {
    title: "EXPERIENCES",
    files: [
      "experiences/experience-signature.webp",
      "experiences/experience-guinness.webp",
      "experiences/experience-live-music.webp",
      "experiences/experience-match-day.webp",
      "experiences/experience-brunch.webp",
      "experiences/experience-cocktails.webp",
      "experiences/experience-private-dining.webp",
      "experiences/experience-night.webp",
    ],
  },
  {
    title: "FOOD / DRINKS",
    files: [
      "states/restaurant-food-state.webp",
      "states/restaurant-drinks-state.webp",
    ],
  },
  {
    title: "GALLERY",
    files: [
      "gallery/features/restaurant-gallery-01.webp",
      "gallery/features/restaurant-gallery-02.webp",
      "gallery/features/restaurant-gallery-03.webp",
      "gallery/features/restaurant-gallery-04.webp",
      "gallery/features/restaurant-gallery-05.webp",
      "gallery/thumbs/restaurant-gallery-thumb-01.webp",
      "gallery/thumbs/restaurant-gallery-thumb-02.webp",
      "gallery/thumbs/restaurant-gallery-thumb-03.webp",
      "gallery/thumbs/restaurant-gallery-thumb-04.webp",
      "gallery/thumbs/restaurant-gallery-thumb-05.webp",
    ],
  },
  {
    title: "CTA",
    files: ["atmosphere/restaurant-cta.webp"],
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
    const buf = await sharp(path.join(root, section.files[i]))
      .resize(cellW, cellH, { fit: "cover" })
      .toBuffer();
    composites.push({
      input: buf,
      left: (i % cols) * cellW,
      top: y + Math.floor(i / cols) * cellH,
    });
  }
  y += rows * cellH;
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
  .webp({ quality: 82 })
  .toFile("public/assets/restaurant/_pipeline/p0-contact-sheet-v2.webp");

console.log("contact-sheet-v2", width, y);
