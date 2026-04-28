---
date: 2020-04-03
source: se
source_detail: "se post superuser_1538525 by u/Nico"
url: "https://superuser.com/questions/1538525/ubuntu-unattended-upgrades-stops-docker"
topic: "Ubuntu unattended upgrades stops Docker"
author: Nico
engagement: 27
created_utc: 2020-04-03T14:23:26Z
pain_keywords: ["\\bis there (a|an|any) (tool|app|way)\\b"]
confidence: medium
status: raw
raw_intake_version: plan_b_v1
---

# Ubuntu unattended upgrades stops Docker

> **Source**: https://superuser.com/questions/1538525/ubuntu-unattended-upgrades-stops-docker

## 原始内容

This is my current 50-unattended-upgrades file:

Unattended-Upgrade::Automatic-Reboot "false";
Unattended-Upgrade::Allowed-Origins {
    "${distro_id}:${distro_codename}";
    "${distro_id}:${distro_codename}-security";
    "${distro_id}ESM:${distro_codename}";
    "${distro_id}:${distro_codename}-updates";
};

// List of packages to not update (regexp are supported)
Unattended-Upgrade::Package-Blacklist {};
Unattended-Upgrade::DevRelease "false";
Unattended-Upgrade::Remove-Unused-Kernel-Packages "true";
Unattended-Upgrade::Remove-Unused-Dependencies "true";

A containerd upgrade was done early in the morning

2020-04-03 06:39:18,853 INFO Initial blacklisted packages:
2020-04-03 06:39:18,854 INFO Initial whitelisted packages:
2020-04-03 06:39:18,854 INFO Starting unattended upgrades script
2020-04-03 06:39:18,854 INFO Allowed origins are: o=Ubuntu,a=bionic, o=Ubuntu,a=bionic-security, o=UbuntuESM,a=bionic, o=Ubuntu,a=bionic-updates
2020-04-03 06:39:22,458 INFO Packages that will be upgraded: containerd
2020-04-03 06:39:22,458 INFO Writing dpkg log to /var/log/unattended-upgrades/unattended-upgrades-dpkg.log
2020-04-03 06:39:29,941 INFO All upgrades installed

Which caused docker to stop via Systemd.

Apr 03 06:39:23 ip-10-2-1-12 systemd[1]: Stopping Docker Application Container Engine...
Apr 03 06:39:23 ip-10-2-1-12 dockerd[3214]: time="2020-04-03T06:39:23.782508859Z" level=info msg="Processing signal 'terminated'"
Apr 03 06:39:23 ip-10-2-1-12 dockerd[3214]: time="2020-04-03T06:39:23.933398454Z" level=info msg="ignoring event" module=libcontainerd namespace=moby
topic=/tasks/delete type="*events.TaskDelete"
Apr 03 06:39:23 ip-10-2-1-12 dockerd[3214]: time="2020-04-03T06:39:23.945486871Z" level=info msg="ignoring event" module=libcontainerd namespace=moby
topic=/tasks/delete type="*events.TaskDelete"
Apr 03 06:39:24 ip-10-2-1-12 dockerd[3214]: time="2020-04-03T06:39:24.155022784Z" level=info msg="stopping event stream following graceful shutdown" e
rror="<nil>" module=libcontainerd namespace=moby
Apr 03 06:39:24 ip-10-2-1-12 systemd[1]: Stopped Docker Application Container Engine.

Is there any way to override this behavior? I would prefer a systemctl restart rather than a systemctl stop. 

Relevant data:

Ubuntu 18.04.4 LTS
Docker 19.03.6 installed by apt

## 自动提取的痛点信号

- 命中关键词: \bis there (a|an|any) (tool|app|way)\b
- 互动度: 27
- 作者: u/Nico

<!-- 处理: 调度员 → 5 阶段 pipeline -->
