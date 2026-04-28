---
date: 2026-03-12
source: hn
source_detail: "hn post 47349962 by u/fariniasty"
url: "https://news.ycombinator.com/item?id=47349962"
topic: "I spent a year building a GPS-ephemeral social network. Here's what happened"
author: fariniasty
engagement: 8
created_utc: 2026-03-12T13:00:01Z
pain_keywords: ["\\b(frustrating|nightmare|wasting hours|wastes my time)\\b", "\\btried .{1,40}? but\\b"]
confidence: medium
status: raw
raw_intake_version: plan_b_v1
---

# I spent a year building a GPS-ephemeral social network. Here's what happened

> **Source**: https://news.ycombinator.com/item?id=47349962

## 原始内容

I was doom-scrolling Instagram when I asked myself: Why am I even doing this?<p>I&#x27;m a graphic designer, not a professional dev, but I decided to build the opposite of the &quot;engagement at all costs&quot; machine. No algorithm. No permanent profiles. No infinite scroll. Just GPS, reciprocity, and 48-hour ephemeral posts.<p>The Concept<p>What if posts stayed in the physical location where you took them? I built Bliip: a Vanilla JS PWA radar-based platform where content is anchored to GPS coordinates and expires after 48 hours.<p>I stopped calling it &#x27;social media&#x27; and started thinking of it as a &#x27;localized reality node&#x27; - which sounds pretentious, but bear with me. It’s not about following people; it’s about discovering the space you’re currently standing in.<p>Core mechanics:<p>Give-to-get: You must post to unlock nearby content for 24h. No lurkers allowed.
GPS-locked: Content is tied to space, not users.
The Narrator: A sarcastic &quot;System&quot; AI (the gatekeeper) that roasts you during onboarding.<p>Who is this actually for?<p>Bliip definitely isn&#x27;t for everyone. It&#x27;s for the person at a music festival, a campus, or a neighborhood block party who wants to know what the person three feet away is seeing — not what an algorithm decided they should see six hours ago.<p>Technical Hurdles<p>Schrödinger&#x27;s Photo: Modern phones don&#x27;t release files immediately; they process HDR&#x2F;AI in the background. If you grab the file too fast, it&#x27;s &quot;not there&quot; yet. I had to dump the Blob directly to RAM to bypass the OS lag.<p>Video Without a Server Farm (FFmpeg.wasm): I couldn&#x27;t afford a transcoding backend. I used FFmpeg.wasm to move the processing to the client&#x27;s CPU. Getting it to behave on mobile browsers required a nightmare of SharedArrayBuffer and COOP&#x2F;COEP header configurations (the true PWA experience), but it works.<p>AI Brain Surgery: I coded this with AI assistance, which was a hallucination-filled roller coaster. Halfway through, GPT-5 started failing on complex WASM memory logic. I tried switching to Claude, but it insisted it was the year 2025 and at one point literally outputted &quot;KURWA MATEUSZ&quot; (my name + a Polish swear word) in a moment of context-collapse. I finally &quot;transplanted&quot; the project&#x27;s brain to Gemini to finish the last 10k lines.<p>Google Play Hell: The new &quot;12 testers for 14 days&quot; rule is trauma for solo devs. If day 13 had 11 testers instead of 12, Google reset the clock. It took two months just to &quot;exist&quot; in the store.<p>Reality Check<p>Organic users arrived. They saw the neon&#x2F;cyberpunk design and thought: &quot;Dating app.&quot;<p>I learned the industry term TTD (Time To Dick). Bliip&#x27;s score was alarmingly short. Ratings plummeted to 1.0 because users expected Tinder and got a location-based radar with a sarcastic narrator telling them to go outside.<p>I spent months solving memory leaks and building Redis spatial indexing, only to be rewarded with crotch photos and 1-star reviews. This is the darkest moment for solo devs. Total isolation.<p>Current State<p>After 1 year solo:
38,106 lines of code (Vanilla JS, PHP, Redis)
€0 marketing budget
15 active users
Regrets: 0<p>Tech stack:
Frontend: Vanilla JS PWA (No big frameworks, just sweat)
Backend: PHP + MySQL + Redis (Spatial indexing&#x2F;GeoSearch)
Video: Client-side FFmpeg.wasm
Infra: €30&#x2F;month VPS<p>What I Learned<p>Users will misunderstand your cathedral and shit in the corner. Those who stay to help clean are your true audience.
Don&#x27;t build for everyone (build for yourself first).
Tech stack doesn&#x27;t matter (PHP is a sleeper hit for Geo).
Being a designer who codes is a superpower (and a curse).<p>Try it: https:&#x2F;&#x2F;play.google.com&#x2F;store&#x2F;apps&#x2F;details?id=me.bliip.twa
Web: https:&#x2F;&#x2F;bliip.me

## 自动提取的痛点信号

- 命中关键词: \b(frustrating|nightmare|wasting hours|wastes my time)\b, \btried .{1,40}? but\b
- 互动度: 8
- 作者: u/fariniasty

<!-- 处理: 调度员 → 5 阶段 pipeline -->
