---
date: 2015-06-24
source: se
source_detail: "se post serverfault_701419 by u/RedPixel"
url: "https://serverfault.com/questions/701419/how-can-i-let-rsync-display-both-total-and-partial-progress"
topic: "How can I let rsync display both total and partial progress?"
author: RedPixel
engagement: 36
created_utc: 2015-06-24T20:01:43Z
pain_keywords: ["\\bis there (a|an|any) (tool|app|way)\\b"]
confidence: medium
status: raw
raw_intake_version: plan_b_v1
---

# How can I let rsync display both total and partial progress?

> **Source**: https://serverfault.com/questions/701419/how-can-i-let-rsync-display-both-total-and-partial-progress

## 原始内容

I've found that rsync's total progress is (somewhat) shown with --info=progress2, while partial progress (i.e. the current file) is shown with --info=progress (or -P).

Is there a way to show both?

I've tried things like: 
rsync -avP --info=progress --info=progress2 --progress src dst, but that only shows total progress.

I'm running Ubuntu 14.04.2, with rsync  version 3.1.0  protocol version 31

## 自动提取的痛点信号

- 命中关键词: \bis there (a|an|any) (tool|app|way)\b
- 互动度: 36
- 作者: u/RedPixel

<!-- 处理: 调度员 → 5 阶段 pipeline -->
