---
date: 2025-08-13
source: hn
source_detail: "hn post 44883634 by u/_rkcg"
url: "https://news.ycombinator.com/item?id=44883634"
topic: "VC-backed company just killed my EU trademark for a small OSS project"
author: _rkcg
engagement: 1103
created_utc: 2025-08-13T01:14:36Z
pain_keywords: ["\\b(frustrating|nightmare|wasting hours|wastes my time)\\b"]
confidence: medium
status: raw
raw_intake_version: plan_b_v1
---

# VC-backed company just killed my EU trademark for a small OSS project

> **Source**: https://news.ycombinator.com/item?id=44883634

## 原始内容

I run a small open-source project [name-redacted] (Trademark [number-redacted]) I&#x27;ve been building for many years. It&#x27;s not huge, just a few thousand users compared to the big OSS names, but to me it was worth protecting, so I trademarked the name in the EU and US a few years back. I had hoped to be protected from other corporations this way and live peacefully.<p>A $160M-funded company named [name-redacted] (Trademark [number-redacted]) came along and filed for cancellation at EUIPO since they needed the trademark now after getting lots of funding. They won. Now my trademark is gone.<p>The frustrating part? The EU actually does allow open-source (even free projects) to have trademarks, but you have to prove &quot;genuine use&quot; in the EU for the goods&#x2F;services your trademark covers. Which seems to force you in collecting user sensitive data otherwise you are entirely unable to prove that you have actual users in the EU. I generally try to collect as little information as possible (also because I don&#x27;t care where my users are coming from). I had google analytics running for some time on the main page (not documentation), but most of the time it didn&#x27;t work and it seems most of my users block it anyway.<p>Here&#x27;s what I gave the EUIPO and why they said no:<p>- Google Analytics for my site with a full country breakdown from 2018–2023. A few hundred to ~1,800 EU visitors per year per country. They said that’s &quot;too small&quot; to count as real commercial exploitation for my Class 9 software. Also, they said they couldn’t tell which goods those visits were actually for.<p>- npmjs + GitHub stats - hundreds of thousands of downloads and thousands of stars. Rejected because there&#x27;s no location data, so they couldn&#x27;t confirm if the usage was in the EU. In some cases, they said the timeframes weren&#x27;t even clear.<p>- They basically kept repeating that they couldn&#x27;t clearly link any of the usage to the specific goods&#x2F;services my trademark was registered for.<p>The conclusion:<p>&gt;Conclusion: It follows from the above that the EUTM proprietor has not proven genuine use of the contested mark for any of the goods and services for which it is registered. As a result, the application for revocation is wholly successful and the contested European Union trade mark must be revoked in its entirety. According to Article 62(1) EUTMR, the revocation will take effect from the date of the application for revocation, that is, as of 18&#x2F;03&#x2F;2024.<p>&gt;COSTS: According to Article 109(1) EUTMR, the losing party in cancellation proceedings must bear fees and costs incurred by the other party.<p>They even admitted there&#x27;s no strict minimum for usage, and free software can count, but in their eyes my EU traffic was too low and not clearly tied to the trademarked goods.<p>I also have the US trademark for the name. This same company tried to register in the US around 2022 (Trademark #79379273) and got blocked because it was too similar (decision made by USPTO). But a few months ago they somehow got it registered there too (Trademark #7789522), not sure how they did that now.<p>Now I&#x27;m sitting here wondering:<p>- Is it even worth getting a second opinion and appealing in the EU? I mean the project is very small.<p>- Should I fight the US registration?<p>- Or should I just walk away from trademarks altogether for my open-source projects. I lost so much money because of this already.<p>- And for OSS projects in general, is there even a practical, privacy-friendly way to prove EU usage without generating revenue?<p>- Is it even worth holding the trademark if proving EU usage is this brittle for OSS? If the trademark can be deleted just like that even after spending a few thousands dollars on lawyers. Probably a skill issue, but still, damn.<p>It sucks to lose the name I&#x27;ve been building for years to a corporation with $160M behind them, especially when this is just a side project I do in my spare time, and to them I&#x27;m a nobody. If nothing else, maybe my case can be a cautionary tale for other OSS maintainers.

## 自动提取的痛点信号

- 命中关键词: \b(frustrating|nightmare|wasting hours|wastes my time)\b
- 互动度: 1103
- 作者: u/_rkcg

<!-- 处理: 调度员 → 5 阶段 pipeline -->
