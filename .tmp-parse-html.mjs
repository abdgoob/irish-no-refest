import fs from "fs";

const s = fs.readFileSync(".tmp-sondaven-live.html", "utf8");
const css = [...s.matchAll(/href="([^"]+\.css[^"]*)"/g)].map((m) => m[1]);
console.log("css", css.slice(0, 5));
const idx = s.indexOf("faq-s_scenes");
console.log(s.slice(idx - 200, idx + 120));
