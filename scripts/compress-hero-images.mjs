import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');
const heroes = ['hero1.png', 'hero2.png', 'hero3.png', 'hero4.png'];

for (const file of heroes) {
  const input = path.join(publicDir, file);
  if (!fs.existsSync(input)) {
    console.warn(`skip missing: ${file}`);
    continue;
  }
  const output = path.join(publicDir, file.replace(/\.png$/i, '.webp'));
  await sharp(input)
    .resize(1920, null, { withoutEnlargement: true, fit: 'inside' })
    .webp({ quality: 82 })
    .toFile(output);
  fs.unlinkSync(input);
  const kb = (fs.statSync(output).size / 1024).toFixed(0);
  console.log(`${file} -> ${path.basename(output)} (${kb} KB)`);
}
