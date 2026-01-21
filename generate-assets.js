const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const EXTENSION_DIR = path.join(__dirname, 'extension', 'icons');
const STORE_DIR = path.join(__dirname, 'store-assets');

fs.mkdirSync(EXTENSION_DIR, { recursive: true });
fs.mkdirSync(STORE_DIR, { recursive: true });

const PRIMARY = '#00d4aa';
const DARK = '#0f0f23';

// Lock icon SVG for extension
function createIconSVG(size) {
  const padding = size * 0.12;
  const iconSize = size - (padding * 2);

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#00d4aa"/>
          <stop offset="100%" style="stop-color:#00a885"/>
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#grad)"/>
      <g transform="translate(${padding}, ${padding})">
        <!-- Lock body -->
        <rect x="${iconSize * 0.2}" y="${iconSize * 0.45}"
              width="${iconSize * 0.6}" height="${iconSize * 0.45}"
              rx="${iconSize * 0.08}"
              fill="white"/>
        <!-- Lock shackle -->
        <path d="M${iconSize * 0.3} ${iconSize * 0.45}
                 L${iconSize * 0.3} ${iconSize * 0.3}
                 A${iconSize * 0.2} ${iconSize * 0.2} 0 0 1 ${iconSize * 0.7} ${iconSize * 0.3}
                 L${iconSize * 0.7} ${iconSize * 0.45}"
              fill="none" stroke="white" stroke-width="${iconSize * 0.08}"
              stroke-linecap="round"/>
        <!-- Key dot -->
        <circle cx="${iconSize * 0.5}" cy="${iconSize * 0.62}"
                r="${iconSize * 0.06}" fill="${PRIMARY}"/>
        <rect x="${iconSize * 0.47}" y="${iconSize * 0.65}"
              width="${iconSize * 0.06}" height="${iconSize * 0.12}"
              fill="${PRIMARY}"/>
      </g>
    </svg>
  `;
}

async function generateIcons() {
  const sizes = [16, 48, 128];
  for (const size of sizes) {
    const svg = createIconSVG(size);
    await sharp(Buffer.from(svg)).png().toFile(path.join(EXTENSION_DIR, `icon${size}.png`));
    console.log(`Created icon${size}.png`);
  }
}

async function generateStoreIcon() {
  const svg = createIconSVG(128);
  await sharp(Buffer.from(svg)).png().toFile(path.join(STORE_DIR, 'store-icon-128x128.png'));
  console.log('Created store-icon-128x128.png');
}

// Screenshot 1: Main interface (1280x800)
async function generateScreenshot1() {
  const width = 1280;
  const height = 800;

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0f0f23"/>
          <stop offset="100%" style="stop-color:#1a1a3e"/>
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#bg)"/>

      <!-- Title -->
      <text x="${width/2}" y="80" text-anchor="middle"
            font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="white">
        Password Generator Pro
      </text>
      <text x="${width/2}" y="125" text-anchor="middle"
            font-family="Arial, sans-serif" font-size="22" fill="#888">
        Secure passwords in one click. 100% private.
      </text>

      <!-- Popup mockup -->
      <g transform="translate(${(width - 360) / 2}, 170)">
        <rect width="360" height="520" rx="12" fill="#1a1a3e" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>

        <!-- Header -->
        <rect width="360" height="55" rx="12" fill="rgba(255,255,255,0.05)"/>
        <rect x="16" y="12" width="32" height="32" rx="8" fill="${PRIMARY}"/>
        <text x="60" y="35" font-family="Arial, sans-serif" font-size="16" font-weight="600" fill="white">
          Password Generator Pro
        </text>

        <!-- Password display -->
        <rect x="20" y="70" width="320" height="100" rx="12" fill="rgba(255,255,255,0.08)"/>
        <text x="35" y="110" font-family="Courier, monospace" font-size="16" fill="${PRIMARY}">
          X7$kQ9@mP2#nL5&amp;wR8
        </text>

        <!-- Buttons -->
        <rect x="20" y="130" width="150" height="36" rx="8" fill="${PRIMARY}"/>
        <text x="95" y="153" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" font-weight="600" fill="white">
          Generate
        </text>
        <rect x="180" y="130" width="160" height="36" rx="8" fill="rgba(255,255,255,0.1)"/>
        <text x="260" y="153" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" font-weight="600" fill="white">
          Copy
        </text>

        <!-- Strength meter -->
        <text x="20" y="200" font-family="Arial, sans-serif" font-size="12" fill="#888">Password Strength</text>
        <text x="340" y="200" text-anchor="end" font-family="Arial, sans-serif" font-size="12" font-weight="600" fill="${PRIMARY}">STRONG</text>
        <rect x="20" y="210" width="320" height="6" rx="3" fill="rgba(255,255,255,0.1)"/>
        <rect x="20" y="210" width="320" height="6" rx="3" fill="${PRIMARY}"/>

        <!-- Options -->
        <rect x="20" y="235" width="320" height="180" rx="12" fill="rgba(255,255,255,0.05)"/>

        <text x="35" y="265" font-family="Arial, sans-serif" font-size="13" fill="white">Length</text>
        <rect x="250" y="250" width="60" height="24" rx="6" fill="rgba(0,212,170,0.2)"/>
        <text x="280" y="267" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" font-weight="600" fill="${PRIMARY}">16</text>

        <text x="35" y="300" font-family="Arial, sans-serif" font-size="13" fill="white">Uppercase</text>
        <rect x="290" y="287" width="40" height="22" rx="11" fill="${PRIMARY}"/>
        <circle cx="318" cy="298" r="8" fill="white"/>

        <text x="35" y="335" font-family="Arial, sans-serif" font-size="13" fill="white">Lowercase</text>
        <rect x="290" y="322" width="40" height="22" rx="11" fill="${PRIMARY}"/>
        <circle cx="318" cy="333" r="8" fill="white"/>

        <text x="35" y="370" font-family="Arial, sans-serif" font-size="13" fill="white">Numbers</text>
        <rect x="290" y="357" width="40" height="22" rx="11" fill="${PRIMARY}"/>
        <circle cx="318" cy="368" r="8" fill="white"/>

        <text x="35" y="405" font-family="Arial, sans-serif" font-size="13" fill="white">Symbols</text>
        <rect x="290" y="392" width="40" height="22" rx="11" fill="${PRIMARY}"/>
        <circle cx="318" cy="403" r="8" fill="white"/>

        <!-- History -->
        <text x="20" y="445" font-family="Arial, sans-serif" font-size="11" fill="#666" text-transform="uppercase">Recent Passwords</text>
        <rect x="20" y="455" width="320" height="30" rx="6" fill="rgba(255,255,255,0.05)"/>
        <text x="35" y="475" font-family="Courier, monospace" font-size="11" fill="#888">K9@mP2#nL5...</text>
        <rect x="20" y="490" width="320" height="30" rx="6" fill="rgba(255,255,255,0.05)"/>
        <text x="35" y="510" font-family="Courier, monospace" font-size="11" fill="#888">R7&amp;jQ4$tM8...</text>
      </g>

      <!-- Features -->
      <g transform="translate(100, 720)">
        <circle cx="15" cy="10" r="10" fill="${PRIMARY}"/>
        <text x="15" y="15" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="white">1</text>
        <text x="35" y="15" font-family="Arial, sans-serif" font-size="15" fill="white">Crypto-secure generation</text>
      </g>
      <g transform="translate(380, 720)">
        <circle cx="15" cy="10" r="10" fill="${PRIMARY}"/>
        <text x="15" y="15" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="white">2</text>
        <text x="35" y="15" font-family="Arial, sans-serif" font-size="15" fill="white">Customizable options</text>
      </g>
      <g transform="translate(640, 720)">
        <circle cx="15" cy="10" r="10" fill="${PRIMARY}"/>
        <text x="15" y="15" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="white">3</text>
        <text x="35" y="15" font-family="Arial, sans-serif" font-size="15" fill="white">One-click copy</text>
      </g>
      <g transform="translate(880, 720)">
        <circle cx="15" cy="10" r="10" fill="${PRIMARY}"/>
        <text x="15" y="15" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="white">4</text>
        <text x="35" y="15" font-family="Arial, sans-serif" font-size="15" fill="white">100% Private</text>
      </g>
    </svg>
  `;

  await sharp(Buffer.from(svg)).png().toFile(path.join(STORE_DIR, 'screenshot-1.png'));
  console.log('Created screenshot-1.png');
}

// Screenshot 2: Features (1280x800)
async function generateScreenshot2() {
  const width = 1280;
  const height = 800;

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0f0f23"/>
          <stop offset="100%" style="stop-color:#1a1a3e"/>
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#bg2)"/>

      <text x="${width/2}" y="80" text-anchor="middle"
            font-family="Arial, sans-serif" font-size="42" font-weight="bold" fill="white">
        Why Password Generator Pro?
      </text>

      <!-- Feature cards 3x2 -->
      <g transform="translate(80, 140)">
        <!-- Card 1 -->
        <g transform="translate(0, 0)">
          <rect width="350" height="180" rx="16" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
          <circle cx="40" cy="40" r="24" fill="${PRIMARY}"/>
          <text x="40" y="47" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="white">1</text>
          <text x="80" y="47" font-family="Arial, sans-serif" font-size="18" font-weight="600" fill="white">
            Cryptographically Secure
          </text>
          <text x="25" y="90" font-family="Arial, sans-serif" font-size="14" fill="#aaa">
            Uses Web Crypto API for truly
          </text>
          <text x="25" y="112" font-family="Arial, sans-serif" font-size="14" fill="#aaa">
            random, unpredictable passwords.
          </text>
        </g>

        <!-- Card 2 -->
        <g transform="translate(380, 0)">
          <rect width="350" height="180" rx="16" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
          <circle cx="40" cy="40" r="24" fill="${PRIMARY}"/>
          <text x="40" y="47" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="white">2</text>
          <text x="80" y="47" font-family="Arial, sans-serif" font-size="18" font-weight="600" fill="white">
            Fully Customizable
          </text>
          <text x="25" y="90" font-family="Arial, sans-serif" font-size="14" fill="#aaa">
            Choose length (8-64), uppercase,
          </text>
          <text x="25" y="112" font-family="Arial, sans-serif" font-size="14" fill="#aaa">
            lowercase, numbers, and symbols.
          </text>
        </g>

        <!-- Card 3 -->
        <g transform="translate(760, 0)">
          <rect width="350" height="180" rx="16" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
          <circle cx="40" cy="40" r="24" fill="#2ed573"/>
          <text x="40" y="47" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="white">3</text>
          <text x="80" y="47" font-family="Arial, sans-serif" font-size="18" font-weight="600" fill="white">
            100% Private
          </text>
          <text x="25" y="90" font-family="Arial, sans-serif" font-size="14" fill="#aaa">
            Everything happens locally.
          </text>
          <text x="25" y="112" font-family="Arial, sans-serif" font-size="14" fill="#aaa">
            No servers, no tracking, no cloud.
          </text>
        </g>

        <!-- Card 4 -->
        <g transform="translate(0, 210)">
          <rect width="350" height="180" rx="16" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
          <circle cx="40" cy="40" r="24" fill="#ffa502"/>
          <text x="40" y="47" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="white">4</text>
          <text x="80" y="47" font-family="Arial, sans-serif" font-size="18" font-weight="600" fill="white">
            Strength Meter
          </text>
          <text x="25" y="90" font-family="Arial, sans-serif" font-size="14" fill="#aaa">
            Visual feedback shows how
          </text>
          <text x="25" y="112" font-family="Arial, sans-serif" font-size="14" fill="#aaa">
            secure your password is.
          </text>
        </g>

        <!-- Card 5 -->
        <g transform="translate(380, 210)">
          <rect width="350" height="180" rx="16" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
          <circle cx="40" cy="40" r="24" fill="#ffa502"/>
          <text x="40" y="47" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="white">5</text>
          <text x="80" y="47" font-family="Arial, sans-serif" font-size="18" font-weight="600" fill="white">
            Password History
          </text>
          <text x="25" y="90" font-family="Arial, sans-serif" font-size="14" fill="#aaa">
            Keeps last 5 passwords in session.
          </text>
          <text x="25" y="112" font-family="Arial, sans-serif" font-size="14" fill="#aaa">
            Cleared when you close browser.
          </text>
        </g>

        <!-- Card 6 -->
        <g transform="translate(760, 210)">
          <rect width="350" height="180" rx="16" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
          <circle cx="40" cy="40" r="24" fill="#2ed573"/>
          <text x="40" y="47" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="white">6</text>
          <text x="80" y="47" font-family="Arial, sans-serif" font-size="18" font-weight="600" fill="white">
            Keyboard Shortcuts
          </text>
          <text x="25" y="90" font-family="Arial, sans-serif" font-size="14" fill="#aaa">
            Press Enter to generate,
          </text>
          <text x="25" y="112" font-family="Arial, sans-serif" font-size="14" fill="#aaa">
            Ctrl+C to copy instantly.
          </text>
        </g>
      </g>

      <!-- CTA -->
      <rect x="${(width - 280) / 2}" y="600" width="280" height="56" rx="28" fill="${PRIMARY}"/>
      <text x="${width/2}" y="636" text-anchor="middle"
            font-family="Arial, sans-serif" font-size="18" font-weight="600" fill="white">
        Add to Chrome - Free
      </text>

      <text x="${width/2}" y="700" text-anchor="middle"
            font-family="Arial, sans-serif" font-size="15" fill="#666">
        Only requires storage permission - nothing else
      </text>
    </svg>
  `;

  await sharp(Buffer.from(svg)).png().toFile(path.join(STORE_DIR, 'screenshot-2.png'));
  console.log('Created screenshot-2.png');
}

// Small promo (440x280)
async function generateSmallPromo() {
  const width = 440;
  const height = 280;

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="promobg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${PRIMARY}"/>
          <stop offset="100%" style="stop-color:#00a885"/>
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#promobg)"/>

      <!-- Lock icon -->
      <g transform="translate(${(width - 70) / 2}, 35)">
        <rect width="70" height="70" rx="14" fill="white"/>
        <rect x="15" y="32" width="40" height="28" rx="5" fill="${PRIMARY}"/>
        <path d="M22 32 L22 22 A13 13 0 0 1 48 22 L48 32"
              fill="none" stroke="${PRIMARY}" stroke-width="5" stroke-linecap="round"/>
        <circle cx="35" cy="42" r="4" fill="white"/>
        <rect x="33" y="44" width="4" height="8" fill="white"/>
      </g>

      <text x="${width/2}" y="140" text-anchor="middle"
            font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="white">
        Password Generator Pro
      </text>

      <text x="${width/2}" y="170" text-anchor="middle"
            font-family="Arial, sans-serif" font-size="14" fill="rgba(255,255,255,0.9)">
        Secure passwords in one click
      </text>

      <text x="${width/2}" y="210" text-anchor="middle"
            font-family="Arial, sans-serif" font-size="12" fill="rgba(255,255,255,0.7)">
        Customizable | Private | Free
      </text>

      <rect x="${(width - 80) / 2}" y="230" width="80" height="28" rx="14" fill="rgba(255,255,255,0.2)"/>
      <text x="${width/2}" y="249" text-anchor="middle"
            font-family="Arial, sans-serif" font-size="12" font-weight="600" fill="white">
        FREE
      </text>
    </svg>
  `;

  await sharp(Buffer.from(svg)).png().toFile(path.join(STORE_DIR, 'small-promo-440x280.png'));
  console.log('Created small-promo-440x280.png');
}

// Marquee (1400x560)
async function generateMarquee() {
  const width = 1400;
  const height = 560;

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="marqueebg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${PRIMARY}"/>
          <stop offset="100%" style="stop-color:#00a885"/>
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#marqueebg)"/>

      <!-- Large lock icon -->
      <g transform="translate(150, ${(height - 180) / 2})">
        <rect width="180" height="180" rx="36" fill="white" opacity="0.95"/>
        <rect x="35" y="85" width="110" height="70" rx="12" fill="${PRIMARY}"/>
        <path d="M55 85 L55 60 A35 35 0 0 1 125 60 L125 85"
              fill="none" stroke="${PRIMARY}" stroke-width="14" stroke-linecap="round"/>
        <circle cx="90" cy="115" r="10" fill="white"/>
        <rect x="85" y="120" width="10" height="20" fill="white"/>
      </g>

      <!-- Text -->
      <g transform="translate(420, ${height/2 - 80})">
        <text font-family="Arial, sans-serif" font-size="64" font-weight="bold" fill="white">
          Password Generator Pro
        </text>
        <text y="65" font-family="Arial, sans-serif" font-size="28" fill="rgba(255,255,255,0.9)">
          Secure, customizable passwords in one click
        </text>

        <g transform="translate(0, 110)">
          <rect width="140" height="42" rx="21" fill="rgba(255,255,255,0.2)"/>
          <text x="70" y="28" text-anchor="middle" font-family="Arial, sans-serif" font-size="15" fill="white">
            Crypto-Secure
          </text>

          <rect x="160" width="130" height="42" rx="21" fill="rgba(255,255,255,0.2)"/>
          <text x="225" y="28" text-anchor="middle" font-family="Arial, sans-serif" font-size="15" fill="white">
            Customizable
          </text>

          <rect x="310" width="100" height="42" rx="21" fill="rgba(255,255,255,0.2)"/>
          <text x="360" y="28" text-anchor="middle" font-family="Arial, sans-serif" font-size="15" fill="white">
            Private
          </text>

          <rect x="430" width="80" height="42" rx="21" fill="rgba(255,255,255,0.3)"/>
          <text x="470" y="28" text-anchor="middle" font-family="Arial, sans-serif" font-size="15" font-weight="600" fill="white">
            FREE
          </text>
        </g>
      </g>
    </svg>
  `;

  await sharp(Buffer.from(svg)).png().toFile(path.join(STORE_DIR, 'marquee-1400x560.png'));
  console.log('Created marquee-1400x560.png');
}

async function main() {
  console.log('Generating Password Generator Pro assets...\n');
  await generateIcons();
  await generateStoreIcon();
  await generateScreenshot1();
  await generateScreenshot2();
  await generateSmallPromo();
  await generateMarquee();
  console.log('\nAll assets generated!');
}

main().catch(console.error);
