---
date: 2026-04-15
source: hn
source_detail: "hn post 47784914 by u/kodjima33"
url: "https://news.ycombinator.com/item?id=47784914"
topic: "Show HN: Omi – watches your screen, hears conversations, tells you what to do"
author: kodjima33
engagement: 32
created_utc: 2026-04-15T20:38:21Z
pain_keywords: ["\\b(frustrating|nightmare|wasting hours|wastes my time)\\b"]
confidence: medium
status: raw
raw_intake_version: plan_b_v1
---

# Show HN: Omi – watches your screen, hears conversations, tells you what to do

> **Source**: https://news.ycombinator.com/item?id=47784914

## 原始内容

Spent 4 months and built Omi for Desktop, your life architect: It sees your screen, hears your conversations and will advise you on what to do next<p>Basically Cluely + Rewind + Granola + Wisprflow + ChatGPT + Claude in one app<p>I talk to claude&#x2F;chatgpt 24&#x2F;7 but I find it frustrating that i have to capture&#x2F;send screenshots of my screen and that it doesn&#x27;t help proactively during my work<p>Whenever omi sees something wrong about my workflow, it will send me a proactive notification with advice. It will also point to something I&#x27;m missing.<p>The hardest part was to nail proactivity - after trying 20+ similar tools I didn&#x27;t find a single one with smart proactive notifications based on content on your screen. I made it look at your screen every second with 4 main prompts:<p>1. Is the user productive or distracted?<p>2. Is there anything useful to say right now?<p>3. is there any task to add to do later?<p>4. is there anything important to remember about the user?<p>Full stack: - Swift - Rust backend - Deepgram transcription - Claude code for messaging - GPT 5.4 summaries - Gemini for embeddings and translation<p>Open source, stores screenshots locally, uses Claude Code for chat. Has cloud to sync with hardware or mobile app but can be disabled in settings

## 自动提取的痛点信号

- 命中关键词: \b(frustrating|nightmare|wasting hours|wastes my time)\b
- 互动度: 32
- 作者: u/kodjima33

<!-- 处理: 调度员 → 5 阶段 pipeline -->
