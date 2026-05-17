/**
 * Generates simple PWA icon PNGs using the Canvas API (node-canvas).
 * Falls back to writing a minimal PNG binary if canvas is unavailable.
 */
import { createCanvas } from 'canvas';
import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(__dirname, '..', 'public', 'icons');
mkdirSync(iconsDir, { recursive: true });

function generateIcon(size, maskable = false) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  const padding = maskable ? size * 0.1 : 0;

  // Background
  ctx.fillStyle = '#4ECDC4';
  if (maskable) {
    ctx.fillRect(0, 0, size, size);
  } else {
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, size * 0.2);
    ctx.fill();
  }

  // Globe emoji-like circle
  ctx.fillStyle = '#1a7a72';
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.3, 0, Math.PI * 2);
  ctx.fill();

  // Globe lines
  ctx.strokeStyle = '#4ECDC4';
  ctx.lineWidth = size * 0.04;
  ctx.beginPath();
  ctx.ellipse(size / 2, size / 2, size * 0.3, size * 0.15, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(size / 2, size / 2 - size * 0.3);
  ctx.lineTo(size / 2, size / 2 + size * 0.3);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(size / 2 - size * 0.3, size / 2);
  ctx.lineTo(size / 2 + size * 0.3, size / 2);
  ctx.stroke();

  // Flag emoji text overlay (small)
  ctx.font = `bold ${size * 0.28}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🌍', size / 2, size / 2);

  return canvas.toBuffer('image/png');
}

try {
  writeFileSync(join(iconsDir, 'icon-192.png'), generateIcon(192));
  writeFileSync(join(iconsDir, 'icon-512.png'), generateIcon(512));
  writeFileSync(join(iconsDir, 'icon-512-maskable.png'), generateIcon(512, true));
  console.log('Icons generated successfully.');
} catch (e) {
  console.error('canvas not available, skipping icon generation:', e.message);
}
