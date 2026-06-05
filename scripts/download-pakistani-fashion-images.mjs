import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'public', 'images', 'pakistani-fashion');

const PHOTO_IDS = [
  'photo-1773439877245-79b5ac3244a8',
  'photo-1773439878258-3c5fa24afa75',
  'photo-1773439878437-11da66df98e9',
  'photo-1773439878392-74abd38c55ec',
  'photo-1773439878222-c383967772de',
  'photo-1773439877127-ecfe17c9eb62',
  'photo-1773439877255-55e63cf17b2c',
  'photo-1773439877918-8b7253ac852e',
  'photo-1773439877904-39a38b3584da',
  'photo-1773439878338-c61b0fe9ed48',
  'photo-1773439878760-cdb8c7aa13fa',
  'photo-1773439877295-15e34acb4ae0',
  'photo-1773439878676-b0ab6febe677',
  'photo-1773439878503-1e96ace29e1b',
  'photo-1773439877634-e6ef9f571c12',
  'photo-1773439878916-eaeacd159a68',
  'photo-1773439879035-4a2f33b30bbc',
  'photo-1773439878174-201b8b441e75',
];

const unsplash = (id, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;

const manifest = [
  ...PHOTO_IDS.map((id, i) => ({
    file: `stock-${i + 1}.jpg`,
    url: unsplash(id, 1400),
  })),
  { file: 'hero.jpg', url: unsplash(PHOTO_IDS[6], 1920) },
  { file: 'login.jpg', url: unsplash(PHOTO_IDS[10], 1200) },
  { file: 'collection-banner.jpg', url: unsplash(PHOTO_IDS[14], 1600) },
  { file: 'sustainability.jpg', url: unsplash(PHOTO_IDS[2], 1600) },
  { file: 'occasion-1.jpg', url: unsplash(PHOTO_IDS[0], 1600) },
  { file: 'occasion-2.jpg', url: unsplash(PHOTO_IDS[7], 1600) },
  { file: 'occasion-3.jpg', url: unsplash(PHOTO_IDS[16], 1600) },
  { file: 'occasion-4.jpg', url: unsplash(PHOTO_IDS[4], 1600) },
  { file: 'editorial-1.jpg', url: unsplash(PHOTO_IDS[0], 1200) },
  { file: 'editorial-2.jpg', url: unsplash(PHOTO_IDS[7], 1200) },
  { file: 'editorial-3.jpg', url: unsplash(PHOTO_IDS[11], 1200) },
  { file: 'masonry-1.jpg', url: unsplash(PHOTO_IDS[0], 1200) },
  { file: 'masonry-2.jpg', url: unsplash(PHOTO_IDS[7], 1200) },
  { file: 'masonry-3.jpg', url: unsplash(PHOTO_IDS[11], 1200) },
  { file: 'masonry-4.jpg', url: unsplash(PHOTO_IDS[15], 1200) },
  ...Array.from({ length: 6 }, (_, i) => ({
    file: `follow-${i + 1}.jpg`,
    url: unsplash(PHOTO_IDS[i % 18], 1200),
  })),
  ...Array.from({ length: 7 }, (_, i) => ({
    file: `week-${i + 1}.jpg`,
    url: unsplash(PHOTO_IDS[(i + 3) % 18], 1000),
  })),
  ...Array.from({ length: 12 }, (_, i) => ({
    file: `nav-${i + 1}.jpg`,
    url: unsplash(PHOTO_IDS[i % 18], 1000),
  })),
];

fs.mkdirSync(outDir, { recursive: true });

for (const { file, url } of manifest) {
  const dest = path.join(outDir, file);
  if (fs.existsSync(dest) && fs.statSync(dest).size > 10_000) {
    console.log(`skip ${file}`);
    continue;
  }
  process.stdout.write(`fetch ${file}... `);
  const res = await fetch(url);
  if (!res.ok) {
    console.log(`FAILED ${res.status}`);
    continue;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  console.log(`${Math.round(buf.length / 1024)}kb`);
}

console.log('done');
