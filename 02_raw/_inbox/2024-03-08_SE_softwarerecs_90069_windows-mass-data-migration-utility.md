---
date: 2024-03-08
source: se
source_detail: "se post softwarerecs_90069 by u/InfiniPLEX"
url: "https://softwarerecs.stackexchange.com/questions/90069/windows-mass-data-migration-utility"
topic: "Windows mass data migration utility"
author: InfiniPLEX
engagement: 3
created_utc: 2024-03-08T23:04:35Z
pain_keywords: ["\\btried .{1,40}? but\\b"]
confidence: medium
status: raw
raw_intake_version: plan_b_v1
---

# Windows mass data migration utility

> **Source**: https://softwarerecs.stackexchange.com/questions/90069/windows-mass-data-migration-utility

## 原始内容

I am looking for a utility in Windows that will transfer a massive amount of data between volumes (40+ TB, 15 million files). I ideally want something that I can set and forget for a few weeks, and have it generate a list of errors. Of course this has to be a file level migration utility, so that leaves out tools like disk2vhd and the like. And because some of this data has to be mounted on another server, this also needs to work decent over the network.

I have already tried several utilities, but they all have some sort of issues.

Windows file transfer is decent but it is slow, single threaded,
stops the entire transfer on a problem, and does not copy long paths.
While robocopy may work, I am afraid of it corrupting the

deduplication tables on my drives. (this also leaves out all of the robocopy GUIs)
Rich copy was probably the most efficient, but it does not copy
long paths, and often crashed.
Teracopy also randomly crashes
7Zip, surprisingly can copy files, but it is worse than Windows.
Windows server storage migration I just can't get to work.
Copy-Item on powershell screws something up because it copies folders to random places

## 自动提取的痛点信号

- 命中关键词: \btried .{1,40}? but\b
- 互动度: 3
- 作者: u/InfiniPLEX

<!-- 处理: 调度员 → 5 阶段 pipeline -->
