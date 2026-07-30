import { readdir, mkdir, stat, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.resolve(__dirname, '..', 'public');
const OPTIMIZED_DIR = path.join(PUBLIC_DIR, 'optimized');

const SIZES = [400, 800, 1200];

const SKIP_FILES = new Set([
  'favicon.ico',
  'robots.txt',
  'sr.mp3',
  'avicii75.webp',
]);

const images = [];

const files = await readdir(PUBLIC_DIR, { withFileTypes: true });

for (const entry of files) {
  if (!entry.isFile()) continue;
  const ext = path.extname(entry.name).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue;
  if (SKIP_FILES.has(entry.name)) continue;

  const name = path.parse(entry.name).name;
  const srcPath = path.join(PUBLIC_DIR, entry.name);

  images.push({ name, srcPath, ext });
}

if (images.length === 0) {
  console.log('No images to optimize.');
  process.exit(0);
}

if (!existsSync(OPTIMIZED_DIR)) {
  await mkdir(OPTIMIZED_DIR, { recursive: true });
}

for (const img of images) {
  console.log(`\nProcessing: ${img.name}${img.ext}`);
  const metadata = await sharp(img.srcPath).metadata();
  console.log(`  Original: ${metadata.width}x${metadata.height}`);

  for (const size of SIZES) {
    if (size > (metadata.width ?? Infinity)) {
      console.log(`  Skip ${size}w — larger than source`);
      continue;
    }

    const webpPath = path.join(OPTIMIZED_DIR, `${img.name}-${size}w.webp`);
    await sharp(img.srcPath)
      .resize(size, undefined, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(webpPath);
    const webpStat = await stat(webpPath);
    console.log(`  ${size}w.webp  — ${(webpStat.size / 1024).toFixed(1)} KB`);

    const jpgPath = path.join(OPTIMIZED_DIR, `${img.name}-${size}w.jpg`);
    await sharp(img.srcPath)
      .resize(size, undefined, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 75, mozjpeg: true })
      .toFile(jpgPath);
    const jpgStat = await stat(jpgPath);
    console.log(`  ${size}w.jpg   — ${(jpgStat.size / 1024).toFixed(1)} KB`);
  }

  const thumbDir = path.join(PUBLIC_DIR, 'thumb');
  if (existsSync(thumbDir)) {
    const thumbPath = path.join(thumbDir, `${img.name}${img.ext}`);
    if (existsSync(thumbPath)) {
      const thumbWebpPath = path.join(thumbDir, `${img.name}.webp`);
      await sharp(img.srcPath)
        .resize(40, undefined, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 60 })
        .toFile(thumbWebpPath);
      const thumbWebpStat = await stat(thumbWebpPath);
      console.log(`  thumb/${img.name}.webp — ${(thumbWebpStat.size / 1024).toFixed(1)} KB (new)`);
    }
  }
}

const manifest = {};
for (const img of images) {
  const webpSrcs = [];
  const jpgSrcs = [];
  for (const size of SIZES) {
    webpSrcs.push(`/optimized/${img.name}-${size}w.webp ${size}w`);
    jpgSrcs.push(`/optimized/${img.name}-${size}w.jpg ${size}w`);
  }
  manifest[img.name] = {
    srcSetWebp: webpSrcs.join(', '),
    srcSetJpeg: jpgSrcs.join(', '),
  };
}

const manifestPath = path.join(OPTIMIZED_DIR, 'srcset-manifest.json');
await writeFile(manifestPath, JSON.stringify(manifest, null, 2));
console.log(`\nDone. Manifest written to optimized/srcset-manifest.json`);
