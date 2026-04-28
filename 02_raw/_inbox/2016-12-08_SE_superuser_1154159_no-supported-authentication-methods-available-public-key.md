---
date: 2016-12-08
source: se
source_detail: "se post superuser_1154159 by u/Mirek Mareš"
url: "https://superuser.com/questions/1154159/no-supported-authentication-methods-available-public-key"
topic: "No supported authentication methods available public key"
author: Mirek Mareš
engagement: 40
created_utc: 2016-12-08T01:01:46Z
pain_keywords: ["\\btried .{1,40}? but\\b"]
confidence: medium
status: raw
raw_intake_version: plan_b_v1
---

# No supported authentication methods available public key

> **Source**: https://superuser.com/questions/1154159/no-supported-authentication-methods-available-public-key

## 原始内容

I have school project server - debian 8 jessie and I have working SSH Key-based authentication. My problem is, that I created new user named tester and he is unable to connect to server and it give the following error:

  

No supported authentication methods available public key

I tried to change testers key to my own and then I tried to connect as tester by myself but it doesn't work.

I'm really newbie to this, so i have no clue what is wrong. I will be happy for any advices.

I used these commands

useradd -G users,sudo tester
passwd tester
mkdir /home/tester
mkdir /home/tester/.ssh
chown tester:tester /home/tester
chown tester:tester /home/tester/.ssh
chmod go-rx /home/tester
chmod go-rx /home/tester/.ssh
mv /home/marm04/authorized_keys /home/tester/.ssh
chown tester:tester /home/tester/.ssh/authorized_keys

## 自动提取的痛点信号

- 命中关键词: \btried .{1,40}? but\b
- 互动度: 40
- 作者: u/Mirek Mareš

<!-- 处理: 调度员 → 5 阶段 pipeline -->
