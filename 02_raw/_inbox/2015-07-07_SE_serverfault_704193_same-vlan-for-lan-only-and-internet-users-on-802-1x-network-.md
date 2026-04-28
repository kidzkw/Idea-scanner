---
date: 2015-07-07
source: se
source_detail: "se post serverfault_704193 by u/qschulz"
url: "https://serverfault.com/questions/704193/same-vlan-for-lan-only-and-internet-users-on-802-1x-network-with-pfsense-as-gate"
topic: "Same VLAN for LAN only and Internet users on 802.1x network with pfSense as gateway"
author: qschulz
engagement: 7
created_utc: 2015-07-07T20:49:26Z
pain_keywords: ["\\bis there (a|an|any) (tool|app|way)\\b"]
confidence: medium
status: raw
raw_intake_version: plan_b_v1
---

# Same VLAN for LAN only and Internet users on 802.1x network with pfSense as gateway

> **Source**: https://serverfault.com/questions/704193/same-vlan-for-lan-only-and-internet-users-on-802-1x-network-with-pfsense-as-gate

## 原始内容

I am creating an ISP for a student residence. The LAN is already there and working, with several CISCO switches. I want to provide Internet by a secured and automatic way to those who pay for it (monthly). In short future, there also might be an Access Point (CISCO again) in a "not-so-private" place (mainly students but they might not be living in the residence) to connect to the network, so the connection has to be secured and limited to the resident (it is acceptable if only the paying user access the network wirelessly).

Here are my wishes: 

logins should be straightforward and adapted to an always-changing community (150-200 departures/arrivals each year)
automatically disconnect a user from Internet (he still can use the LAN) after the end of his subscription
management interface for Internet gateway (bandwidth, connected users, ...)
Captive portal (or something else) to explain how to subscribe when the non-paying user want to access Internet

However I have one big constraint:  people (paying users or not) have to be able to communicate between them (same VLAN).

For 1. I think that 802.1x PEAP is the correct solution, it's using certificate on server and only username/password on the client part. I don't have to put the certificate on each device.
For 2. I was thinking of using 'expiration' from LDAP radiusProfile objectClass and update this value when the user subscribes.
For 3. and 4. one of the solutions might be pfSense.

Because of 802.1x and the constraint of users being on the same LAN, is there another possibility than making the non-paying user have a RADIUS "user account"? I'm assuming no.

As I understand, 802.1x is configured on network devices (AP or switch) and directly communicate with the RADIUS server, so how can pfSense know when a user is authenticated on one of the network devices so it can bypass the captive portal? I don't want my users to have to login on their device and again on the captive portal, it has to be transparent.

Here is how I see the implementation:

User NP: non-paying user = access to LAN but not to Internet; access to captive portal when asking for Internet;
User P: paying user = access to LAN and Internet until suscription expires;

User NP User P
  |       |          _______  same     ________                 _________
  |       |   802.1x |RADIUS| VLAN    |pfSense| User P requests |        |
---------------------|Client|---------|Net    |-----------------|INTERNET|
                     |______|         |Getaway|                 |________|
                                          |
                                          |User NP requests
                                      ____|___
                                     |Captive|
                                     |portal |
                                     |_______|

The problem is I don't see how pfSense can know if User P is allowed to connect to the Internet without asking the user its RADIUS username and password in order to bypass the captive portal. Is there a way, pfSense can automatically retrieve information on the 802.1x connection without relogging? Or maybe I am missing something or I misunderstood how 802.1x works?

I'm open to any suggestion, change or anything but it has to fullfil the critical cirteria: the constraint and wishes 1 to 3.

## 自动提取的痛点信号

- 命中关键词: \bis there (a|an|any) (tool|app|way)\b
- 互动度: 7
- 作者: u/qschulz

<!-- 处理: 调度员 → 5 阶段 pipeline -->
