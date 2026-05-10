import { readFileSync, writeFileSync } from 'fs';

const ep01Path = '/Users/tongtongchan/podcast-site/ep01.html';
const transcriptPath = '/Users/tongtongchan/Desktop/transcript-section.html';

let html = readFileSync(ep01Path, 'utf8');
const transcriptHtml = readFileSync(transcriptPath, 'utf8');

// 1. Add transcript CSS styles before </style>
const transcriptCss = `
    /* Transcript */
    .transcript-section {
      margin-top: var(--space-2xl);
      padding-top: var(--space-xl);
      border-top: 1px solid var(--rule-color);
    }
    .tr-heading {
      font-size: 0.75rem; font-weight: 500; letter-spacing: 0.15em;
      text-transform: uppercase; color: var(--pink-deep);
      margin-bottom: var(--space-sm);
    }
    .tr-note {
      font-size: 0.8rem; color: var(--text-tertiary);
      margin-bottom: var(--space-lg);
    }
    .tr-part {
      border-bottom: 1px solid var(--rule-color);
    }
    .tr-summary {
      font-size: 0.85rem; font-weight: 500;
      color: var(--text-secondary);
      padding: var(--space-md) 0;
      cursor: pointer;
      list-style: none;
      display: flex; align-items: center; gap: var(--space-sm);
    }
    .tr-summary::-webkit-details-marker { display: none; }
    .tr-summary::before {
      content: '+'; color: var(--pink-deep);
      font-size: 1rem; font-weight: 600;
      width: 16px; flex-shrink: 0;
    }
    details[open] .tr-summary::before { content: '−'; }
    .tr-content {
      padding-bottom: var(--space-xl);
    }
    .tr-turn {
      display: grid;
      grid-template-columns: 80px 60px 1fr;
      gap: 0 var(--space-sm);
      padding: 8px 0;
      border-bottom: 1px solid rgba(0,0,0,0.04);
      align-items: baseline;
      font-size: 0.85rem;
    }
    .tr-speaker {
      font-weight: 600; color: var(--text-primary);
      font-size: 0.78rem; letter-spacing: 0.03em;
    }
    .tr-time {
      font-family: 'Fraunces', serif;
      font-size: 0.72rem; color: var(--pink-deep);
      font-weight: 300;
    }
    .tr-text {
      color: var(--text-secondary);
      line-height: 1.65; font-weight: 300;
    }
    @media (max-width: 600px) {
      .tr-turn {
        grid-template-columns: 70px 50px 1fr;
        font-size: 0.82rem;
      }
    }`;

html = html.replace('  </style>', transcriptCss + '\n  </style>');

// 2. Insert transcript before Social section
const socialMarker = '    <!-- Social -->';
if (!html.includes(socialMarker)) {
  console.error('Could not find Social section marker');
  process.exit(1);
}

html = html.replace(socialMarker, '\n' + transcriptHtml + '\n\n    <!-- Social -->');

writeFileSync(ep01Path, html, 'utf8');
console.log('Done — transcript injected into ep01.html');
console.log('File size:', html.length, 'bytes');
