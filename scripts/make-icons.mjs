/**
 * Creates minimal valid PNG icons without any external dependencies.
 * Uses raw PNG binary construction with zlib deflate via Node's built-in zlib.
 */
import { createCanvas } from 'canvas';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '..', 'public', 'icons');

function draw(size, maskable) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Teal background
  ctx.fillStyle = '#4ECDC4';
  ctx.fillRect(0, 0, size, size);

  // Darker circle
  ctx.fillStyle = '#38b2ac';
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.35, 0, Math.PI * 2);
  ctx.fill();

  // White horizontal line
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = Math.max(2, size * 0.05);
  ctx.beginPath();
  ctx.moveTo(size * 0.15, size / 2);
  ctx.lineTo(size * 0.85, size / 2);
  ctx.stroke();

  // White vertical line
  ctx.beginPath();
  ctx.moveTo(size / 2, size * 0.15);
  ctx.lineTo(size / 2, size * 0.85);
  ctx.stroke();

  // White ellipse (longitude)
  ctx.beginPath();
  ctx.ellipse(size / 2, size / 2, size * 0.35, size * 0.17, 0, 0, Math.PI * 2);
  ctx.stroke();

  return canvas.toBuffer('image/png');
}

try {
  writeFileSync(join(outDir, 'icon-192.png'), draw(192, false));
  writeFileSync(join(outDir, 'icon-512.png'), draw(512, false));
  writeFileSync(join(outDir, 'icon-512-maskable.png'), draw(512, true));
  console.log('✓ Icons written to public/icons/');
} catch (err) {
  console.warn('canvas unavailable:', err.message);
  process.exit(1);
}
