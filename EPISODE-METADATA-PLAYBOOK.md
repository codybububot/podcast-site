# Episode Metadata Playbook — The Unplanned / P人客廳

The standard for **English-first preview metadata** on every episode page
(`/epNN/index.html`). Page **content stays bilingual** (EN / 中文 via the
`data-en` / `data-zh` toggle); only the `<head>` preview tags below are
English-first, because social/search/Reading-List previews don't run the
language toggle.

Last updated: 2026-06-12. Applies to EP01, EP02, and all future episodes.

---

## 1. The six fields to set (and ONLY these)

| Field | Standard |
|---|---|
| `<title>` | `{Company}: {English Episode Title} \| Unplanned EP{NN}` |
| `<meta name="description">` | Description template (below) |
| `<meta property="og:title">` | **Same string as `<title>`** |
| `<meta property="og:description">` | **Same string as meta description** |
| `<meta name="twitter:title">` | **Same string as `<title>`** |
| `<meta name="twitter:description">` | **Same string as meta description** |

All three **titles identical**; all three **descriptions identical**. This
prevents one surface (e.g. Apple Reading List, which reads `meta description`)
from showing different — or Chinese — text than another.

## 2. Description template

```
{Guest Name}, {role/company}, joins Tongtong Chan and Clara Jiang on
The Unplanned Venture Podcast to discuss {topic1}, {topic2}, and {topic3}.
```

- English only (no Chinese characters in preview metadata).
- 3 topics, drawn from the episode's actual chapters/content — don't invent.
- Keep it ~1–2 sentences (good for OG/Twitter/Reading-List snippets).

## 3. Title template

```
{Company}: {English Episode Title} | Unplanned EP{NN}
```

- `{Company}` = the guest's company/product (FateTell, ideaFlow…).
- `{English Episode Title}` = the episode's English title (drop any `| {Guest} × {Company}` suffix — the company already leads).
- Always end with `| Unplanned EP{NN}`.

## 4. Worked examples (live)

**EP02 — `/ep02/`**
- Title (×3): `FateTell: The One Thing AI Can't Change | Unplanned EP02`
- Description (×3): `Levy Cheng, founder of FateTell, joins Tongtong Chan and Clara Jiang on The Unplanned Venture Podcast to discuss AI, meaning, Chinese fate-reading traditions, and the things technology cannot replace.`

**EP01 — `/ep01/`**
- Title (×3): `ideaFlow: Where Do Ideas Come From? | Unplanned EP01`
- Description (×3): `Qiajin Shen, founder of ideaFlow, joins Tongtong Chan and Clara Jiang on The Unplanned Venture Podcast to discuss building an AI-native organization, hiring in the AI era, and product aliveness.`

## 5. Do NOT touch (when editing metadata)

- ❌ Transcript (the `tr-turn` blocks) — EP01 = 448 turns, EP02 = 637 turns
- ❌ JSON-LD (`application/ld+json`) — EP01 has 2 blocks (PodcastEpisode + VideoObject), EP02 has 1; their Chinese `name`/`description` fields stay as-is
- ❌ `<link rel="canonical">` — must stay `https://unplanned.live/ep{NN}/` (trailing slash)
- ❌ Page layout / body content / bilingual `data-en`/`data-zh` copy
- ❌ `og:image` / `twitter:image` (the `/og/epNN.jpg` card image) unless the artwork itself changes

## 6. New-episode checklist

1. Create `ep{NN}/index.html` from the episode template (hero, Why-this-matters, YouTube embed, chapters, single collapsible transcript, footer).
2. Set the **6 metadata fields** per §1–§3 (English-first, all titles equal, all descriptions equal).
3. Keep canonical = `https://unplanned.live/ep{NN}/`.
4. Add `og:image` = `https://unplanned.live/og/ep{NN}.jpg`.
5. Routing: create the `ep{NN}/` folder route **and** a root `ep{NN}.html` redirect stub (`meta refresh` + `location.replace('/ep{NN}/')`, `noindex`) so both `/ep{NN}` and `/ep{NN}/` land on the new page.
6. Add `https://unplanned.live/ep{NN}/` to `sitemap.xml`.
7. Verify: page 200, language toggle, YouTube embed, transcript count, JSON-LD present, no Chinese in the 6 preview fields, no "Xiaoyuzhou", no "A PODCAST".
8. After deploy, re-scrape the URL in the platform debuggers (caches are sticky).

## 7. Why English-first previews

Social cards, Google snippets, and Apple/Safari Reading List read the static
`<head>` tags — they do **not** execute the EN/中文 toggle. A Chinese
`meta description` therefore surfaces as a Chinese snippet even for English
readers. English-first preview metadata fixes this while the on-page
experience remains fully bilingual.
