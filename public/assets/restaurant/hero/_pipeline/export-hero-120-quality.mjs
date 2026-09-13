/**
 * Quality-only export for the locked 120-frame hero.
 * Camera math is frozen from left-align-quality-v3.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRAMES_DIR = path.join(__dirname, "..", "frames");
const PIPELINE = __dirname;
const SAMPLES = path.join(PIPELINE, "quality-samples");

const MASTER_PATH =
  process.env.HERO_MASTER ??
  "C:\\Users\\avail\\.cursor\\projects\\c-Users-avail-son-daven-clone\\assets\\c__Users_avail_AppData_Roaming_Cursor_User_workspaceStorage_1c0e3ff7e6976e2748dc7c62aa44af7b_images_ChatGPT_Image_Sep_14__2026__01_50_58_AM-56dcf626-852b-419e-97f2-f85496d9460d.jpg";

const OUT_W = 1920;
const OUT_H = 960;
const FRAME_COUNT = 120;
const WORK_SCALE = 2;

/** Frozen from approved left-align pass. Do not retune. */
const FOCAL_X = 0.47;
const FOCAL_Y = 0.52;
const OPENING_ZOOM = 1.9;

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

function cameraProgress(i) {
  const n = FRAME_COUNT - 1;
  if (i <= 12) return 0.028 * easeInOutCubic(i / 12);
  if (i <= 35) return 0.028 + 0.195 * easeInOutCubic((i - 12) / (35 - 12));
  if (i <= 78) return 0.223 + 0.552 * ((i - 35) / (78 - 35));
  if (i <= 102) return 0.775 + 0.175 * easeOutCubic((i - 78) / (102 - 78));
  return 0.95 + 0.05 * easeOutCubic((i - 102) / (n - 102));
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
      return keys[k][1] + (keys[k + 1][1] - keys[k][1]) * t;
    }
  }
  return 1;
}

function zoomAtFrame(i, z0) {
  return zoomFromProgress(cameraProgress(i), z0);
}

function buildZoomMap() {
  const zoomByFrame = [];
  for (let i = 0; i < FRAME_COUNT; i++) zoomByFrame.push(zoomAtFrame(i, OPENING_ZOOM));
  const minStep = 0.0012;
  for (let i = 1; i < FRAME_COUNT; i++) {
    if (zoomByFrame[i - 1] - zoomByFrame[i] < minStep) {
      zoomByFrame[i] = Math.max(1.0, zoomByFrame[i - 1] - minStep);
    }
  }
  zoomByFrame[FRAME_COUNT - 1] = 1.0;
  return zoomByFrame;
}

async function buildWorkCanvas() {
  const meta = await sharp(MASTER_PATH).metadata();
  const workW = meta.width * WORK_SCALE;
  const workH = Math.round(meta.height * WORK_SCALE);
  return sharp(MASTER_PATH)
    .resize(workW, workH, { kernel: sharp.kernel.lanczos3, fit: "fill" })
    .png()
    .toBuffer({ resolveWithObject: true });
}

function cropGeometry(workW, workH, zoom) {
  const maxCropW = Math.min(workW, workH * 2);
  const maxCropH = maxCropW / 2;
  const cropW = maxCropW / zoom;
  const cropH = maxCropH / zoom;
  const cx = FOCAL_X * workW;
  const cy = FOCAL_Y * workH;
  let left = cx - cropW / 2;
  let top = cy - cropH / 2;
  left = Math.max(0, Math.min(workW - cropW, left));
  top = Math.max(0, Math.min(workH - cropH, top));
  const w = Math.max(2, Math.round(cropW));
  const h = Math.max(2, Math.round(cropH));
  const l = Math.round(left);
  const t = Math.round(top);
  return {
    left: Math.min(l, workW - w),
    top: Math.min(t, workH - h),
    width: w,
    height: h,
  };
}

async function extractPng(workBuf, workW, workH, zoom) {
  const { left, top, width, height } = cropGeometry(workW, workH, zoom);
  return sharp(workBuf)
    .extract({ left, top, width, height })
    .resize(OUT_W, OUT_H, { kernel: sharp.kernel.lanczos3 })
    .png({ compressionLevel: 6 })
    .toBuffer();
}

async function encodeWebp(pngBuf, opts) {
  return sharp(pngBuf).webp(opts).toBuffer();
}

function maePsnr(a, b) {
  let sum = 0;
  let sse = 0;
  for (let i = 0; i < a.length; i++) {
    const d = a[i] - b[i];
    sum += Math.abs(d);
    sse += d * d;
  }
  const mae = sum / a.length;
  const mse = sse / a.length;
  const psnr = mse === 0 ? 99 : 10 * Math.log10((255 * 255) / mse);
  return { mae: Number(mae.toFixed(4)), psnr: Number(psnr.toFixed(2)) };
}

const SAMPLE_FRAMES = [0, 15, 60, 119];

const ENCODERS = [
  { id: "A-q88", label: "A current q88", kind: "webp", opts: { quality: 88, effort: 6, smartSubsample: false } },
  { id: "B-q92", label: "B q92", kind: "webp", opts: { quality: 92, effort: 6, smartSubsample: false } },
  { id: "C-q96", label: "C q96", kind: "webp", opts: { quality: 96, effort: 6, smartSubsample: false } },
  { id: "D-png", label: "D PNG ref", kind: "png" },
  { id: "E-q94", label: "E q94", kind: "webp", opts: { quality: 94, effort: 6, smartSubsample: false } },
  { id: "F-lossless", label: "F lossless WebP", kind: "webp", opts: { lossless: true, effort: 6 } },
];

async function sheet(indices, cols, cellW, cellH, outName, dir = FRAMES_DIR) {
  const rows = Math.ceil(indices.length / cols);
  const composites = [];
  for (let j = 0; j < indices.length; j++) {
    const col = j % cols;
    const row = Math.floor(j / cols);
    const fp = path.join(dir, `${String(indices[j]).padStart(3, "0")}.webp`);
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
    .webp({ quality: 92, effort: 4 })
    .toFile(path.join(PIPELINE, outName));
}

async function runSampleTest(workBuf, workW, workH, zoomByFrame) {
  fs.mkdirSync(SAMPLES, { recursive: true });
  const report = { samples: [], sizes: {} };

  const cellW = 640;
  const cellH = 320;
  const detailW = 420;
  const detailH = 280;
  const cols = 4;
  const rows = SAMPLE_FRAMES.length;
  const headerH = 40;
  const sheetW = cols * cellW;
  const sheetH = headerH + rows * (cellH + detailH);

  const displayEncoders = ENCODERS.filter((e) =>
    ["A-q88", "B-q92", "C-q96", "D-png"].includes(e.id),
  );

  const composites = [];
  const headerSvg = `<svg width="${sheetW}" height="${headerH}" xmlns="http://www.w3.org/2000/svg">
    ${displayEncoders
      .map(
        (e, i) =>
          `<text x="${i * cellW + cellW / 2}" y="26" text-anchor="middle" fill="#e8e6e3" font-family="system-ui,sans-serif" font-size="18">${e.label}</text>`,
      )
      .join("")}
  </svg>`;
  composites.push({ input: Buffer.from(headerSvg), left: 0, top: 0 });

  for (let r = 0; r < SAMPLE_FRAMES.length; r++) {
    const i = SAMPLE_FRAMES[r];
    const png = await extractPng(workBuf, workW, workH, zoomByFrame[i]);
    const pngRaw = await sharp(png).raw().toBuffer();
    const row = { frame: String(i).padStart(3, "0"), variants: [] };

    for (const enc of ENCODERS) {
      let buf;
      let ext;
      if (enc.kind === "png") {
        buf = png;
        ext = "png";
      } else {
        buf = await encodeWebp(png, enc.opts);
        ext = "webp";
      }
      const out = path.join(SAMPLES, `${String(i).padStart(3, "0")}-${enc.id}.${ext}`);
      fs.writeFileSync(out, buf);

      const decoded = await sharp(buf).raw().toBuffer();
      const metrics = enc.kind === "png" ? { mae: 0, psnr: 99 } : maePsnr(pngRaw, decoded);
      const kb = Number((buf.length / 1024).toFixed(1));
      row.variants.push({ id: enc.id, kb, ...metrics });
    }

    for (let c = 0; c < displayEncoders.length; c++) {
      const enc = displayEncoders[c];
      const ext = enc.kind === "png" ? "png" : "webp";
      const fp = path.join(SAMPLES, `${String(i).padStart(3, "0")}-${enc.id}.${ext}`);
      const full = await sharp(fp).resize(cellW, cellH, { fit: "cover" }).toBuffer();
      const detail = await sharp(fp)
        .extract({
          left: Math.round(OUT_W * 0.42),
          top: Math.round(OUT_H * 0.22),
          width: 700,
          height: 466,
        })
        .resize(detailW, detailH, { kernel: sharp.kernel.nearest })
        .toBuffer();
      const y0 = headerH + r * (cellH + detailH);
      composites.push({ input: full, left: c * cellW, top: y0 });
      composites.push({
        input: detail,
        left: c * cellW + Math.round((cellW - detailW) / 2),
        top: y0 + cellH,
      });
    }

    report.samples.push(row);
    console.log(JSON.stringify(row));
  }

  await sharp({
    create: {
      width: sheetW,
      height: sheetH,
      channels: 3,
      background: { r: 12, g: 12, b: 14 },
    },
  })
    .composite(composites)
    .webp({ quality: 92, effort: 4 })
    .toFile(path.join(PIPELINE, "frame-quality-test-sheet.webp"));

  fs.writeFileSync(path.join(PIPELINE, "frame-quality-test-report.json"), JSON.stringify(report, null, 2));
  return report;
}

function chooseWinner(report) {
  const avgs = {};
  for (const sample of report.samples) {
    for (const v of sample.variants) {
      if (!avgs[v.id]) avgs[v.id] = { mae: 0, psnr: 0, kb: 0, n: 0 };
      avgs[v.id].mae += v.mae;
      avgs[v.id].psnr += v.psnr;
      avgs[v.id].kb += v.kb;
      avgs[v.id].n += 1;
    }
  }
  for (const id of Object.keys(avgs)) {
    avgs[id].mae = Number((avgs[id].mae / avgs[id].n).toFixed(4));
    avgs[id].psnr = Number((avgs[id].psnr / avgs[id].n).toFixed(2));
    avgs[id].kb = Number((avgs[id].kb / avgs[id].n).toFixed(1));
  }

  const pngKb = avgs["D-png"].kb;
  const q96 = avgs["C-q96"];
  const q94 = avgs["E-q94"];
  const q92 = avgs["B-q92"];

  let winner = { id: "C-q96", opts: { quality: 96, effort: 6, smartSubsample: false }, format: "webp" };
  let reason = "q96 closest lossy match to PNG with shippable size";

  if (q96.psnr >= 42 && q94.psnr >= 41 && q94.kb < 320) {
    winner = { id: "E-q94", opts: { quality: 94, effort: 6, smartSubsample: false }, format: "webp" };
    reason = "q94 nearly matches q96 vs PNG with a leaner payload";
  }
  if (q92.psnr >= 42 && q92.kb < 280 && q96.psnr - q92.psnr < 1.2) {
    winner = { id: "B-q92", opts: { quality: 92, effort: 6, smartSubsample: false }, format: "webp" };
    reason = "q92 already near-transparent vs PNG";
  }

  const pngMateriallyBetter = q96.psnr < 38 || q96.mae > 2.2;
  return { winner, reason, avgs, pngKb, pngMateriallyBetter };
}

async function rebuild(workBuf, workW, workH, zoomByFrame, opts) {
  fs.mkdirSync(FRAMES_DIR, { recursive: true });
  for (let i = 0; i < FRAME_COUNT; i++) {
    const png = await extractPng(workBuf, workW, workH, zoomByFrame[i]);
    const webp = await encodeWebp(png, opts);
    fs.writeFileSync(path.join(FRAMES_DIR, `${String(i).padStart(3, "0")}.webp`), webp);
    if (i % 15 === 0 || i === FRAME_COUNT - 1) {
      console.log(`Frame ${String(i).padStart(3, "0")}  zoom=${zoomByFrame[i].toFixed(4)}  ${Math.round(webp.length / 1024)}KB`);
    }
  }
}

async function main() {
  const mode = process.argv[2] ?? "all";
  console.log("Building locked working master…");
  const { data: workBuf, info } = await buildWorkCanvas();
  const workW = info.width;
  const workH = info.height;
  const zoomByFrame = buildZoomMap();
  console.log(`Work ${workW}×${workH}  focal=${FOCAL_X},${FOCAL_Y}  z0=${OPENING_ZOOM}`);
  console.log(`Frame 000 zoom=${zoomByFrame[0].toFixed(4)}  119 zoom=${zoomByFrame[119].toFixed(4)}`);

  if (mode === "test" || mode === "all") {
    console.log("Sample quality test…");
    const report = await runSampleTest(workBuf, workW, workH, zoomByFrame);
    const decision = chooseWinner(report);
    fs.writeFileSync(
      path.join(PIPELINE, "frame-quality-decision.json"),
      JSON.stringify({ ...decision, focal: { x: FOCAL_X, y: FOCAL_Y }, openingZoom: OPENING_ZOOM }, null, 2),
    );
    console.log("Averages:", decision.avgs);
    console.log("Winner:", decision.winner.id, decision.reason);
    console.log("PNG materially better?", decision.pngMateriallyBetter);

    if (mode === "test") return;
    if (decision.pngMateriallyBetter) {
      console.log("STOP: WebP still far from PNG. Not overwriting frames.");
      return;
    }
    console.log("Rebuilding 120 frames with", decision.winner.id);
    await rebuild(workBuf, workW, workH, zoomByFrame, decision.winner.opts);
    await sheet([0, 3, 6, 9, 12, 15, 18, 24, 30], 3, 640, 320, "hero-120-opening-quality.webp");
    await sheet([0, 15, 30, 45, 60, 75, 90, 105, 119], 3, 640, 320, "hero-120-keyframes-quality.webp");
    fs.writeFileSync(
      path.join(PIPELINE, "hero-120-config.json"),
      JSON.stringify(
        {
          pass: "quality-export-v4",
          focal: { x: FOCAL_X, y: FOCAL_Y },
          openingZoom: OPENING_ZOOM,
          workCanvas: { width: workW, height: workH, scale: WORK_SCALE },
          export: decision.winner,
          reason: decision.reason,
          averages: decision.avgs,
        },
        null,
        2,
      ),
    );
  }

  if (mode === "rebuild") {
    const decision = JSON.parse(fs.readFileSync(path.join(PIPELINE, "frame-quality-decision.json"), "utf8"));
    if (decision.pngMateriallyBetter) {
      console.log("STOP: previous test said PNG is materially better.");
      return;
    }
    await rebuild(workBuf, workW, workH, zoomByFrame, decision.winner.opts);
    await sheet([0, 3, 6, 9, 12, 15, 18, 24, 30], 3, 640, 320, "hero-120-opening-quality.webp");
    await sheet([0, 15, 30, 45, 60, 75, 90, 105, 119], 3, 640, 320, "hero-120-keyframes-quality.webp");
  }

  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
