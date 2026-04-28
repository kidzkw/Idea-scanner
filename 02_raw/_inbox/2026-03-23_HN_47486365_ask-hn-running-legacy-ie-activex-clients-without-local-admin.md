---
date: 2026-03-23
source: hn
source_detail: "hn post 47486365 by u/Servant-of-Inos"
url: "https://news.ycombinator.com/item?id=47486365"
topic: "Ask HN: Running legacy IE/ActiveX clients without local admin rights?"
author: Servant-of-Inos
engagement: 34
created_utc: 2026-03-23T07:20:50Z
pain_keywords: ["\\bworkaround\\b"]
confidence: medium
status: raw
raw_intake_version: plan_b_v1
---

# Ask HN: Running legacy IE/ActiveX clients without local admin rights?

> **Source**: https://news.ycombinator.com/item?id=47486365

## 原始内容

We are currently maintaining a very old client-server architecture. The server collects real-time data from a large number of sensors and controllers, transmitting it to a legacy database under continuous, massive load (writes every few seconds).<p>The problem is the client side. It’s ancient, strictly requires Internet Explorer, and heavily relies on ActiveX. If a standard domain user launches the browser, the data fails to load and the browser completely hangs. It only functions correctly if run with local administrator privileges.<p>Giving users local admin rights is a massive security risk we can&#x27;t take. Currently, I have a workaround running in production using Task Scheduler to elevate just this specific application without giving the user the actual admin password. I documented the specific approach we are using here:
https:&#x2F;&#x2F;www.hiddenobelisk.com&#x2F;how-to-let-a-standard-domain-user-run-one-program-as-administrator-without-giving-admin-rights&#x2F;#:~:text=least%20privilege.-,Approach%202%20%E2%80%94%20Running%20Applications%20with%20Administrative%20Privileges%20Using%20Task%20Scheduler,users%20can%20simply%20double%2Dclick%20the%20shortcut%20to%20launch%20the%20application.,-Changing%20the%20Shortcut<p>I recently started a thread over on r&#x2F;sysadmin trying to find a cleaner solution:
https:&#x2F;&#x2F;www.reddit.com&#x2F;r&#x2F;sysadmin&#x2F;comments&#x2F;1rm6uv4&#x2F;how_do_you_let_a_standard_domain_user_run_one&#x2F;<p>The general consensus there was to either buy an expensive enterprise PAM (Privileged Access Management) solution, or deep-dive with Procmon. I am currently analyzing the software with Procmon based on that advice, but so far, I haven&#x27;t been able to make the client work without the Task Scheduler workaround.<p>My questions for the HN community:<p>1) Are there any reliable open-source PAM alternatives or privilege elevation tools for Windows that handle this &quot;per-app&quot; scenario effectively?<p>2) When dealing with hostile ActiveX components, are there specific legacy behaviors (beyond obvious file&#x2F;registry Access Denied) I should be looking for in my Procmon captures?<p>3) How do you isolate this kind of hardcoded legacy requirement when there is zero budget for commercial enterprise tools?

## 自动提取的痛点信号

- 命中关键词: \bworkaround\b
- 互动度: 34
- 作者: u/Servant-of-Inos

<!-- 处理: 调度员 → 5 阶段 pipeline -->
