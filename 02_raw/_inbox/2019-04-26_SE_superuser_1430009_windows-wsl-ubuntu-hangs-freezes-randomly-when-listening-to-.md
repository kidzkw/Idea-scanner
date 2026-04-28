---
date: 2019-04-26
source: se
source_detail: "se post superuser_1430009 by u/lukastillmann"
url: "https://superuser.com/questions/1430009/windows-wsl-ubuntu-hangs-freezes-randomly-when-listening-to-ports"
topic: "Windows WSL (Ubuntu) hangs/freezes randomly when listening to ports"
author: lukastillmann
engagement: 63
created_utc: 2019-04-26T12:56:27Z
pain_keywords: ["\\bis there (a|an|any) (tool|app|way)\\b", "\\btried .{1,40}? but\\b"]
confidence: medium
status: raw
raw_intake_version: plan_b_v1
---

# Windows WSL (Ubuntu) hangs/freezes randomly when listening to ports

> **Source**: https://superuser.com/questions/1430009/windows-wsl-ubuntu-hangs-freezes-randomly-when-listening-to-ports

## 原始内容

I am running Windows 10 with the Ubuntu WSL subsystem. I am a Javascript developer. I have used this setup for a while now and I am very happy with it. However, I needed to set up a new computer yesterday and on that machine, the bash keeps freezing after a couple of minutes of work.

The window simply hangs and I cannot interact with it anymore. If I try to close and restart the program it will hang on the empty black bash background. Only if I restart Windows, it starts normally again.

Is there any way to debug the Linux subsystem? Are there logs that might be helpful?

It keeps happening and interrupting my work. However I really do not want to change my setup because that leads to whole different kinds of issues.

Any suggestions might be helpful!

Update4 (2019-05-21):

The problem only occurs, when I run some kind of development server that is listening to a specific port (e.g. 7080). I have run my distro for more than a week without any issues, but as soon as I try to start a dev server (in this case with ringojs), wsl freezes after a while.

Update3:

There is nothing in the windows event log after a crash. I am not able to stop processes and services involved. I have tried restarting the LxssManager service, but it also hangs while shutting down and won't restart.
All Ubuntu distributions in the Store have this issue. I can start another distribution and work from that. However, if I had started a dev server on the hung system, I cannot use that port again, which makes it useless in most cases.

Only a restart fixes the problem.

Update2:

This is new: I changed to Ubuntu 18.04 distribution, which has also frozen by now. But now, when I start to restart it, i get an Error:: 0x80070040

Update:

I am running Windows 10 1893 (build 17134.707) with the generic "Ubuntu" distribution from the Windows store (i.e. NOT 16.04 LTS or one of the others)

## 自动提取的痛点信号

- 命中关键词: \bis there (a|an|any) (tool|app|way)\b, \btried .{1,40}? but\b
- 互动度: 63
- 作者: u/lukastillmann

<!-- 处理: 调度员 → 5 阶段 pipeline -->
