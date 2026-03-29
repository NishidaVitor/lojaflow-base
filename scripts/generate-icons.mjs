import sharp from 'sharp'
import { mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public')
const iconsDir = join(publicDir, 'icons')

mkdirSync(iconsDir, { recursive: true })
mkdirSync(join(publicDir, 'screenshots'), { recursive: true })

const sizes = [72, 96, 128, 144, 152, 192, 384, 512]

function createSvg(size) {
  const r = Math.round(size * 0.22)
  const fontSize = Math.round(size * 0.52)
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4F46E5"/>
      <stop offset="100%" stop-color="#7C3AED"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${r}" fill="url(#g)"/>
  <text x="50%" y="56%" font-family="Arial,Helvetica,sans-serif" font-weight="900"
    font-size="${fontSize}" fill="white"
    text-anchor="middle" dominant-baseline="middle">L</text>
</svg>`)
}

for (const size of sizes) {
  await sharp(createSvg(size), { density: 144 })
    .png()
    .toFile(join(iconsDir, `icon-${size}x${size}.png`))
  console.log(`✓ icon-${size}x${size}.png`)
}

// apple-touch-icon (180x180)
await sharp(createSvg(180), { density: 144 }).png().toFile(join(publicDir, 'apple-touch-icon.png'))
console.log('✓ apple-touch-icon.png')

// screenshot placeholders
await sharp({
  create: { width: 1280, height: 720, channels: 4, background: { r: 15, g: 15, b: 19, alpha: 1 } },
}).png().toFile(join(publicDir, 'screenshots', 'desktop.png'))
await sharp({
  create: { width: 390, height: 844, channels: 4, background: { r: 15, g: 15, b: 19, alpha: 1 } },
}).png().toFile(join(publicDir, 'screenshots', 'mobile.png'))
console.log('✓ screenshots generated')

console.log('\nAll PWA icons generated successfully!')
