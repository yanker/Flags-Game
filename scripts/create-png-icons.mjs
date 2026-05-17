/**
 * Pure Node.js PNG generator (no external deps).
 * Creates solid-color PNG icons with a simple design.
 */
import { deflateSync } from 'zlib';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '..', 'public', 'icons');
mkdirSync(outDir, { recursive: true });

function crc32(buf) {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c;
  }
  let crc = 0xffffffff;
  for (const b of buf) crc = table[(crc ^ b) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function uint32BE(n) {
  return Buffer.from([(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff]);
}

function pngChunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii');
  const lenBuf = uint32BE(data.length);
  const crcInput = Buffer.concat([typeBytes, data]);
  const crcBuf = uint32BE(crc32(crcInput));
  return Buffer.concat([lenBuf, typeBytes, data, crcBuf]);
}

function makePNG(size, r, g, b) {
  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 2;  // color type RGB
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  // Image data: each row = filter byte (0) + 3 bytes * width
  const rowSize = 1 + size * 3;
  const raw = Buffer.alloc(size * rowSize);
  for (let y = 0; y < size; y++) {
    const rowStart = y * rowSize;
    raw[rowStart] = 0; // filter none

    // Draw a simple design: teal bg + darker circle
    const cx = size / 2, cy = size / 2, rad = size * 0.38;
    // inner circle with white lines
    for (let x = 0; x < size; x++) {
      const dx = x - cx, dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let pr = r, pg = g, pb = b; // default bg teal #4ECDC4 = 78,205,196

      if (dist <= rad) {
        // inside circle: darker #38b2ac = 56,178,172
        pr = 56; pg = 178; pb = 172;
      }

      // White cross lines inside circle
      const lineW = Math.max(2, size * 0.05);
      if (dist <= rad) {
        if (Math.abs(dy) < lineW || Math.abs(dx) < lineW) {
          pr = 255; pg = 255; pb = 255;
        }
      }

      // Simple "flag" rectangle in top half of circle to suggest flags
      const flagX1 = cx - rad * 0.5, flagX2 = cx + rad * 0.5;
      const flagY1 = cy - rad * 0.6, flagY2 = cy - rad * 0.05;
      if (x >= flagX1 && x <= flagX2 && y >= flagY1 && y <= flagY2 && dist <= rad) {
        // Three horizontal stripes: red/white/blue
        const h = flagY2 - flagY1;
        const stripe = (y - flagY1) / h;
        if (stripe < 0.33) { pr = 220; pg = 50; pb = 50; }
        else if (stripe < 0.66) { pr = 255; pg = 255; pb = 255; }
        else { pr = 50; pg = 50; pb = 200; }
      }

      const off = rowStart + 1 + x * 3;
      raw[off] = pr;
      raw[off + 1] = pg;
      raw[off + 2] = pb;
    }
  }

  const compressed = deflateSync(raw);
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([
    signature,
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', compressed),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

// Teal: #4ECDC4 = rgb(78, 205, 196)
const icon192 = makePNG(192, 78, 205, 196);
const icon512 = makePNG(512, 78, 205, 196);

writeFileSync(join(outDir, 'icon-192.png'), icon192);
writeFileSync(join(outDir, 'icon-512.png'), icon512);
writeFileSync(join(outDir, 'icon-512-maskable.png'), icon512);

console.log('PNG icons created in public/icons/');
