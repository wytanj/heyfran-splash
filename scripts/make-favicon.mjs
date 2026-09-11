import sharp from "sharp";
import fs from "fs";

const src = "public/brandmark-yellow.png";
const cream = { r: 255, g: 254, b: 245, alpha: 1 };

const meta = await sharp(src).metadata();
console.log("src", meta.width, meta.height, meta.format, meta.hasAlpha);

const trimmed = await sharp(src).trim({ threshold: 10 }).toBuffer({ resolveWithObject: true });
console.log("trimmed", trimmed.info.width, trimmed.info.height);

async function squarePng(size, background, name) {
  const buf = await sharp(trimmed.data)
    .resize(size, size, { fit: "contain", background })
    .png()
    .toBuffer();
  fs.writeFileSync(`public/${name}`, buf);
  console.log("wrote", name, buf.length);
}

await squarePng(32, cream, "favicon-32.png");
await squarePng(48, cream, "favicon-48.png");
await squarePng(180, cream, "apple-touch-icon.png");
await squarePng(192, cream, "icon-192.png");
await squarePng(512, cream, "icon-512.png");
await squarePng(32, { r: 0, g: 0, b: 0, alpha: 0 }, "favicon.png");
fs.copyFileSync("public/favicon-32.png", "public/favicon-32x32.png");
console.log("done");
