---
date: 2015-06-11
source: se
source_detail: "se post serverfault_698314 by u/eggyal"
url: "https://serverfault.com/questions/698314/802-1x-login-window-profile-fails-because-it-cant-prompt-for-missing-propertie"
topic: "802.1x Login Window profile fails because it 'can't prompt for missing properties'"
author: eggyal
engagement: 14
created_utc: 2015-06-11T14:29:49Z
pain_keywords: ["\\bis there (a|an|any) (tool|app|way)\\b"]
confidence: medium
status: raw
raw_intake_version: plan_b_v1
---

# 802.1x Login Window profile fails because it "can't prompt for missing properties"

> **Source**: https://serverfault.com/questions/698314/802-1x-login-window-profile-fails-because-it-cant-prompt-for-missing-propertie

## 原始内容

I'm trying to configure a TTLS 802.1x Login Window profile on OS X 10.10.1 Yosemite.

The profile has been installed (via MDM) and the login window now shows (above the username/password input boxes) a dropdown from which the 802.1x profile can be selected; furthermore, when a user attempts to log in, 802.1x authentication is attempted.

However, that authentication fails; having enabled supplicant logging, I see the following error after the TLS tunnel is set up:

EAP Request: EAP type 21
Authenticating: can't prompt for missing properties <array> {
  0 : UserPassword
}
set_msk 0
Supplicant (main) status: state=Held

...but I had thought that the whole point of Login Window profiles was that the username and password used for 802.1x were those provided by the user at the login window!

What's going on?

UPDATE

It seems that the selection of an identity certificate in the network payload was causing OS X to ignore the user credentials provided at the login window.

Is there any way to use a (system-wide) client certificate during the TLS handshake, but also use the user creds from the login window for the inner/tunneled authentication?

## 自动提取的痛点信号

- 命中关键词: \bis there (a|an|any) (tool|app|way)\b
- 互动度: 14
- 作者: u/eggyal

<!-- 处理: 调度员 → 5 阶段 pipeline -->
