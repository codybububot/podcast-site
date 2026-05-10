import { readFileSync, writeFileSync } from 'fs';

const txt = readFileSync('/Users/tongtongchan/Desktop/EP01_transcript_EN_2026 copy.txt', 'utf8');

// Split into parts by "## Part" headings
const partRegex = /^## (Part \d+:.+)$/m;
const lines = txt.split('\n');

const parts = [];
let currentPart = null;
let currentLines = [];

for (const line of lines) {
  const partMatch = line.match(/^## (.+)$/);
  if (partMatch) {
    if (currentPart !== null) {
      parts.push({ title: currentPart, lines: currentLines });
    }
    currentPart = partMatch[1];
    currentLines = [];
  } else {
    if (currentPart !== null) {
      currentLines.push(line);
    }
  }
}
if (currentPart !== null) {
  parts.push({ title: currentPart, lines: currentLines });
}

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderPart(part) {
  const turnRegex = /^\*\*(\w[\w\s]*?)\s+(\d{2}:\d{2}:\d{2})\*\*$/;
  const speakerOnlyRegex = /^\*\*(\w[\w\s]*?):\*\*$/;

  const html = [];
  let i = 0;
  const lines = part.lines;

  while (i < lines.length) {
    const line = lines[i].trim();

    if (!line) { i++; continue; }

    const m = line.match(turnRegex);
    const m2 = line.match(speakerOnlyRegex);

    if (m || m2) {
      const speaker = m ? m[1] : m2[1];
      const time = m ? m[2] : null;
      // Collect following paragraph lines
      i++;
      const paraLines = [];
      while (i < lines.length && lines[i].trim() !== '' && !lines[i].trim().match(/^\*\*/)) {
        paraLines.push(lines[i].trim());
        i++;
      }
      const para = escapeHtml(paraLines.join(' '));
      if (para) {
        html.push(`<div class="tr-turn"><span class="tr-speaker">${escapeHtml(speaker)}</span>${time ? `<span class="tr-time">${time}</span>` : ''}<p class="tr-text">${para}</p></div>`);
      }
    } else {
      i++;
    }
  }

  return html.join('\n');
}

const allParts = parts.map((part, idx) => {
  const inner = renderPart(part);
  return `      <details class="tr-part">
        <summary class="tr-summary">${escapeHtml(part.title)}</summary>
        <div class="tr-content">
${inner}
        </div>
      </details>`;
}).join('\n\n');

const output = `    <!-- Full Transcript (SEO) -->
    <section class="transcript-section">
      <h2 class="tr-heading" data-en="Full Transcript" data-zh="完整逐字稿">Full Transcript</h2>
      <p class="tr-note" data-en="English transcript — click a part to expand." data-zh="英文逐字稿，点击展开各部分。">English transcript — click a part to expand.</p>
${allParts}
    </section>`;

writeFileSync('/Users/tongtongchan/Desktop/transcript-section.html', output, 'utf8');
console.log('Done. Parts:', parts.length);
parts.forEach((p, i) => console.log(`  Part ${i+1}: ${p.title}`));
