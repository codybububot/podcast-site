# P人客廳 / The Unplanned — Podcast Site

## Deployment
- **Live URL**: https://unplanned.live
- **Repo**: https://github.com/codybububot/podcast-site
- **Branch**: `main` → GitHub Pages → Cloudflare DNS on `unplanned.live`
- **Deployed file**: `index.html` on `main` branch

## Key Files
| File | Purpose |
|------|---------|
| `index.html` | Main homepage — all tabs (Episodes, Hosts, About) |
| `ep01.html` | EP01 dedicated page — Spotify embed + bilingual timestamps |
| `favicon.jpg` | Podcast logo (favicon) |
| `CNAME` | `unplanned.live` — required for GitHub Pages custom domain |

## Episode Pages Pattern
- Each episode gets its own page: `ep01.html`, `ep02.html`, etc.
- Episode card on homepage is fully clickable → episode page (invisible overlay anchor, z-index 0)
- Platform buttons (Spotify, Substack) sit above overlay at z-index 1
- Episode page has: Spotify embed, link buttons, bilingual description, 4-part timestamp list

## Hosts
- **Tongtong Chan** — NYX Ventures, focused on AI applications
- **Clara Jiang** — FutureX Capital, focused on consumer AI

## Social Links (in index.html)
- Spotify show: https://open.spotify.com/show/033cyHplEFGw5AYxsdxpvj
- YouTube: https://www.youtube.com/@unplannedventurepodcast
- Substack: https://unplannedventurepodcast.substack.com/
- 小宇宙: `#` placeholder — **not yet filled**

## EP01 Links
- Spotify episode: https://open.spotify.com/episode/5Hkm1PTaFfBJZQrcjZWjOW
- Substack Pt. 1: https://unplannedventurepodcast.substack.com/p/how-a-50-person-ai-company-punches
- Substack Pt. 2: https://open.substack.com/pub/unplannedventurepodcast/p/in-conversation-with-qiajin-shen

## Design System
- CSS variables in `index.html` `<style>` block — copy the `:root` block into new episode pages
- Palette: warm rosy (`--pink`, `--pink-deep`, `--surface-base`, etc.)
- Fonts: Playfair Display (headings), Plus Jakarta Sans (body), Noto Sans TC (Chinese)
- Bilingual: `data-en` / `data-zh` attributes, toggled by JS; preference saved to `localStorage`

## Pending
- [ ] 小宇宙 show URL — replace `#` in social links (both `index.html` and `ep01.html`)
- [ ] YouTube video for EP01 — add `▶ Watch` button to EP01 card + episode page when uploaded
- [ ] Host photos — replace T/C placeholder circles in Hosts tab with real photos
- [ ] EP02 — create `ep02.html`, update EP02 card (remove "Coming Soon", add links)
- [ ] Desktop content files in `/Users/tongtongchan/Desktop/P人客廳EP1/` for reference
