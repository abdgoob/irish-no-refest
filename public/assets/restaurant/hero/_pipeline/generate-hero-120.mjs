/**
 * Restaurant hero — 120-frame virtual dolly from approved master v2.
 * Crop-only; no per-frame AI. Output: ../frames/000.webp–119.webp @ 1920×960.
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
  "C:\\Users\\avail\\.cursor\\projects\\c-Users-avail-son-daven-clone\\assets\\c__Users_avail_AppData_Roaming_Cursor_User_workspaceStorage_1c0e3ff7e6976e2748dc7c62aa44af7b_images_ChatGPT_Image_Sep_14__2026__01_50_58_AM-a4fd4554-73ce-4a2f-a1c3-bca30c25e3a3.jpg";

const OUT_W = 1920;
const OUT_H = 960;
const FRAME_COUNT = 120;
const WEBP_QUALITY = 86;
const WORK_W = 4096;

const FOCAL_X = 0.52;
const FOCAL_Y = 0.52;

const OPENING_ZOOM_CANDIDATES = [1.7, 1.85, 2.0, 2.15, 2.3];

const BASE_KEYFRAMES = [
  [0, 2.0],
  [15, 1.9],
  [30, 1.72],
  [45, 1.53],
  [60, 1.36],
  [75, 1.22],
  [90, 1.11],
  [105, 1.04],
  [119, 1.0],
];

function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}
function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3);
}

/** Luxury camera progress 0→1 over frames 0…119 */
function cameraProgress(i) {
  const n = FRAME_COUNT - 1;
  if (i <= 12) return 0.028 * easeInOutCubic(i / 12);
  if (i <= 35) return 0.028 + 0.195 * easeInOutCubic((i - 12) / (35 - 12));
  if (i <= 78) return 0.223 + 0.552 * ((i - 35) / (78 - 35));
  if (i <= 101) return 0.775 + 0.175 * easeOutCubic((i - 78) / (101 - 78));
  return 0.95 + 0.05 * easeOutCubic((i - 101) / (n - 101));
}

function scaleZoomTable(z0) {
  return BASE_KEYFRAMES.map(([f, z]) => [f, 1 + (z - 1) * (z0 - 1)]);
}

function zoomFromProgress(p, z0) {
  const keys = scaleZoomTable(z0);
  const prog = keys.map(([f]) => cameraProgress(f));
  if (p <= prog[0]) return keys[0][1];
  if (p >= prog[prog.length - 1]) return keys[keys.length - 1][1];
  for (let k = 0; k < prog.length - 1; k++) {
    if (p >= prog[k] && p <= prog[k + 1]) {
      const t = (p - prog[k]) / (prog[k + 1] - prog[k]);
      const zA = keys[k][1];
      const zB = keys[k + 1][1];
      return zA + (zB - zA) * t;
    }
  }
  return 1;
}

function zoomAtFrame(i, z0) {
  return zoomFromProgress(cameraProgress(i), z0);
}

async function buildWorkCanvas() {
  const meta = await sharp(MASTER_PATH).metadata();
  const workH = Math.round(WORK_W * (meta.height / meta.width));
  return sharp(MASTER_PATH)
    .resize(WORK_W, workH, { kernel: sharp.kernel.lanczos3, fit: "fill" })
    .png()
    .toBuffer({ resolveWithObject: true });
}

function cropGeometry(workW, workH, zoom) {
  const maxCropW = Math.min(workW, workH * 2);
  const maxCropH = maxCropW / 2;
  let cropW = maxCropW / zoom;
  let cropH = maxCropH / zoom;
  const cx = FOCAL_X * workW;
  const cy = FOCAL_Y * workH;
  let left = cx - cropW / 2;
  let top = cy - cropH / 2;
  left = Math.max(0, Math.min(workW - cropW, left));
  top = Math.max(0, Math.min(workH - cropH, top));
  cropW = Math.max(2, Math.round(cropW));
  cropH = Math.max(2, Math.round(cropH));
  left = Math.round(left);
  top = Math.round(top);
  if (left + cropW > workW) left = workW - cropW;
  if (top + cropH > workH) top = workH - cropH;
  return { left, top, width: cropW, height: cropH };
}

async function renderFrame(workBuf, workW, workH, zoom) {
  const { left, top, width, height } = cropGeometry(workW, workH, zoom);
  return sharp(workBuf)
    .extract({ left, top, width, height })
    .resize(OUT_W, OUT_H, { kernel: sharp.kernel.lanczos3 })
    .webp({ quality: WEBP_QUALITY, effort: 6 })
    .toBuffer();
}

async function sharpnessScore(webpBuf) {
  const { data, info } = await sharp(webpBuf)
    .resize(480, 240)
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let sum = 0;
  let sumSq = 0;
  const n = data.length;
  for (let i = 0; i < n; i++) {
    sum += data[i];
    sumSq += data[i] * data[i];
  }
  const mean = sum / n;
  const variance = sumSq / n - mean * mean;
  return variance;
}

async function buildOpeningCropTest(workBuf, workW, workH) {
  const cellW = OUT_W;
  const cellH = OUT_H;
  const cols = OPENING_ZOOM_CANDIDATES.length;
  const labels = [];
  const scores = [];

  const composites = [];
  for (let c = 0; c < cols; c++) {
    const z = OPENING_ZOOM_CANDIDATES[c];
    const frame = await renderFrame(workBuf, workW, workH, z);
    const score = await sharpnessScore(frame);
    scores.push({ z, score });
    labels.push(`${z.toFixed(2)}× (σ²=${Math.round(score)})`);
    composites.push({
      input: await sharp(frame).toBuffer(),
      left: c * cellW,
      top: 0,
    });
  }

  const labelSvg = `<svg width="${cols * cellW}" height="48" xmlns="http://www.w3.org/2000/svg">
    ${OPENING_ZOOM_CANDIDATES.map(
      (z, i) =>
        `<text x="${i * cellW + cellW / 2}" y="32" text-anchor="middle" fill="#e8e6e3" font-family="system-ui,sans-serif" font-size="22">${z.toFixed(2)}×</text>`,
    ).join("")}
  </svg>`;

  await sharp({
    create: {
      width: cols * cellW,
      height: cellH + 48,
      channels: 3,
      background: { r: 14, g: 14, b: 16 },
    },
  })
    .composite([
      ...composites.map((c) => ({ ...c, top: 48 })),
      { input: Buffer.from(labelSvg), top: 0, left: 0 },
    ])
    .webp({ quality: 88 })
    .toFile(path.join(PIPELINE, "frame000-final-crop-test.webp"));

  return scores;
}

/** Prefer crisp 1.85–2.10 band; avoid max zoom unless clearly sharper (>3%). */
function selectOpeningZoom(scores) {
  const byZ = Object.fromEntries(scores.map((s) => [s.z, s.score]));
  const zPrefer = 2.0;
  const sPrefer = byZ[zPrefer] ?? 0;
  const s215 = byZ[2.15] ?? 0;
  if (s215 > sPrefer * 1.03) return 2.15;
  if (sPrefer >= (byZ[1.85] ?? 0)) return zPrefer;
  return scores.reduce((a, b) => (a.score > b.score ? a : b)).z;
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
    const small = await sharp(fp).resize(320, 160, { fit: "fill" }).raw().toBuffer();
    if (prev) {
      let sum = 0;
      for (let p = 0; p < small.length; p++) sum += Math.abs(small[p] - prev[p]);
      const normalized = sum / (small.length * 255);
      const entry = { from: i - 1, to: i, normalizedDiff: Number(normalized.toFixed(5)) };
      report.pairs.push(entry);
      if (normalized > 0.08 || (i <= 12 && normalized < 0.0005)) {
        report.flagged.push(entry);
      }
    }
    prev = small;
  }
  fs.writeFileSync(
    path.join(PIPELINE, "frame-diff-report-120.json"),
    JSON.stringify(report, null, 2),
  );
}

async function sheet(indices, cols, cellW, cellH, outName) {
  const rows = Math.ceil(indices.length / cols);
  const composites = [];
  for (let j = 0; j < indices.length; j++) {
    const col = j % cols;
    const row = Math.floor(j / cols);
    const fp = path.join(FRAMES_DIR, `${String(indices[j]).padStart(3, "0")}.webp`);
    const thumb = await sharp(fp).resize(cellW, cellH, { fit: "cover" }).toBuffer();
    composites.push({ input: thumb, left: col * cellW, top: row * cellH });
  }
  await sharp({
    create: {
      width: cols * cellW,
      height: rows * cellH,
      channels: 3,
      background: { r: 12, g: 12, b: 14 },
    },
  })
    .composite(composites)
    .webp({ quality: 82 })
    .toFile(path.join(PIPELINE, outName));
}

async function main() {
  fs.mkdirSync(FRAMES_DIR, { recursive: true });
  fs.mkdirSync(path.join(PIPELINE, "archive-sequence-72-v1"), { recursive: true });

  const masterCopy = path.join(PIPELINE, "master-approved-v2.jpg");
  if (!fs.existsSync(masterCopy)) fs.copyFileSync(MASTER_PATH, masterCopy);

  const existing = fs.readdirSync(FRAMES_DIR).filter((f) => f.endsWith(".webp"));
  if (existing.length === 72 && !fs.existsSync(path.join(PIPELINE, "archive-sequence-72-v1", "000.webp"))) {
    for (const f of existing) {
      fs.renameSync(
        path.join(FRAMES_DIR, f),
        path.join(PIPELINE, "archive-sequence-72-v1", f),
      );
    }
    console.log("Archived previous 72-frame sequence to _pipeline/archive-sequence-72-v1/");
  }

  console.log("Building working master…");
  const { data: workBuf, info } = await buildWorkCanvas();
  const workW = info.width;
  const workH = info.height;
  fs.writeFileSync(
    path.join(PIPELINE, "working-master-4096.png"),
    workBuf,
  );

  console.log(`Work canvas: ${workW}×${workH}`);

  const scores = await buildOpeningCropTest(workBuf, workW, workH);
  const z0 = selectOpeningZoom(scores);
  console.log("Opening zoom candidates:", scores);
  console.log("Selected opening zoom:", z0);

  fs.writeFileSync(
    path.join(PIPELINE, "hero-120-config.json"),
    JSON.stringify(
      {
        focal: { x: FOCAL_X, y: FOCAL_Y },
        openingZoom: z0,
        openingZoomCandidates: OPENING_ZOOM_CANDIDATES,
        sharpnessScores: scores,
        workCanvas: { width: workW, height: workH },
      },
      null,
      2,
    ),
  );

  const zoomByFrame = [];
  for (let i = 0; i < FRAME_COUNT; i++) {
    zoomByFrame.push(zoomAtFrame(i, z0));
  }
  const minStep = 0.0015;
  for (let i = 1; i < FRAME_COUNT; i++) {
    if (zoomByFrame[i - 1] - zoomByFrame[i] < minStep) {
      zoomByFrame[i] = Math.max(1.0, zoomByFrame[i - 1] - minStep);
    }
  }
  zoomByFrame[FRAME_COUNT - 1] = 1.0;

  for (let i = 0; i < FRAME_COUNT; i++) {
    const outPath = path.join(FRAMES_DIR, `${String(i).padStart(3, "0")}.webp`);
    const webp = await renderFrame(workBuf, workW, workH, zoomByFrame[i]);
    fs.writeFileSync(outPath, webp);
    if (i % 15 === 0 || i === FRAME_COUNT - 1) {
      console.log(`Frame ${String(i).padStart(3, "0")}  zoom=${zoomByFrame[i].toFixed(4)}`);
    }
  }

  const every6 = [];
  for (let i = 0; i < FRAME_COUNT; i += 6) every6.push(i);
  if (every6[every6.length - 1] !== 119) every6.push(119);

  await sheet(every6, 10, 320, 160, "hero-120-contact-sheet.webp");
  await sheet([0, 15, 30, 45, 60, 75, 90, 105, 119], 3, 640, 320, "hero-120-keyframes.webp");
  await sheet([0, 3, 6, 9, 12, 15, 18, 21, 24, 30], 5, 384, 192, "hero-120-opening.webp");

  await buildDiffReport();
  console.log("Complete.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
