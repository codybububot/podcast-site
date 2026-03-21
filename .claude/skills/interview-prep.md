# Interview Prep Pipeline

## Usage
/interview-prep <guest_name> <company>

Example: /interview-prep "张三" "某某科技"

## Description
Generates a complete pre-production research + script package for a P人客廳 podcast episode by scraping and synthesizing the guest's public media footprint.

## Instructions

You are building an interview prep doc for the podcast P人客廳 (unplanned.live). Given a guest name and company, execute the following pipeline:

### Step 1: Interview Audit (访谈审计)
Use web_search to find ALL public interviews and appearances by the guest. Search across:
- 36氪 (36kr.com)
- 即刻 (okjike.com / m.okjike.com)
- 小宇宙 (xiaoyuzhoufm.com)
- KrASIA (kr-asia.com)
- YouTube
- Personal blog / company blog
- Twitter/X
- LinkedIn
- 微信公众号 articles (via search)
- Podcast appearances (Apple Podcasts, Spotify mentions)
- Conference talks / panels

For each source found, use web_fetch to read the content and summarize:
- Key claims / talking points
- Stories told
- Opinions expressed
- Data points shared

### Step 2: Gap Analysis (弱点诊断)
From the audit, identify:
- **Rehearsed territory** (说烂了的): Topics/stories repeated 3+ times across interviews
- **Surface-level answers** (浅尝辄止): Topics touched but never explored deeply
- **Never asked** (从未被问): Obvious angles that no interviewer has pursued
- **Contradictions** (前后矛盾): Inconsistencies between different interviews
- **Emotional hooks** (情绪触发点): Moments where the guest showed genuine emotion or passion

### Step 3: Show Structure (节目结构)
Design a 4-act interview structure:

**Act 1 — 暖场 (Warm-up, ~5 min)**
- Start with something unexpected / personal, NOT the standard "tell us about your company"
- Use a detail from the audit that shows you've done homework

**Act 2 — 深水区 (Deep dive, ~20 min)**
- Go into the gaps identified in Step 2
- Each question should have 2-3 prepared follow-ups (追问链)
- Focus on "why" and "how did that feel" not "what happened"

**Act 3 — 交锋 (Challenge, ~10 min)**
- Politely challenge contradictions or rehearsed narratives
- Use specific quotes from their past interviews as evidence
- Goal: get past the PR layer to authentic responses

**Act 4 — 收尾 (Close, ~5 min)**
- Forward-looking question that hasn't been asked before
- A personal question that connects back to Act 1
- Lightning round (optional)

### Step 4: Host Cheat Sheet (主持人速查表)
Generate:
- **禁区 (Banned topics)**: Topics to avoid (legal issues, known sensitivities, things they've asked not to discuss)
- **追问弹药库 (Follow-up ammunition)**: Pre-loaded follow-up questions for likely deflections
- **采访技巧提醒 (Technique reminders)**: Specific interviewing techniques relevant to this guest's personality

### Step 5: Distribution Plan (分发计划)
For each platform, generate:
- **小红书**: Title (≤20 chars), hook description
- **YouTube**: Title, description, suggested clip timestamps
- **小宇宙**: Title, show notes
- **即刻**: Post copy
- **Twitter/X**: Thread outline (3-5 tweets)
- **抖音/TikTok**: 3 suggested clip angles with titles

### Step 6: Pre-recording Checklist (录制前清单)
- Technical setup reminders
- Guest-specific preparation notes
- Key names/terms to pronounce correctly
- Timeline of guest's career for quick reference

### Output
Save the complete prep doc to `prep-docs/EP{nn}-{guest_name}-prep.md` where nn is the next episode number.

The document should be written primarily in Chinese (matching the podcast language) with English section headers for navigability.

### Quality Standards
- Every question in the show structure must be sourced from a specific finding in the audit
- No generic questions that could apply to any guest
- Follow-up chains must anticipate likely deflections based on the guest's interview patterns
- The prep doc should make it impossible for the host to be surprised by anything the guest says
