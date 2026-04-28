---
date: 2021-03-31
source: se
source_detail: "se post serverfault_1058897 by u/Craig Ringer"
url: "https://serverfault.com/questions/1058897/applying-systemd-control-group-resource-limits-automatically-to-specific-user-ap"
topic: "Applying systemd control group resource limits automatically to specific user applications in a gnome-shell session"
author: Craig Ringer
engagement: 29
created_utc: 2021-03-31T02:34:46Z
pain_keywords: ["\\bis there (a|an|any) (tool|app|way)\\b", "\\bworkaround\\b"]
confidence: medium
status: raw
raw_intake_version: plan_b_v1
---

# Applying systemd control group resource limits automatically to specific user applications in a gnome-shell session

> **Source**: https://serverfault.com/questions/1058897/applying-systemd-control-group-resource-limits-automatically-to-specific-user-ap

## 原始内容

Having seen that GNOME now launches apps under systemd scopes I've been looking at a way to get systemd to apply some cgroup resource and memory limits to my browser.

I want to apply a MemoryMax and CPUShare to all app-gnome-firefox-*.scope instances per systemd.resource-control.

But GNOME isn't launching firefox with the instantiated unit format app-gnome-firefox-@.scope so I don't know how to make a systemd unit file that will apply automatically to all app-gnome-firefox-*.scope instances.

I can manually apply the resource limits to an instance with systemctl set-property --user app-gnome-firefox-92450.scope (for example) once the unit starts, but that's a pain.

Is there any way to inject properties for transient scopes with pattern matching for names?

This isn't really gnome-shell specific; it applies just as well to a user terminal session that invokes a command with systemd-run --user --scope.
Details

Firefox is definitely launched under a systemd scope, and it gets its own cgroup:
$ systemctl --user status app-gnome-firefox-92450.scope
● app-gnome-firefox-92450.scope - Application launched by gnome-shell
     Loaded: loaded (/run/user/1000/systemd/transient/app-gnome-firefox-92450.scope; transient)
  Transient: yes
     Active: active (running) since Wed 2021-03-31 09:44:30 AWST; 32min ago
      Tasks: 567 (limit: 38071)
     Memory: 2.1G
        CPU: 5min 39.138s
     CGroup: /user.slice/user-1000.slice/user@1000.service/app-gnome-firefox-92450.scope
             ├─92450 /usr/lib64/firefox/firefox
             ....
  ....

Verified by
$ systemd-cgls --user-unit app-gnome-firefox-92450.scope
Unit app-gnome-firefox-92450.scope (/user.slice/user-1000.slice/user@1000.service/app-gnome-firefox-92450.scope):
├─92450 /usr/lib64/firefox/firefox
...

and
$ ls -d /sys/fs/cgroup/user.slice/user-1000.slice/user@1000.service/app-gnome-firefox-*
/sys/fs/cgroup/user.slice/user-1000.slice/user@1000.service/app-gnome-firefox-92450.scope

I can apply a MemoryMax (cgroup v2 constraint memory.max) to an already-running instance with systemctl set-property and it takes effect:
$ systemctl set-property --user app-gnome-firefox-98883.scope MemoryMax=5G
$ systemctl show --user app-gnome-firefox-98883.scope |grep ^MemoryMax
MemoryMax=5368709120
$ cat /sys/fs/cgroup/user.slice/user-1000.slice/user@1000.service/app-gnome-firefox-*/memory.max
5368709120

It definitely takes effect - setting a low MemoryMax like 100M causes the firefox scope to OOM, as seen in journalctl --user -u app-gnome-firefox-98883.scope.

The trouble is that I can't work out how to apply systemd.resource-control rules automatically for new instances of the app automatically.

I've tried creating a .config/systemd/user/app-gnome-firefox-@.scope containing
[Scope]
MemoryMax = 5G

but it appears to have no effect.

systemd-analyze verify chokes on it rather unhelpfully:
$ systemd-analyze  verify --user .config/systemd/user/app-gnome-firefox-@.scope 
Failed to load unit file /home/craig/.config/systemd/user/app-gnome-firefox-@i.scope: Invalid argument

If I use systemctl set-property --user app-gnome-firefox-92450.scope on a running instance and systemctl --user show app-gnome-firefox-92450.scope I see the drop-in files at:
FragmentPath=/run/user/1000/systemd/transient/app-gnome-firefox-98883.scope
DropInPaths=/run/user/1000/systemd/transient/app-gnome-firefox-98883.scope.d/50-MemoryMax.conf

It has Names containing the pid, so that can't be matched easily:
Id=app-gnome-firefox-98883.scope
Names=app-gnome-firefox-98883.scope

and I'm kind of stumped. Advice would be greatly appreciated, hopefully not "gnome-shell is doing it wrong, patch it" advice.  Some draft systemd docs suggest it's using one of the accepted patterns.
Workaround 1 - systemd-run

The only workaround I see so far is to launch the firefox instance with systemd-run myself:
systemd-run --user --scope -u firefox.scope -p 'MemoryMax=5G' -p 'CPUQuota=80%' /usr/lib64/firefox/firefox

and let that be the control process. But it looks like this isolates the firefox control channel in some manner that prevents firefox processes launched by other apps or the desktop session from then talking to the cgroup-scoped firefox, resulting in

Firefox is already running, but is not responding. To use Firefox, you must first close the existing Firefox process, restart your device, or use a different profile.

Edit: firefox remoting when launched manually via systemd-run is fixed by setting MOZ_DBUS_REMOTE in the environment both for my user session and as a -E MOZ_DBUS_REMOTE=1 option to systemd-run. It's probably because I'm using Wayland. A colleague reported that using XOrg and an older system it only worked for them without MOZ_DBUS_REMOTE=1.
Workaround 2 - as a user service

I landed up defining a systemd service for firefox instead.
$ systemctl --user edit --full --force firefox.service

[Unit]
Description=Run Firefox

[Service]
ExecStart=/usr/lib64/firefox/firefox
Environment=MOZ_DBUS_REMOTE=1
MemoryMax = 5G
CPUQuota=400%

[Install]
WantedBy=gnome-session-initialized.target

systemctl --user  enable firefox.service

This starts firefox on login with the desired cgroups configured etc. New firefox commands will open tabs in the autostarted instance. I guess that'll do for now.
Better options?

Still a clumsy workaround - it should surely be possible to apply resource control rules to slices via .config/systemd/user ?

## 自动提取的痛点信号

- 命中关键词: \bis there (a|an|any) (tool|app|way)\b, \bworkaround\b
- 互动度: 29
- 作者: u/Craig Ringer

<!-- 处理: 调度员 → 5 阶段 pipeline -->
