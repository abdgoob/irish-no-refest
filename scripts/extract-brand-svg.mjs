import fs from "fs";

const html = fs.readFileSync(".tmp-sondaven.html", "utf8");
const logoMatch = html.match(
  /<div class="logo w-embed"><svg[\s\S]*?<\/svg>/,
);
if (logoMatch) {
  fs.writeFileSync(
    "public/assets/svg/brand/son-daven-wordmark.svg",
    logoMatch[0].replace('<div class="logo w-embed">', ""),
  );
  console.log("wordmark saved", logoMatch[0].length);
}
const blagoMatch = html.match(
  /<div class="blago-mark[^"]*"[^>]*><svg[\s\S]*?<\/svg>/,
);
if (blagoMatch) {
  fs.writeFileSync(
    "public/assets/svg/brand/blago-mark.svg",
    blagoMatch[0].replace(/<div class="blago-mark[^"]*"[^>]*>/, ""),
  );
  console.log("blago saved");
}
