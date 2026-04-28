---
date: 2025-01-07
source: gh
source_detail: "gh post 2773385110 by u/acassioaraujo"
url: "https://github.com/docker/for-mac/issues/7520"
topic: "[Workaround in description] Mac is detecting Docker as a malware and keeping it from starting"
author: acassioaraujo
engagement: 2762
created_utc: 2025-01-07T17:29:57Z
pain_keywords: ["\\btried .{1,40}? but\\b", "\\bworkaround\\b"]
confidence: medium
status: raw
raw_intake_version: plan_b_v1
---

# [Workaround in description] Mac is detecting Docker as a malware and keeping it from starting

> **Source**: https://github.com/docker/for-mac/issues/7520

## 原始内容

### Description

Whenever Docker is started, this error is shown:

> Malware Blocked. “com.docker.socket” was not opened because it contains malware. this action did not harm your Mac.

### Reproduce

1. Start Docker
2. See the error

### Workaround 

> [!TIP]  
> If you face this issue, try the following procedure:
>
> 1. Quit Docker Desktop and check that no remaining docker processes are running using the Activity Monitor
> 2. Run the following commands:
> 
> ```bash
> #!/bin/bash
>
> # Stop the docker services
> echo "Stopping Docker..."
> sudo pkill '[dD]ocker'
>
> # Stop the vmnetd service
> echo "Stopping com.docker.vmnetd service..."
> sudo launchctl bootout system /Library/LaunchDaemons/com.docker.vmnetd.plist
>
> # Stop the socket service
> echo "Stopping com.docker.socket service..."
> sudo launchctl bootout system /Library/LaunchDaemons/com.docker.socket.plist
>
> # Remove vmnetd binary
> echo "Removing com.docker.vmnetd binary..."
> sudo rm -f /Library/PrivilegedHelperTools/com.docker.vmnetd
>
> # Remove socket binary
> echo "Removing com.docker.socket binary..."
> sudo rm -f /Library/PrivilegedHelperTools/com.docker.socket
>
> # Install new binaries
> echo "Install new binaries..."
> sudo cp /Applications/Docker.app/Contents/Library/LaunchServices/com.docker.vmnetd /Library/PrivilegedHelperTools/
> sudo cp /Applications/Docker.app/Contents/MacOS/com.docker.socket /Library/PrivilegedHelperTools/
> ```
>
> 3. Restart Docker Desktop.
> 
> If that still doesn't work, download one of the currently supported release from the [Release notes](https://docs.docker.com/desktop/release-notes/) and re-apply step 2.

As suggested [running this command](https://github.com/docker/for-mac/issues/7520#issuecomment-2578291149) is working for most of people that had this problem.

  Original issue details
### docker version

```bash
Client:
 Version:           26.1.4
 API version:       1.45
 Go version:        go1.21.11
 Git commit:        5650f9b
 Built:             Wed Jun  5 11:26:02 2024
 OS/Arch:           darwin/arm64
 Context:           desktop-linux
Cannot connect to the Docker daemon at unix:///Users/admin/.docker/run/docker.sock. Is the docker daemon running?

(Can't get docker started to check more details)

----
Asked for a friend running Docker in the same version and this is the output:

Client:
 Version:           27.0.3
 API version:       1.46
 Go version:        go1.21.11
 Git commit:        7d4bcd8
 Built:             Fri Jun 28 23:59:41 2024
 OS/Arch:           darwin/arm64
 Context:           desktop-linux

Server: Docker Desktop 4.32.0 (157355)
 Engine:
  Version:          27.0.3
  API version:      1.46 (minimum version 1.24)
  Go version:       go1.21.11
  Git commit:       662f78c
  Built:            Sat Jun 29 00:02:44 2024
  OS/Arch:          linux/arm64
  Experimental:     false
 containerd:
  Version:          1.7.18
  GitCommit:        ae71819c4f5e67bb4d5ae76a6b735f29cc25774e
 runc:
  Version:          1.7.18
  GitCommit:        v1.1.13-0-g58aa920
 docker-init:
  Version:          0.19.0
  GitCommit:        de40ad0
```

### docker info

```bash
lient:
 Version:    27.0.3
 Context:    desktop-linux
 Debug Mode: false
 Plugins:
  buildx: Docker Buildx (Docker Inc.)
    Version:  v0.15.1-desktop.1
    Path:     /Users/lorenzo/.docker/cli-plugins/docker-buildx
  compose: Docker Compose (Docker Inc.)
    Version:  v2.28.1-desktop.1
    Path:     /Users/lorenzo/.docker/cli-plugins/docker-compose
  debug: Get a shell into any image or container (Docker Inc.)
    Version:  0.0.32
    Path:     /Users/lorenzo/.docker/cli-plugins/docker-debug
  desktop: Docker Desktop commands (Alpha) (Docker Inc.)
    Version:  v0.0.14
    Path:     /Users/lorenzo/.docker/cli-plugins/docker-desktop
  dev: Docker Dev Environments (Docker Inc.)
    Version:  v0.1.2
    Path:     /Users/lorenzo/.docker/cli-plugins/docker-dev
  extension: Manages Docker extensions (Docker Inc.)
    Version:  v0.2.25
    Path:     /Users/lorenzo/.docker/cli-plugins/docker-extension
  feedback: Provide feedback, right in your terminal! (Docker Inc.)
    Version:  v1.0.5
    Path:     /Users/lorenzo/.docker/cli-plugins/docker-feedback
  init: Creates Docker-related starter files for your project (Docker Inc.)
    Version:  v1.3.0
    Path:     /Users/lorenzo/.docker/cli-plugins/docker-init
  sbom: View the packaged-based Software Bill Of Materials (SBOM) for an image (Anchore Inc.)
    Version:  0.6.0
    Path:     /Users/lorenzo/.docker/cli-plugins/docker-sbom
  scout: Docker Scout (Docker Inc.)
    Version:  v1.10.0
    Path:     /Users/lorenzo/.docker/cli-plugins/docker-scout

Server:
 Containers: 10
  Running: 9
  Paused: 0
  Stopped: 1
 Images: 41
 Server Version: 27.0.3
 Storage Driver: overlay2
  Backing Filesystem: extfs
  Supports d_type: true
  Using metacopy: false
  Native Overlay Diff: true
  userxattr: false
 Logging Driver: json-file
 Cgroup Driver: cgroupfs
 Cgroup Version: 2
 Plugins:
  Volume: local
  Network: bridge host ipvlan macvlan null overlay
  Log: awslogs fluentd gcplogs gelf journald json-file local splunk syslog
 Swarm: inactive
 Runtimes: io.containerd.runc.v2 runc
 Default Runtime: runc
 Init Binary: docker-init
 containerd version: ae71819c4f5e67bb4d5ae76a6b735f29cc25774e
 runc version: v1.1.13-0-g58aa920
 init version: de40ad0
 Security Options:
  seccomp
   Profile: unconfined
  cgroupns
 Kernel Version: 6.6.32-linuxkit
 Operating System: Docker Desktop
 OSType: linux
 Architecture: aarch64
 CPUs: 12
 Total Memory: 7.657GiB
 Name: docker-desktop
 ID: 1e75072f-7d8f-47c3-917a-43dc08d31755
 Docker Root Dir: /var/lib/docker
 Debug Mode: false
 HTTP Proxy: http.docker.internal:3128
 HTTPS Proxy: http.docker.internal:3128
 No Proxy: hubproxy.docker.internal
 Labels:
  com.docker.desktop.address=unix:///Users/lorenzo/Library/Containers/com.docker.docker/Data/docker-cli.sock
 Experimental: false
 Insecure Registries:
  hubproxy.docker.internal:5555
  127.0.0.0/8
 Live Restore Enabled: false
```

### Diagnostics ID

Can't get a Diagnostics ID because I'm not able to open docker, the error is from MacOS

### Additional Info

I tried installing older versions of Docker but the error is the same to all of them.

## 自动提取的痛点信号

- 命中关键词: \btried .{1,40}? but\b, \bworkaround\b
- 互动度: 2762
- 作者: u/acassioaraujo

<!-- 处理: 调度员 → 5 阶段 pipeline -->
