---
date: 2015-12-08
source: se
source_detail: "se post softwarerecs_27087 by u/Thomas W."
url: "https://softwarerecs.stackexchange.com/questions/27087/ifttt-for-offline-use"
topic: "IFTTT for offline use"
author: Thomas W.
engagement: 43
created_utc: 2015-12-08T20:16:36Z
pain_keywords: ["\\b(recommend|looking for) a tool\\b"]
confidence: medium
status: raw
raw_intake_version: plan_b_v1
---

# IFTTT for offline use

> **Source**: https://softwarerecs.stackexchange.com/questions/27087/ifttt-for-offline-use

## 原始内容

I am looking for a tool that would make my office life a bit easier. While I don't really like the online-ness of IFTTT (and I am not allowed to use it in the office anyway), from what I read and heard about IFTTT, that sounds much what I'm looking for.

E.g. I'd like

if a file changes, pop up a notice
if a file changes and certain content was found, play a sound
if the screensaver starts, suspend the VMs and take a snapshot
if I am away from keyboard for >5 minutes, run some unit tests (basically: run a program)
every 20 minutes, remind me of drinking some water
very minute, check the availability of servers and notify me if one is not available
if my IP address changes, enable the firewall
if I'm in the office before 8:00, do a HTTP request to wake up the server and start caching (haha, those pieces need a restart every night and are really slow if you access them the first time)
...

The program

must run offline, i.e. is a local installation. As mentioned before, it should have some online features like HTTP, Ping etc.
should cost <300 USD. If it is that expensive, it should be worth the money and really be a time saver.
should be available as a perpetual personal license that allows being installed on a PC and laptop at the same time
must work on Windows 10 x64

I am not looking for a programming language suggestion. I know C# and I could implement all that myself if I just had the time. I also know Windows Task scheduler can run tasks at certain times.

I have tried:

Microsoft Power Automate, but it cannot react on file content changes, cannot react on IP address change, cannot determine the user idle time of the PC and does not provide an event system at all. Any event-like action needs to be modeled as an endless loop. It needs a Microsoft account.

## 自动提取的痛点信号

- 命中关键词: \b(recommend|looking for) a tool\b
- 互动度: 43
- 作者: u/Thomas W.

<!-- 处理: 调度员 → 5 阶段 pipeline -->
