---
title: Routing Protocol — Plan-out Mode
version: v1.0
created: 2026-04-26
authority: DD_WORKFLOW_v2.md v3.1 §18 + arch task 2026-04-26
---

# Routing Protocol (Plan-out Mode)

## Root Cause

Claude Code harness does not expose the Agent tool schema to sub-agents. Any Agent tool call inside a spawned sub-agent context is dead code — the call silently fails or is blocked. This means VP-level and 总监-level agents cannot physically dispatch workers themselves.

**Confirmed**: 总监, 研究主管, 流水主管, 合规主管 — all 4 manager agents had `Agent` in their `tools:` frontmatter and `Agent(subagent_type=..., prompt=...)` dispatch code. That code was non-functional.

## Fix: main Claude is the sole physical dispatcher

```
main Claude
  │
  ├── spawns 总监 (with user request)
  │     └── 总监 outputs dispatch_plan JSON
  │
  ├── reads dispatch_plan JSON
  ├── spawns VPs in parallel (dep-free) or serial (deps present)
  │     └── each VP outputs worker_plan JSON
  │
  ├── reads worker_plan JSON
  ├── spawns workers in parallel (dep-free) or serial (deps present)
  │     └── workers return results
  │
  ├── feeds worker results back to VP → VP synthesizes dept-level report
  └── feeds VP reports back to 总监 → 总监 synthesizes cross-dept report (≤400 words to user)
```

## Dispatch Plan JSON (总监 → main Claude)

```json
{
  "dispatch_plan": [
    {
      "target_agent": "<VP name>",
      "task_id": "<session_tag>_<seq>",
      "prompt": "<full VP prompt including context, scope, guardrails, expected handoff format>",
      "deps": [],
      "deadline": "<ISO timestamp or null>"
    }
  ],
  "parallel": true,
  "synthesis_pending": true,
  "notes": "<optional routing rationale>"
}
```

## Worker Plan JSON (VP → main Claude)

```json
{
  "worker_plan": [
    {
      "target_agent": "<worker name>",
      "task_id": "<parent_task_id>_w<seq>",
      "prompt": "<full worker prompt>",
      "deps": ["<prior task_id if serial, else omit>"],
      "deadline": null
    }
  ],
  "parallel": true,
  "synthesis_pending": true
}
```

## Execution Rules for main Claude

1. **Parse deps**: tasks with empty `deps` may be spawned simultaneously (one `<function_calls>` block with multiple Agent calls). Tasks with `deps` must wait for all listed `task_id` results before spawning.

2. **Synthesis loop**: after workers complete, call the originating VP agent again with all worker results appended. The VP then outputs its dept-level synthesis report (no further Agent spawning needed at that point).

3. **Cross-dept synthesis**: after all VPs return synthesis reports, call 总监 with all VP reports. 总监 outputs the final ≤400-word user-facing report.

4. **No skip**: main Claude must not shortcut this chain even for trivial requests. Only Tier-1 trivial reads (single Read/Glob/Grep for routing decision) are exempt.

## Affected Files (v3.4 changes)

| File | Change |
|------|--------|
| `.claude/agents/总监.md` | Removed `Agent` from tools; replaced Agent dispatch code with dispatch_plan JSON schema; bumped to v3.4 |
| `.claude/agents/研究主管.md` | Removed `Agent` from tools; replaced Agent dispatch code with worker_plan JSON schema |
| `.claude/agents/流水主管.md` | Removed `Agent` from tools; replaced pipeline Agent calls with worker_plan JSON + deps chaining |
| `.claude/agents/合规主管.md` | Removed `Agent` from tools; replaced Agent dispatch code with worker_plan JSON schema |
| `00_rules/ROUTING_PROTOCOL_v1.md` | This file — canonical reference for Plan-out Mode |

## Unchanged

- All 23 worker agents: no dispatch responsibilities, no `Agent` tool needed, frontmatter untouched.
- `架构主管.md`: managed separately; follow same Plan-out Mode convention if it currently has `Agent` in tools.
- All `_AUDITS/`, `_PENDING_TODO.md`, `_ACTIVE_WORK.md` files: schema unchanged.
