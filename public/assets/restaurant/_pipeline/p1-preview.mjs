import sharp from "sharp";

await sharp("public/assets/restaurant/_pipeline/p1-contact-sheet.webp").png().toFile(
  "public/assets/restaurant/_pipeline/p1-contact-sheet.png",
);
await sharp("public/assets/restaurant/_pipeline/brand-preview.webp").png().toFile(
  "public/assets/restaurant/_pipeline/brand-preview.png",
);
console.log("png previews written");
