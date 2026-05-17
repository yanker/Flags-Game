// Genera el favicon e iconos PWA a partir de un SVG vectorial nítido.
// Usa `sharp` (ya disponible vía la dependencia de imágenes de Astro). Sin libs extra.
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = join(root, 'public');
const iconsDir = join(pub, 'icons');
mkdirSync(iconsDir, { recursive: true });

// Icono principal a sangre completa (favicon, apple-touch y PWA "any").
// Globo blanco con meridianos + banderín coral sobre degradado turquesa→azul
// (mismos colores que theme_color #4ECDC4 / acento #FF6B6B de la app).
const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#4ECDC4"/>
      <stop offset="1" stop-color="#2B82C9"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#bg)"/>
  <circle cx="248" cy="270" r="150" fill="#ffffff"/>
  <g stroke="#4ECDC4" stroke-width="11" fill="none" stroke-linecap="round">
    <line x1="98" y1="270" x2="398" y2="270"/>
    <line x1="248" y1="120" x2="248" y2="420"/>
    <ellipse cx="248" cy="270" rx="72" ry="150"/>
    <path d="M118 210 q130 55 260 0"/>
    <path d="M118 330 q130 -55 260 0"/>
  </g>
  <path d="M186 214 q34 -20 60 4 q22 24 -6 44 q-40 16 -56 -10 q-12 -26 2 -38z" fill="#4ECDC4"/>
  <path d="M250 300 q40 -8 56 22 q12 36 -26 46 q-40 6 -48 -28 q-4 -30 18 -40z" fill="#4ECDC4"/>
  <rect x="338" y="92" width="13" height="178" rx="6" fill="#2A3A4A"/>
  <path d="M351 104 h118 l-30 34 l30 34 h-118 z" fill="#FF6B6B"/>
</svg>`;

// Variante "maskable": mismo arte encogido y centrado para que quede dentro
// de la zona segura circular de Android (no se recorta al aplicar máscara).
const maskable = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg2" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#4ECDC4"/>
      <stop offset="1" stop-color="#2B82C9"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#bg2)"/>
  <g transform="translate(256 256) scale(0.62) translate(-256 -270)">
    <circle cx="248" cy="270" r="150" fill="#ffffff"/>
    <g stroke="#4ECDC4" stroke-width="11" fill="none" stroke-linecap="round">
      <line x1="98" y1="270" x2="398" y2="270"/>
      <line x1="248" y1="120" x2="248" y2="420"/>
      <ellipse cx="248" cy="270" rx="72" ry="150"/>
      <path d="M118 210 q130 55 260 0"/>
      <path d="M118 330 q130 -55 260 0"/>
    </g>
    <path d="M186 214 q34 -20 60 4 q22 24 -6 44 q-40 16 -56 -10 q-12 -26 2 -38z" fill="#4ECDC4"/>
    <path d="M250 300 q40 -8 56 22 q12 36 -26 46 q-40 6 -48 -28 q-4 -30 18 -40z" fill="#4ECDC4"/>
    <rect x="338" y="92" width="13" height="178" rx="6" fill="#2A3A4A"/>
    <path d="M351 104 h118 l-30 34 l30 34 h-118 z" fill="#FF6B6B"/>
  </g>
</svg>`;

const iconBuf = Buffer.from(icon);
const maskBuf = Buffer.from(maskable);

// favicon SVG (pestaña del navegador, escala perfecta)
writeFileSync(join(pub, 'favicon.svg'), icon);

const png = (buf, size) => sharp(buf).resize(size, size).png().toBuffer();

const targets = [
  [iconBuf, 32, join(pub, 'favicon-32.png')],
  [iconBuf, 180, join(pub, 'apple-touch-icon.png')],
  [iconBuf, 192, join(iconsDir, 'icon-192.png')],
  [iconBuf, 512, join(iconsDir, 'icon-512.png')],
  [maskBuf, 512, join(iconsDir, 'icon-512-maskable.png')],
];

for (const [buf, size, out] of targets) {
  writeFileSync(out, await png(buf, size));
  console.log('OK', out.replace(root + '\\', ''), `(${size}px)`);
}
console.log('Iconos generados correctamente.');
