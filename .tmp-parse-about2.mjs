import fs from "fs";

const s = fs.readFileSync(".tmp-sondaven-live.html", "utf8");
const idx = s.indexOf("about-w_scene");
console.log(s.slice(idx - 200, idx + 400));
