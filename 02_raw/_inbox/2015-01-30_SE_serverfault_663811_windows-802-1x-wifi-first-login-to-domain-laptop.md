---
date: 2015-01-30
source: se
source_detail: "se post serverfault_663811 by u/David Mackintosh"
url: "https://serverfault.com/questions/663811/windows-802-1x-wifi-first-login-to-domain-laptop"
topic: "Windows 802.1X WiFi First Login To Domain Laptop"
author: David Mackintosh
engagement: 119
created_utc: 2015-01-30T20:24:53Z
pain_keywords: ["\\bis there (a|an|any) (tool|app|way)\\b"]
confidence: medium
status: raw
raw_intake_version: plan_b_v1
---

# Windows 802.1X WiFi First Login To Domain Laptop

> **Source**: https://serverfault.com/questions/663811/windows-802-1x-wifi-first-login-to-domain-laptop

## 原始内容

So I have my Windows laptops using 802.1X for authentication to connect to my WPA2-Enterprise WiFi network.  This works well except for one edge case.

These laptops are Windows 7 Pro and Windows 8 Pro.

As a background, I have only been able to get users to successfully log in to such a laptop if their profile already exists in some way on the laptop -- ie cached credentials are used for the login, which are then passed on to the 802.1X process for authorization to connect to the WiFi.

I am now being shipped laptops without physical ethernet connectors, meaning that I can't have users log in for the first time when connected by a wire.  And therefore I have a chicken-and-egg problem:

there are no cached credentials;
the laptop doesn't try to connect to the WiFi because there are no credentials to pass through
the laptop can't authenticate the credentials because there is no network over which to perform the authentication

What I want is a way to set the laptop to pass the authentication information to the WiFi network before it tries to authenticate the user as a user.  In other words, set up the network with the passed credentials so we have a network with which to perform the authentication.

I have tried:

the Enable single sign on for this network
the Perform immediately before user logon
the HKLM\Software\Microsoft\Windows\CurrentVersion\Run regedit update
the Computer Configuration\Policies\Administrative templates\System\Logon\Always wait for the network at computer startup and logon local policy change

The last two seem to depend on the network being a PSK network, not a Enterprise network, since network connect fails prior to logon because there are no credentials to use for connection.

Is there a way to make this work, or am I stuck buying a USB ethernet dongle and having users do their first logins using that?

## 自动提取的痛点信号

- 命中关键词: \bis there (a|an|any) (tool|app|way)\b
- 互动度: 119
- 作者: u/David Mackintosh

<!-- 处理: 调度员 → 5 阶段 pipeline -->
