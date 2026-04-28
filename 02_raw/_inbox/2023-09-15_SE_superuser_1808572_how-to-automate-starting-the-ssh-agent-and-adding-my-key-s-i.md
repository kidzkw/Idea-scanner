---
date: 2023-09-15
source: se
source_detail: "se post superuser_1808572 by u/DeltaIV"
url: "https://superuser.com/questions/1808572/how-to-automate-starting-the-ssh-agent-and-adding-my-keys-in-wsl2-for-windows"
topic: "How to automate starting the ssh agent and adding my key(s) in WSL2 for Windows 11"
author: DeltaIV
engagement: 432
created_utc: 2023-09-15T16:22:48Z
pain_keywords: ["\\bis there (a|an|any) (tool|app|way)\\b"]
confidence: medium
status: raw
raw_intake_version: plan_b_v1
---

# How to automate starting the ssh agent and adding my key(s) in WSL2 for Windows 11

> **Source**: https://superuser.com/questions/1808572/how-to-automate-starting-the-ssh-agent-and-adding-my-keys-in-wsl2-for-windows

## 原始内容

OS: Windows 11 Version 10.0.22621 Build 22621
WSL version: 1.2.5.0 (WSL 2)
Linux distro: Ubuntu 22.04.2 LTS

I run WSL2 on Windows 11 in a Windows Terminal window, and I often connect to a remote server through ssh key authentication. To do that, each time I open a new Windows Terminal window (or even just a new tab in an existing Terminal) I need to execute
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/my_key

(it's a key without a passphrase). This gets old very quickly. Is there a way that I can automate the launch of the ssh agent, and the addition of my key to it, every time I start a  WSL2 session in the Windows Terminal?

## 自动提取的痛点信号

- 命中关键词: \bis there (a|an|any) (tool|app|way)\b
- 互动度: 432
- 作者: u/DeltaIV

<!-- 处理: 调度员 → 5 阶段 pipeline -->
