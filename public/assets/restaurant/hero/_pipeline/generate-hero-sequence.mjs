/**
 * Restaurant hero — 72-frame virtual dolly from approved master (single fixed scene).
 * Output: ../frames/000.webp … 071.webp @ 1920×960 WebP q=84
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRAMES_DIR = path.join(__dirname, "..", "frames");
const PIPELINE = __dirname;

const MASTER_PATH =
  process.env.HERO_MASTER ??
  "C:\\Users\\avail\\.cursor\\projects\\c-Users-avail-son-daven-clone\\assets\\c__Users_avail_AppData_Roaming_Cursor_User_workspaceStorage_1c0e3ff7e6976e2748dc7c62aa44af7b_images_restaurant_hero_fallback-Picsart-AiImageEnhancer-aa62c44a-b436-4f24-9af4-bb84b91d2590.jpg";

const OUT_W = 1920;
const OUT_H = 960;
const FRAME_COUNT = 72;
const WEBP_QUALITY = 84;
const WORK_W = 3840;
const WORK_H = 2160;

/** Scroll easing: slow open → accel → steady → decel → settle (monotonic 0→1). */
function frameProgress(i) {
  const n = FRAME_COUNT - 1;
  const t = i / n;
  let p;
  if (i <= 10) p = 0.035 * easeInOutCubic(i / 10);
  else if (i <= 28) p = 0.035 + 0.27 * easeInOutCubic((i - 10) / (28 - 10));
  else if (i <= 52) p = 0.305 + 0.48 * ((i - 28) / (52 - 28));
  else if (i <= 65) p = 0.785 + 0.165 * easeOutCubic((i - 52) / (65 - 52));
  else p = 0.95 + 0.05 * easeOutCubic((i - 65) / (n - 65));
  return Math.min(1, Math.max(0, p));
}

function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}
function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3);
}

/** Zoom: 1 = full 2:1 extract; higher = tighter (camera closer). Exponential for even perceived motion. */
function zoomAtProgress(p) {
  const zStart = 7.5;
  const zEnd = 1.0;
  return zStart * Math.pow(zEnd / zStart, p);
}

/** Vanishing point — center arch, slightly above midline */
const CENTER_X = 0.5;
const CENTER_Y = 0.52;

async function buildWorkCanvas() {
  const buf = await sharp(MASTER_PATH)
    .resize(WORK_W, WORK_H, {
      kernel: sharp.kernel.lanczos3,
      fit: "fill",
    })
    .sharpen({ sigma: 0.6, m1: 0.5, m2: 0.3 })
    .png()
    .toBuffer();
  return buf;
}

/**
 * Extract 2:1 region from work canvas with virtual zoom around (cx,cy).
 * zoom=1 → maximum 2:1 crop; zoom>1 → smaller region (closer camera).
 */
async function renderFrame(workBuf, zoom) {
  const meta = { width: WORK_W, height: WORK_H };
  const maxCropW = Math.min(meta.width, meta.height * 2);
  const maxCropH = maxCropW / 2;

  let cropW = maxCropW / zoom;
  let cropH = maxCropH / zoom;

  const cx = CENTER_X * meta.width;
  const cy = CENTER_Y * meta.height;

  let left = cx - cropW / 2;
  let top = cy - cropH / 2;

  left = Math.max(0, Math.min(meta.width - cropW, left));
  top = Math.max(0, Math.min(meta.height - cropH, top));

  cropW = Math.max(2, Math.round(cropW));
  cropH = Math.max(2, Math.round(cropH));
  left = Math.round(left);
  top = Math.round(top);

  return sharp(workBuf)
    .extract({
      left,
      top,
      width: cropW,
      height: cropH,
    })
    .resize(OUT_W, OUT_H, { kernel: sharp.kernel.lanczos3 })
    .webp({ quality: WEBP_QUALITY, effort: 6 })
    .toBuffer();
}

async function main() {
  fs.mkdirSync(FRAMES_DIR, { recursive: true });

  const masterCopy = path.join(PIPELINE, "master-approved.jpg");
  if (!fs.existsSync(masterCopy)) {
    fs.copyFileSync(MASTER_PATH, masterCopy);
  }

  console.log("Building work canvas from approved master…");
  const workBuf = await buildWorkCanvas();

  const anchorIndices = [0, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 71];
  const keyIndices = [0, 12, 24, 36, 48, 60, 71];

  const zoomByFrame = [];
  for (let i = 0; i < FRAME_COUNT; i++) {
    zoomByFrame.push(zoomAtProgress(frameProgress(i)));
  }
  const minStep = 0.004;
  for (let i = 1; i < FRAME_COUNT; i++) {
    if (zoomByFrame[i - 1] - zoomByFrame[i] < minStep) {
      zoomByFrame[i] = Math.max(1.0, zoomByFrame[i - 1] - minStep);
    }
  }
  zoomByFrame[FRAME_COUNT - 1] = 1.0;
  for (let i = FRAME_COUNT - 2; i >= 0; i--) {
    if (zoomByFrame[i] <= zoomByFrame[i + 1]) {
      zoomByFrame[i] = zoomByFrame[i + 1] + minStep;
    }
  }

  for (let i = 0; i < FRAME_COUNT; i++) {
    const p = frameProgress(i);
    const zoom = zoomByFrame[i];
    const outPath = path.join(FRAMES_DIR, `${String(i).padStart(3, "0")}.webp`);
    const webp = await renderFrame(workBuf, zoom);
    fs.writeFileSync(outPath, webp);
    if (i % 12 === 0 || i === FRAME_COUNT - 1) {
      console.log(`Frame ${String(i).padStart(3, "0")}  p=${p.toFixed(3)}  zoom=${zoom.toFixed(3)}`);
    }
  }

  await buildContactSheets(anchorIndices, keyIndices);
  await buildDiffReport();
  console.log("Done.");
}

async function buildContactSheets(anchorIndices, keyIndices) {
  const load = (i) =>
    path.join(FRAMES_DIR, `${String(i).padStart(3, "0")}.webp`);

  async function sheet(indices, cols, cellW, cellH, outName) {
    const rows = Math.ceil(indices.length / cols);
    const canvas = sharp({
      create: {
        width: cols * cellW,
        height: rows * cellH,
        channels: 3,
        background: { r: 12, g: 12, b: 14 },
      },
    });

    const composites = [];
    for (let j = 0; j < indices.length; j++) {
      const col = j % cols;
      const row = Math.floor(j / cols);
      const thumb = await sharp(load(indices[j]))
        .resize(cellW, cellH, { fit: "cover" })
        .toBuffer();
      composites.push({ input: thumb, left: col * cellW, top: row * cellH });
    }
    await canvas
      .composite(composites)
      .webp({ quality: 82 })
      .toFile(path.join(PIPELINE, outName));
  }

  await sheet(anchorIndices, 7, 384, 192, "hero-sequence-anchors.webp");
  await sheet(keyIndices, 4, 480, 240, "hero-sequence-keyframes.webp");

  const everyFourth = [];
  for (let i = 0; i < FRAME_COUNT; i += 4) everyFourth.push(i);
  await sheet(everyFourth, 9, 256, 128, "hero-sequence-contact-sheet.webp");
}

async function buildDiffReport() {
  const report = {
    frameCount: FRAME_COUNT,
    dimensions: { width: OUT_W, height: OUT_H },
    pairs: [],
    flagged: [],
  };

  let prev = null;
  for (let i = 0; i < FRAME_COUNT; i++) {
    const fp = path.join(FRAMES_DIR, `${String(i).padStart(3, "0")}.webp`);
    const small = await sharp(fp)
      .resize(320, 160, { fit: "fill" })
      .raw()
      .toBuffer();
    if (prev) {
      let sum = 0;
      for (let p = 0; p < small.length; p++) {
        sum += Math.abs(small[p] - prev[p]);
      }
      const normalized = sum / (small.length * 255);
      const entry = { from: i - 1, to: i, normalizedDiff: Number(normalized.toFixed(5)) };
      report.pairs.push(entry);
      if (normalized > 0.045) report.flagged.push(entry);
    }
    prev = small;
  }

  fs.writeFileSync(
    path.join(PIPELINE, "frame-diff-report.json"),
    JSON.stringify(report, null, 2),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
