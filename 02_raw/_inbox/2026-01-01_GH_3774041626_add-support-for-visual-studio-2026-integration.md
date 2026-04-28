---
date: 2026-01-01
source: gh
source_detail: "gh post 3774041626 by u/ovftank"
url: "https://github.com/anthropics/claude-code/issues/15942"
topic: "Add support for Visual Studio 2026 Integration"
author: ovftank
engagement: 350
created_utc: 2026-01-01T02:42:34Z
pain_keywords: ["\\bworkaround\\b"]
confidence: medium
status: raw
raw_intake_version: plan_b_v1
---

# Add support for Visual Studio 2026 Integration

> **Source**: https://github.com/anthropics/claude-code/issues/15942

## 原始内容

### Preflight Checklist

- [x] I have searched [existing requests](https://github.com/anthropics/claude-code/issues?q=is%3Aissue%20label%3Aenhancement) and this feature hasn't been requested yet
- [x] This is a single feature request (not multiple features)

### Problem Statement

I rely on **Visual Studio 2026** for C++ and Win32 system-level development (e.g., global hooks, drivers) because its debugger and toolchain are superior to VS Code/JetBrains for this specific stack.

Currently, `claude-code` only offers native plugins for VS Code and JetBrains. To use Claude Code with Visual Studio 2026, I am forced to run it in a detached terminal window. This creates significant friction:

1. **No Integrated Diff:** I have to review complex code changes in the terminal text stream instead of Visual Studio's native Diff/Merge GUI.
2. **No Context Awareness:** Claude cannot automatically see my open files, selected code, or compiler diagnostics (error list). I have to manually copy-paste errors or file contents.
3. **Context Switching:** Constant Alt-Tab between the IDE and the terminal breaks flow.

### Proposed Solution

Create a native VSIX extension for Visual Studio 2026 that provides feature parity with the existing VS Code extension:

1. **Integrated Chat Panel:** A dockable tool window within VS 2026.
2. **Native Diff Viewing:** When Claude proposes changes, show them using Visual Studio's native Diff window for review/accept/reject.
3. **Context Synchronization:** Automatically share active file content, cursor selection, and build errors/warnings with the agent.
4. **`/ide` Command Support:** Allow terminal sessions to link to the active VS instance.

### Alternative Solutions

* **Current Workaround:** Running `claude` CLI in an external terminal (Windows Terminal) or the VS Integrated Terminal. This is suboptimal due to the lack of GUI diffs and auto-context.
* **Switching IDEs:** Trying to move the C++ project to VS Code just for Claude support, but this sacrifices the advanced debugging capabilities of Visual Studio 2026 required for Win32 development.

### Priority

High - Significant impact on productivity

### Feature Category

Other

### Use Case Example

**Scenario: Debugging a Win32 Keyboard Hook**

1. I am debugging a `SetWindowsHookEx` crash in `hook.cpp` inside Visual Studio 2026.
2. I hit a breakpoint where a variable `pKey` is null.
3. **Ideally:** I open the Claude Code panel *inside* VS, select the crashing function, and ask: "Why is pKey null here?".
4. Claude analyzes the selected code and the current file context automatically.
5. Claude proposes a fix (adding a null check).
6. I click "Review", and VS opens its native Diff window showing the change.
7. I click "Accept", and the code is updated without me ever leaving the IDE.

### Additional Context

Visual Studio remains the de-facto standard for Windows native development. Ignoring it excludes a large portion of systems engineers and C++ game developers.

## 自动提取的痛点信号

- 命中关键词: \bworkaround\b
- 互动度: 350
- 作者: u/ovftank

<!-- 处理: 调度员 → 5 阶段 pipeline -->
