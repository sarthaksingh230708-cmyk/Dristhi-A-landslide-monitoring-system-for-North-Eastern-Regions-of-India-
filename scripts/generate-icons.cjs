const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Create main icon SVG
const svgIcon = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#E11D48"/>
      <stop offset="50%" stop-color="#9333EA"/>
      <stop offset="100%" stop-color="#4F46E5"/>
    </linearGradient>
    <linearGradient id="shieldGrad" x1="120" y1="100" x2="392" y2="420" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#F1F5F9" stop-opacity="0.9"/>
    </linearGradient>
    <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.3"/>
    </filter>
  </defs>

  <!-- Background Canvas -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)"/>

  <!-- Radar / Vision concentric pulses -->
  <circle cx="256" cy="256" r="200" stroke="#FFFFFF" stroke-opacity="0.15" stroke-width="3" stroke-dasharray="8 8"/>
  <circle cx="256" cy="256" r="160" stroke="#FFFFFF" stroke-opacity="0.22" stroke-width="3.5"/>
  <circle cx="256" cy="256" r="115" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="4"/>

  <!-- Mountain / Slope Contour in Lower Half -->
  <path d="M96 380 L180 270 L240 330 L320 220 L416 380 Z" fill="#FFFFFF" fill-opacity="0.25"/>
  <path d="M140 380 L220 280 L290 350 L380 240 L416 380 Z" fill="#FFFFFF" fill-opacity="0.35"/>

  <!-- Eye / Vision "DRISHTI" Emblem -->
  <path d="M128 256 C176 180 336 180 384 256 C336 332 176 332 128 256 Z" 
        fill="#FFFFFF" filter="url(#dropShadow)"/>
  
  <!-- Iris & Pupil -->
  <circle cx="256" cy="256" r="54" fill="#E11D48"/>
  <circle cx="256" cy="256" r="30" fill="#0F172A"/>
  <circle cx="244" cy="244" r="10" fill="#FFFFFF"/>

  <!-- Early Warning Signal Beacon -->
  <circle cx="256" cy="116" r="14" fill="#FBBF24" filter="url(#dropShadow)"/>
  <path d="M256 90 L256 80 M280 98 L290 90 M232 98 L222 90" stroke="#FBBF24" stroke-width="4" stroke-linecap="round"/>

  <!-- Label 'DRISHTI' -->
  <text x="256" y="440" text-anchor="middle" fill="#FFFFFF" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="44" letter-spacing="6">DRISHTI</text>
</svg>
`;

// 2. Create Maskable SVG with safe 15% inner padding
const svgMaskable = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradMask" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#E11D48"/>
      <stop offset="50%" stop-color="#9333EA"/>
      <stop offset="100%" stop-color="#4F46E5"/>
    </linearGradient>
  </defs>

  <!-- Full-bleed background -->
  <rect width="512" height="512" fill="url(#bgGradMask)"/>

  <!-- Scaled content inside safe zone (central 80%) -->
  <g transform="translate(51.2, 51.2) scale(0.8)">
    <circle cx="256" cy="256" r="190" stroke="#FFFFFF" stroke-opacity="0.2" stroke-width="4" stroke-dasharray="8 8"/>
    <circle cx="256" cy="256" r="140" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="4"/>

    <path d="M128 256 C176 185 336 185 384 256 C336 327 176 327 128 256 Z" fill="#FFFFFF"/>
    <circle cx="256" cy="256" r="50" fill="#E11D48"/>
    <circle cx="256" cy="256" r="28" fill="#0F172A"/>
    <circle cx="245" cy="245" r="9" fill="#FFFFFF"/>
    <circle cx="256" cy="116" r="14" fill="#FBBF24"/>
    <text x="256" y="420" text-anchor="middle" fill="#FFFFFF" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="44" letter-spacing="6">DRISHTI</text>
  </g>
</svg>
`;

async function generate() {
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgIcon.trim());

  const svgBuffer = Buffer.from(svgIcon);
  const maskableBuffer = Buffer.from(svgMaskable);

  await sharp(svgBuffer).resize(192, 192).png().toFile(path.join(publicDir, 'pwa-192x192.png'));
  await sharp(svgBuffer).resize(512, 512).png().toFile(path.join(publicDir, 'pwa-512x512.png'));
  await sharp(maskableBuffer).resize(512, 512).png().toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  await sharp(svgBuffer).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));
  await sharp(svgBuffer).resize(64, 64).png().toFile(path.join(publicDir, 'favicon.png'));

  console.log('Successfully generated PWA icons in public directory!');
}

generate().catch(console.error);
