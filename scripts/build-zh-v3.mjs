import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

function readDocx(path) {
  return execSync(`textutil -convert txt -stdout "${path}"`, { encoding: 'utf8' });
}
function esc(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ── docx → single <details> block (no nested sub-details) ─────────────
function docxToSingleDetails(text, summaryLabel) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const html = lines.map(line => {
    if (/^\d+｜/.test(line)) {
      return `<h3 class="wc-section">${esc(line)}</h3>`;
    }
    if (/^[🎙️🧑🏻‍💻]/.test(line)) {
      const m = line.match(/^([🎙️🧑🏻‍💻\s\w]+)[：:]\s*(.*)/s);
      if (m) {
        const sp = m[1].replace(/[🎙️🧑🏻‍💻]/g,'').trim();
        // Use same tr-turn grid as English transcript
        return `<div class="tr-turn"><span class="tr-speaker">${esc(sp)}</span><span class="tr-time"></span><p class="tr-text">${esc(m[2].trim())}</p></div>`;
      }
    }
    if (line.startsWith('**') && line.endsWith('**')) {
      return `<p class="wc-bold">${esc(line.replace(/\*\*/g,''))}</p>`;
    }
    return `<p class="wc-para">${esc(line)}</p>`;
  }).join('\n');

  return `      <details class="tr-part">
        <summary class="tr-summary">${summaryLabel}</summary>
        <div class="tr-content wc-article">
${html}
        </div>
      </details>`;
}

// ── SRT → readable paragraphs ─────────────────────────────────────────
const srt = readFileSync('/Users/tongtongchan/Desktop/P人客廳EP1/字幕.srt', 'utf8');
const entries = [];
for (const block of srt.trim().split(/\n\n+/)) {
  const lines = block.trim().split('\n');
  if (lines.length < 3) continue;
  const tm = lines[1].match(/(\d{2}:\d{2}:\d{2})/);
  if (!tm) continue;
  entries.push({ time: tm[1], text: lines.slice(2).join('') });
}

function toSec(t) { const [h,m,s] = t.split(':').map(Number); return h*3600+m*60+s; }
const PARA_SEC = 120;
const paras = [];
let pStart = null, pSec = null, pBuf = [];
for (const e of entries) {
  const sec = toSec(e.time);
  if (pStart === null) { pStart = e.time; pSec = sec; }
  if (sec - pSec >= PARA_SEC) {
    paras.push({ time: pStart, text: pBuf.join('') });
    pStart = e.time; pSec = sec; pBuf = [];
  }
  pBuf.push(e.text);
}
if (pBuf.length) paras.push({ time: pStart, text: pBuf.join('') });

const partTitles = [
  '第一部分：三个 P 人的开场',
  '第二部分：AI 如何改变组织协作',
  '第三部分：AI 辅助决策与 Skill',
  '第四部分：AI 时代的人才',
  '第五部分：造梦次元的产品逻辑',
  '第六部分：用户洞察与出海',
  '第七部分：AI Native 转型深度聊',
  '第八部分：给年轻人的建议 + AI 改变日常',
  '第九部分：AI 伦理与信息茧房',
  '第十部分：结尾',
];
const PARTS = 10;
const partSize = Math.ceil(paras.length / PARTS);
const srtPartsHtml = partTitles.map((title, i) => {
  const slice = paras.slice(i * partSize, (i + 1) * partSize);
  const inner = slice.map(p =>
    `<div class="tr-turn"><span class="tr-speaker" style="color:var(--pink-deep);font-weight:300;font-family:'Fraunces',serif;font-size:0.78rem">${p.time}</span><span class="tr-time"></span><p class="tr-text">${esc(p.text)}</p></div>`
  ).join('\n');
  return `      <details class="tr-part">
        <summary class="tr-summary">${esc(title)}</summary>
        <div class="tr-content">
${inner}
        </div>
      </details>`;
}).join('\n\n');

// ── Assemble ──────────────────────────────────────────────────────────
const docx1 = readDocx('/Users/tongtongchan/Desktop/P人客廳EP1/公眾號版本2：50个人的AI公司如何干出500人的活？对话造梦次元创始人沈洽金（上）.docx');
const docx2 = readDocx('/Users/tongtongchan/Desktop/P人客廳EP1/公眾號版本2_活人感比AI更重要：当AI说「你手上有柑橘味」对话造梦次元创始人沈洽金｜P人客廳 EP01（下）.docx');

const wc1 = docxToSingleDetails(docx1, '50个人的AI公司如何干出500人的活？（上）');
const wc2 = docxToSingleDetails(docx2, '活人感比AI更重要：当AI说「你手上有柑橘味」（下）');

const output = `    <!-- ZH Content: 公众号精华 + 中文逐字稿 -->
    <section class="transcript-section lang-zh-only" style="display:none">

      <h2 class="tr-heading">精华整理 · 公众号版</h2>
      <p class="tr-note">点击展开上下两篇。</p>

${wc1}

${wc2}

      <hr class="divider" style="margin: 48px 0;">

      <h2 class="tr-heading">完整中文逐字稿</h2>
      <p class="tr-note">点击展开各部分。</p>

${srtPartsHtml}
    </section>`;

writeFileSync('/Users/tongtongchan/Desktop/zh-content-v3.html', output, 'utf8');
console.log('Done. Paras:', paras.length);
