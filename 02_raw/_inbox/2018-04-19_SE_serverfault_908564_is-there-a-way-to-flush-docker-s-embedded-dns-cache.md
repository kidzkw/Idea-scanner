---
date: 2018-04-19
source: se
source_detail: "se post serverfault_908564 by u/rascalking"
url: "https://serverfault.com/questions/908564/is-there-a-way-to-flush-dockers-embedded-dns-cache"
topic: "Is there a way to flush docker's embedded dns cache?"
author: rascalking
engagement: 84
created_utc: 2018-04-19T18:54:28Z
pain_keywords: ["\\bis there (a|an|any) (tool|app|way)\\b"]
confidence: medium
status: raw
raw_intake_version: plan_b_v1
---

# Is there a way to flush docker's embedded dns cache?

> **Source**: https://serverfault.com/questions/908564/is-there-a-way-to-flush-dockers-embedded-dns-cache

## 原始内容

I'm working in an environment where sometimes the DNS server flakes out and tells you it can't resolve a host (eg. lookup of "github.com" fails).  It's transient, and usually recovers fairly quickly.  However, sometimes when it happens, it seems like the embedded DNS service the docker daemon provides on user-defined bridge networks will cache the bad result.  Once it's been cached, we end up needing to remove the network entirely and rebuild it (ie. docker-compose down, then docker-compose up).  I'm seeing this on a debian jessie box, running docker-engine 17.05.0-ce, build 89658be.

Has anyone else encountered this, and maybe figured out a lighter-weight solution than having to tear down and rebuild the network?

## 自动提取的痛点信号

- 命中关键词: \bis there (a|an|any) (tool|app|way)\b
- 互动度: 84
- 作者: u/rascalking

<!-- 处理: 调度员 → 5 阶段 pipeline -->
