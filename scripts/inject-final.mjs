import { readFileSync, writeFileSync } from 'fs';

const ep01Path = '/Users/tongtongchan/podcast-site/ep01.html';
let html = readFileSync(ep01Path, 'utf8');
const newZh = readFileSync('/Users/tongtongchan/Desktop/zh-content-v3.html', 'utf8');

// 1. Replace ZH section
const startMarker = '    <!-- ZH Content: 公众号精华 + 中文逐字稿 -->';
const endMarker = '\n\n    <!-- Full Transcript (SEO) -->';
const start = html.indexOf(startMarker);
const end = html.indexOf(endMarker);
if (start === -1 || end === -1) { console.error('Markers not found'); process.exit(1); }
html = html.slice(0, start) + newZh + html.slice(end);

// 2. Fix JS bug: move .click() to AFTER listeners are registered
// Remove the early click call
html = html.replace(
  `    // Apply initial lang on load
    if (savedLang !== 'en') {
      document.querySelector(\`[data-lang="\${savedLang}"]\`)?.click();
    }

    langBtns.forEach(btn => {`,
  `    langBtns.forEach(btn => {`
);

// Add click AFTER the forEach block closes
html = html.replace(
  `        localStorage.setItem('lang', lang);
      });
    });


    // Ambient parallax`,
  `        localStorage.setItem('lang', lang);
      });
    });

    // Apply saved lang AFTER listeners registered
    if (savedLang !== 'en') {
      document.querySelector(\`[data-lang="\${savedLang}"]\`)?.click();
    }

    // Ambient parallax`
);

writeFileSync(ep01Path, html, 'utf8');
console.log('Done. Size:', html.length);
