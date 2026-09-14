import fs from "fs";

const s = fs.readFileSync(".tmp-sondaven-live.html", "utf8");
const i = s.indexOf('id="prolog"');
const j = s.indexOf('id="about"');
console.log("prolog idx", i, "about idx", j);
console.log(s.slice(j - 800, j + 1200));
