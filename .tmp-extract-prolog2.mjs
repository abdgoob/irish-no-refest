import fs from "node:fs";
const s = fs.readFileSync(".tmp-slater-55210.js", "utf8");
const start = s.indexOf("function initSceneProlog");
console.log(s.slice(start, start + 800));
