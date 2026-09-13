import fs from "node:fs";
const s = fs.readFileSync(".tmp-slater-55210.js", "utf8");
const idx = s.indexOf("data-prolog-scene");
console.log(s.slice(idx, idx + 1200));
const urls = [...s.matchAll(/https:\/\/assets\.sondaven\.com\/[^"'\\]+/g)].map((m) => m[0]);
console.log("\n--- prolog urls ---");
for (const u of urls.filter((u) => u.includes("prolog"))) console.log(u);
