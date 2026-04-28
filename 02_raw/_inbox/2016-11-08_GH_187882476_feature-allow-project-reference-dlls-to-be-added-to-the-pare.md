---
date: 2016-11-08
source: gh
source_detail: "gh post 187882476 by u/joelverhagen"
url: "https://github.com/NuGet/Home/issues/3891"
topic: "Feature : Allow project reference DLLs to be added to the parent nupkg for pack target like IncludeReferencedProjects in"
author: joelverhagen
engagement: 807
created_utc: 2016-11-08T02:03:37Z
pain_keywords: ["\\bworkaround\\b"]
confidence: medium
status: raw
raw_intake_version: plan_b_v1
---

# Feature : Allow project reference DLLs to be added to the parent nupkg for pack target like IncludeReferencedProjects in nuget.exe

> **Source**: https://github.com/NuGet/Home/issues/3891

## 原始内容

## Steps

1. `dotnet new --type lib` two .csproj class libraries: projectA and projectB.
1. Change `` to `` if you don't have https://github.com/NuGet/Home/issues/3865.
1. Make projectA have a `ProjectReference` to projectB.
1. Add `project` to the ``.
1. `dotnet pack` projectA
1. Open the resulting .nupkg's lib folder

## Expected

projectB.dll should be in the .nupkg along with projectA.dll

## Actual

projectB is still a package reference, not a DLL included in the package.

## Environment

Tried latest dev's pack target.

`dotnet --info`
```
.NET Command Line Tools (1.0.0-preview3-004056)

Product Information:
 Version:            1.0.0-preview3-004056
 Commit SHA-1 hash:  ccc4968bc3

Runtime Environment:
 OS Name:     Windows
 OS Version:  10.0.14393
 OS Platform: Windows
 RID:         win10-x64
```

**UPDATE: Please see workaround posted as [comment](https://github.com/nuget/home/issues/3891#issuecomment-377319939 ) to see how to add ProjectReferences as DLLs in the package dynamically.**

## 自动提取的痛点信号

- 命中关键词: \bworkaround\b
- 互动度: 807
- 作者: u/joelverhagen

<!-- 处理: 调度员 → 5 阶段 pipeline -->
