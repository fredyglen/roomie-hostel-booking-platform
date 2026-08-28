/**
 * Compress brand photography into web-ready WebP.
 *
 * Source PNGs live outside the repo (ROOMIE/assets/brand-images) at ~2.5 MB
 * each. Shipping those would cost a student ~10 MB just to see the sign-in
 * screen, which matters on Ghanaian mobile data.
 *
 * Supabase image transformation is a paid add-on this project does not have
 * (see src/utils/imageOptimization.ts), so static brand assets are compressed
 * at build time instead of on delivery.
 *
 *   node scripts/compress-brand-images.mjs
 */
import sharp from 'sharp';
import { readdir, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';

const SRC = path.resolve('../assets/brand-images');
const OUT = path.resolve('public/brand/auth');

// 1536px covers the auth page's split panel on a 2x display without waste.
const MAX_WIDTH = 1536;
const QUALITY = 80;

const kb = (n) => `${Math.round(n / 1024)} KB`;

async function main() {
  await mkdir(OUT, { recursive: true });

  let files;
  try {
    files = (await readdir(SRC)).filter((f) => /\.(png|jpe?g|webp)$/i.test(f)).sort();
  } catch {
    console.error(`No source folder at ${SRC}`);
    process.exit(1);
  }

  if (files.length === 0) {
    console.error(`No images in ${SRC}`);
    process.exit(1);
  }

  let before = 0;
  let after = 0;

  for (const file of files) {
    const from = path.join(SRC, file);
    const name = file.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const to = path.join(OUT, `${name}.webp`);

    const src = await stat(from);
    const info = await sharp(from)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 5 })
      .toFile(to);

    before += src.size;
    after += info.size;

    const saved = Math.round((1 - info.size / src.size) * 100);
    console.log(
      `  ${file.padEnd(26)} ${kb(src.size).padStart(8)} -> ${kb(info.size).padStart(7)}  (-${saved}%)  ${info.width}x${info.height}`
    );
  }

  console.log(
    `\n  ${files.length} images: ${kb(before)} -> ${kb(after)} ` +
      `(-${Math.round((1 - after / before) * 100)}%)\n  written to ${path.relative(process.cwd(), OUT)}`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
