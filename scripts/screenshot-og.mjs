import puppeteer from 'puppeteer';
import { mkdir } from 'fs/promises';
import path from 'path';

const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 });

const file = 'file:///Users/tongtongchan/Desktop/og-ep01.html';
await page.goto(file, { waitUntil: 'networkidle0' });

// Ensure output dir exists
await mkdir('/Users/tongtongchan/podcast-site/og', { recursive: true });

await page.screenshot({
  path: '/Users/tongtongchan/podcast-site/og/ep01.jpg',
  type: 'jpeg',
  quality: 92,
  clip: { x: 0, y: 0, width: 1200, height: 630 }
});

await browser.close();
console.log('Done → podcast-site/og/ep01.jpg');
