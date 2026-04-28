---
date: 2014-11-06
source: se
source_detail: "se post serverfault_642612 by u/SiMe"
url: "https://serverfault.com/questions/642612/802-1x-wired-auth-after-domain-change"
topic: "802.1x wired auth after domain change"
author: SiMe
engagement: 3
created_utc: 2014-11-06T23:37:20Z
pain_keywords: ["\\bis there (a|an|any) (tool|app|way)\\b"]
confidence: medium
status: raw
raw_intake_version: plan_b_v1
---

# 802.1x wired auth after domain change

> **Source**: https://serverfault.com/questions/642612/802-1x-wired-auth-after-domain-change

## 原始内容

I have been trying to find a solution to this issue for the past 2 weeks and it's driving me nuts. Hopefully someone out there can help me.

We are in the process of migrating Windows 7 clients from multiple childdomains into one root domain. We have a migration script that joins them from child.domain.net into domain.net. Works very well.
However, we now face the challenge that some of our locations are using 802.1x on our switches that authenticate the clients against a Windows 2003 IAS server that is in the root domain. The IAS server is located in city A and has a Domain Controller in the same subnet that it validates the requests against. If we migrate a client in city B to the new domain, the domain join process takes place on the local domain controller in city B. IT takes up to 15 minutes for the DCs in city A and city B to replicate with each other. After the domain join, the client reboots and would be able to authenticate against the local DC. However, the switch is asking the IAS server in city A if the client is allowed to get on the network. IAS server ask its local DC, which does not know anything about the new object and denies the request, so the client has to wait for the replication cycle to finish.

Is there any way to fix this? I was hoping that I could tell the IAS server to allow any client that has a FQDN of *.domain.net to allow access without validating credentials. But all of my research tells me that this is not possible. I am not a friend of accepting defeat, so I was hoping that someone ran across the same or a similar issue and has some advice.

Appreciate any help.
Thanks.

## 自动提取的痛点信号

- 命中关键词: \bis there (a|an|any) (tool|app|way)\b
- 互动度: 3
- 作者: u/SiMe

<!-- 处理: 调度员 → 5 阶段 pipeline -->
