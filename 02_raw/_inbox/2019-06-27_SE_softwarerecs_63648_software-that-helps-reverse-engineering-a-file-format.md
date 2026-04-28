---
date: 2019-06-27
source: se
source_detail: "se post softwarerecs_63648 by u/Thomas W."
url: "https://softwarerecs.stackexchange.com/questions/63648/software-that-helps-reverse-engineering-a-file-format"
topic: "Software that helps reverse-engineering a file format"
author: Thomas W.
engagement: 9
created_utc: 2019-06-27T09:00:56Z
pain_keywords: ["\\bI('?d| would) pay\\b"]
confidence: medium
status: raw
raw_intake_version: plan_b_v1
---

# Software that helps reverse-engineering a file format

> **Source**: https://softwarerecs.stackexchange.com/questions/63648/software-that-helps-reverse-engineering-a-file-format

## 原始内容

I'm working on a legacy software project. The software uses a file format which is not documented. Now, I need to understand that file format, i.e. I'm reverse engineering it.

There are several approaches that can be used for reverse engineering it. For one of them, there could be tool support. The only tool I know does not aggregate the results and display it in a human-friendly way.

Let me explain by example:

Using a tool like Process Monitor, it is possible to find out at which offset and how long a software reads or writes the file.

In the given case, we can assume that there is a 36 bytes data structure somewhere in the program which then defines the e.g. the length of the next block (158 bytes or 124 bytes).

That's great and already helpful.

What I need:

I need to do that for many different files and I want to have it in a graphical way, e.g. a heat map which shows the read and write operations together with the data of the underlying file:

The more highlighted the region of the file is, the more read and write operations have been done in that region. The lighter the color, the less operations.

The next step of processing is then to write a 010 Editor Template for the file in order to add the semantics. This will be done in a separate program (010 Editor) and doe not need to be part of this request.

I'd need such a software for Windows and I'd pay ~100 € for it.

## 自动提取的痛点信号

- 命中关键词: \bI('?d| would) pay\b
- 互动度: 9
- 作者: u/Thomas W.

<!-- 处理: 调度员 → 5 阶段 pipeline -->
