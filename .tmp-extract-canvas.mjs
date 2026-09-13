import fs from "node:fs";
const s = fs.readFileSync(".tmp-slater-55210.js", "utf8");
const start = s.indexOf("function initCanvasEffect");
const end = s.indexOf("function initSceneProlog");
fs.writeFileSync(".tmp-canvas-effect.js", s.slice(start, end));
console.log("len", end - start);
