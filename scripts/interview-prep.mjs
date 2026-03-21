#!/usr/bin/env node

/**
 * Interview Prep Pipeline for P人客廳
 *
 * Usage: node scripts/interview-prep.mjs "<guest_name>" "<company>" [--ep <number>]
 *
 * This script is designed to be invoked by Claude Code's interview-prep skill.
 * It generates search queries and a template structure — the actual web research
 * and synthesis is done by Claude Code using web_search + web_fetch.
 *
 * The script:
 * 1. Generates platform-specific search queries for the guest
 * 2. Outputs a structured prep doc template
 * 3. Provides the framework that Claude Code fills in with research
 */

import { writeFileSync, existsSync, readdirSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PREP_DIR = join(ROOT, 'prep-docs');

// Parse args
const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: node scripts/interview-prep.mjs "<guest_name>" "<company>" [--ep <number>]');
  process.exit(1);
}

const guestName = args[0];
const company = args[1];
const epFlag = args.indexOf('--ep');
let epNumber;

if (epFlag !== -1 && args[epFlag + 1]) {
  epNumber = parseInt(args[epFlag + 1], 10);
} else {
  // Auto-detect next episode number from existing prep docs
  if (!existsSync(PREP_DIR)) mkdirSync(PREP_DIR, { recursive: true });
  const existing = readdirSync(PREP_DIR).filter(f => f.match(/^EP\d+/));
  const maxEp = existing.reduce((max, f) => {
    const m = f.match(/^EP(\d+)/);
    return m ? Math.max(max, parseInt(m[1], 10)) : max;
  }, 0);
  epNumber = maxEp + 1;
}

const epStr = String(epNumber).padStart(2, '0');
const outputFile = join(PREP_DIR, `EP${epStr}-${guestName.replace(/\s+/g, '_')}-prep.md`);

// Generate search queries across platforms
// Adaptive: covers both Chinese and English platforms
function generateSearchQueries(name, company) {
  const nameCN = name; // Assume input could be Chinese or English
  const queries = {
    // Chinese platforms
    '36氪': [
      `site:36kr.com "${name}"`,
      `site:36kr.com "${company}"`,
      `36氪 ${name} 专访`,
      `36氪 ${company} 融资`,
    ],
    '即刻': [
      `site:okjike.com "${name}"`,
      `即刻 ${name}`,
    ],
    '小宇宙': [
      `site:xiaoyuzhoufm.com "${name}"`,
      `小宇宙 ${name} 播客`,
    ],
    '微信公众号': [
      `微信 公众号 "${name}" ${company}`,
      `${name} 创业 访谈`,
      `${name} ${company} 专访`,
    ],
    '小红书': [
      `小红书 ${name} ${company}`,
    ],
    // English / global platforms
    'YouTube': [
      `"${name}" interview`,
      `"${name}" "${company}" talk`,
      `"${name}" podcast`,
    ],
    'Twitter/X': [
      `site:twitter.com "${name}"`,
      `site:x.com "${name}"`,
      `from:* "${name}" "${company}"`,
    ],
    'LinkedIn': [
      `site:linkedin.com "${name}" "${company}"`,
      `"${name}" linkedin ${company}`,
    ],
    'KrASIA': [
      `site:kr-asia.com "${name}"`,
      `site:kr-asia.com "${company}"`,
    ],
    'TechCrunch / Tech media': [
      `"${name}" "${company}" site:techcrunch.com`,
      `"${name}" "${company}" startup`,
      `"${company}" funding announcement`,
    ],
    'Podcasts (EN)': [
      `"${name}" podcast guest`,
      `"${name}" "${company}" episode`,
    ],
    'Conference talks': [
      `"${name}" conference talk keynote`,
      `"${name}" panel discussion`,
      `"${name}" demo day pitch`,
    ],
    'Personal blog / Medium': [
      `"${name}" blog`,
      `site:medium.com "${name}"`,
      `"${name}" substack`,
    ],
    'Crunchbase / funding': [
      `"${company}" crunchbase funding`,
      `"${company}" series round investors`,
    ],
  };
  return queries;
}

const queries = generateSearchQueries(guestName, company);

// Generate the template
const template = `# P人客廳 EP${epStr} 访谈准备文档
# 嘉宾: ${guestName} | ${company}
# 生成日期: ${new Date().toISOString().split('T')[0]}

---

## 📋 搜索查询清单 (Search Queries)

以下查询需要通过 web_search 执行：

${Object.entries(queries).map(([platform, qs]) => `### ${platform}
${qs.map(q => `- [ ] \`${q}\``).join('\n')}`).join('\n\n')}

---

## 1. 访谈审计 (Interview Audit)

### 已找到的公开访谈和露面

| # | 来源平台 | 日期 | 标题/链接 | 关键要点 |
|---|---------|------|----------|---------|
| 1 | | | | |

### 关键主张和观点 (Key Claims & Talking Points)

_从审计中提取的嘉宾核心观点：_

1.

### 反复讲述的故事 (Recurring Stories)

_出现2次以上的故事/案例：_

1.

### 引用的数据点 (Data Points Cited)

1.

---

## 2. 弱点诊断 (Gap Analysis)

### 🔴 说烂了的 (Over-rehearsed — 3+ repetitions)

| 话题 | 出现次数 | 出处 |
|-----|---------|------|
| | | |

### 🟡 浅尝辄止 (Surface-level — touched but never explored)

| 话题 | 为什么值得深挖 | 在哪次访谈中被跳过 |
|-----|--------------|-----------------|
| | | |

### 🟢 从未被问 (Never Asked — obvious gaps)

| 角度 | 为什么这个问题重要 | 预期反应 |
|-----|-----------------|---------|
| | | |

### ⚡ 前后矛盾 (Contradictions)

| 矛盾点 | 出处A | 出处B | 追问策略 |
|--------|-------|-------|---------|
| | | | |

### 💡 情绪触发点 (Emotional Hooks)

| 触发话题 | 观察到的反应 | 出处 |
|---------|------------|------|
| | | |

---

## 3. 节目结构 (Show Structure)

### Act 1 — 暖场 Warm-up (~5 min)

**开场策略**: _用一个出其不意的细节开场，不要用"介绍一下你的公司"_

**开场问题**:
> [Question here — sourced from audit finding #X]

**Follow-up chain**:
1. 如果他们说 → 那追问...
2. 如果他们回避 → 转向...

---

### Act 2 — 深水区 Deep Dive (~20 min)

**核心问题 1**: _[来自弱点诊断 — 从未被问]_
> [Question]

追问链:
- 2a:
- 2b:
- 2c:

**核心问题 2**: _[来自弱点诊断 — 浅尝辄止]_
> [Question]

追问链:
- 2a:
- 2b:
- 2c:

**核心问题 3**: _[来自弱点诊断 — 情绪触发点]_
> [Question]

追问链:
- 2a:
- 2b:
- 2c:

---

### Act 3 — 交锋 Challenge (~10 min)

**挑战点 1**: _[来自弱点诊断 — 前后矛盾 or 说烂了的]_
> "你在[出处A]说过[引用]，但在[出处B]又说[引用]。这两个说法怎么调和？"

**挑战点 2**: _[挑战一个核心叙事]_
> [Question that politely but firmly pushes past the PR layer]

**退路**: _如果嘉宾情绪不好，准备好的缓冲问题：_
> [Softer question that returns to safe ground]

---

### Act 4 — 收尾 Close (~5 min)

**前瞻性问题**: _[从未被问过的角度]_
> [Question]

**个人问题**: _[呼应 Act 1 的开场]_
> [Question]

**闪电轮 (Optional)**:
1. 最近在读什么？
2. 最被低估的创业建议？
3. 如果不做现在的事，会做什么？

---

## 4. 主持人速查表 (Host Cheat Sheet)

### 🚫 禁区 (Banned Topics)
_敏感话题、法律风险、已知雷区：_

1.

### 🔫 追问弹药库 (Follow-up Ammunition)
_针对常见回避策略的预装追问：_

| 如果嘉宾说... | 那你就问... |
|-------------|-----------|
| "这是个好问题..." (拖延) | "那你的回答是？" |
| [预期的回避模式] | [预装追问] |

### 🎯 采访技巧提醒 (Technique Reminders)
_基于嘉宾性格的采访策略：_

- 嘉宾类型分析:
- 推荐策略:
- 注意事项:

---

## 5. 分发计划 (Distribution Plan)

### 小红书
- **标题** (≤20字):
- **Hook**:

### YouTube
- **标题**:
- **描述**:
- **建议切片时间戳**:
  1. [mm:ss - mm:ss] —
  2. [mm:ss - mm:ss] —
  3. [mm:ss - mm:ss] —

### 小宇宙
- **标题**:
- **节目简介**:

### 即刻
- **帖子文案**:

### Twitter/X
- **Thread (3-5 tweets)**:
  1.
  2.
  3.

### 抖音/TikTok
- **切片角度 1**: 标题:
- **切片角度 2**: 标题:
- **切片角度 3**: 标题:

---

## 6. 录制前清单 (Pre-recording Checklist)

### 技术准备
- [ ] 录音设备测试
- [ ] 备用录音方案
- [ ] 网络连接稳定性（如远程）

### 嘉宾相关
- [ ] 确认嘉宾时间和地点
- [ ] 发送话题大纲（只发大方向，不发具体问题）
- [ ] 确认是否有禁区话题

### 知识准备
- [ ] 嘉宾姓名正确发音: ${guestName}
- [ ] 公司名正确发音: ${company}
- [ ] 关键术语/人名发音：

### 嘉宾职业时间线
| 时间 | 事件 |
|-----|------|
| | |

---

_本文档由 P人客廳 Interview Prep Pipeline 生成_
_需要 Claude Code 配合 web_search + web_fetch 完成研究填充_
`;

// Write output
if (!existsSync(PREP_DIR)) mkdirSync(PREP_DIR, { recursive: true });
writeFileSync(outputFile, template, 'utf-8');

console.log(`✅ Prep doc template generated: ${outputFile}`);
console.log(`📋 ${Object.values(queries).flat().length} search queries ready across ${Object.keys(queries).length} platforms`);
console.log(`\nPlatforms covered:`);
Object.keys(queries).forEach(p => console.log(`  - ${p} (${queries[p].length} queries)`));
console.log(`\nNext step: Use Claude Code to execute the search queries and fill in the template.`);
