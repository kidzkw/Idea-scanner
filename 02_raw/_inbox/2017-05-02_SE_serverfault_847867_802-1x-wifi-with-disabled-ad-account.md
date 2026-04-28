---
date: 2017-05-02
source: se
source_detail: "se post serverfault_847867 by u/kccoers"
url: "https://serverfault.com/questions/847867/802-1x-wifi-with-disabled-ad-account"
topic: "802.1x Wifi with Disabled AD Account"
author: kccoers
engagement: 10
created_utc: 2017-05-02T19:50:27Z
pain_keywords: ["\\bis there (a|an|any) (tool|app|way)\\b"]
confidence: medium
status: raw
raw_intake_version: plan_b_v1
---

# 802.1x Wifi with Disabled AD Account

> **Source**: https://serverfault.com/questions/847867/802-1x-wifi-with-disabled-ad-account

## 原始内容

I have setup an NPS Server (Windows Server 2016) which uses RADIUS to allow my users to authenticate against AD for their Wireless Connections.

When I disable an account in AD, NPS will not allow the user to authenticate and the connection fails. However, if I disable an AD account after the user has authenticated and connected, the connection persists until the client disconnects and re-negotiates.

I have checked in NPS settings, Google searches return generic/non-related results, etc...

Is there a way to drop the 802.1x connection when the account has been deleted?

Thank you for any help you can provide!

## 自动提取的痛点信号

- 命中关键词: \bis there (a|an|any) (tool|app|way)\b
- 互动度: 10
- 作者: u/kccoers

<!-- 处理: 调度员 → 5 阶段 pipeline -->
