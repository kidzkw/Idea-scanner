---
file_type: master_authority_index
version: v2.0
created: 2026-04-27 (post-Tier-2 consolidation)
purpose: "00_rules/ active 文档权威索引. Tier 2 合并后 12→9 files."
maintainer: 总监 + 用户
---

# 00_rules Authority Index v2.0

## §1 Active Rules (9 files) — 4 Layer

### Layer A — 顶层架构 (How AI agents work together)
| File | Version | Purpose |
|---|---|---|
| `AI_AGENT_ISOLATION_ARCHITECTURE_v1.0.md` | v1.0 | 5-AI sandbox 架构权威 (claude/chatgpt/grok/gemini/deepseek 独立 chrome MCP + folder) |
| `MCP_SERVER_CONFIG_TO_ADD.md` | v1.0 | 用户加 5 chrome-devtools MCP server entries 操作清单 |
| `SYNTHESIS_SOP_v1.0.md` | v1.0 | 研究员 synthesis 8-step (5 sandbox → canonical SSOT 单点 merge) |
| `ROUTING_PROTOCOL_v1.md` | v1.0 | 总监 plans, main Claude dispatches; 建议 → 战略队列 |

### Layer B — Workflow + Enforcement + Step Contracts (consolidated)
| File | Version | Purpose | Replaces (archived) |
|---|---|---|---|
| **`DD_AUTHORITY_v3.2.md`** | v3.2 | Workflow 6-stage + Gates A/B/C + 11 Step Contracts + R1a-d Resilience + Forbidden + Warmup | DD_WORKFLOW_v2 (v3.1) + STEP_CONTRACTS_v1 (v1.1) + DD_ENFORCEMENT_v1 (v1.1) |

### Layer C — Agent Behavior + Output Schema (consolidated)
| File | Version | Purpose | Replaces (archived) |
|---|---|---|---|
| **`AGENT_OUTPUT_AUTHORITY_v2.0.md`** | v2.0 | Part A: Agent prompt §0-§10. Part B: SSOT v2.0 §1-§9 schema. Part C: 7-dim scoring + audit + sandbox JSON | AGENT_PROMPT_TEMPLATE_v1 (v1.4) + RESEARCH_BRIEF_v2.0 (v2.0) |
| `VERIFICATION_TOKENS_v1.md` | v1.1 | verified_quad enum + Source Weight + Integrity Modifier |
| `FILENAME_FORMAT_v1.md` | v1.0 | raw 文件 frontmatter + 命名规范 |

### Layer D — User-defined trading rules
| File | Version | Purpose |
|---|---|---|
| `trading_rules_*.md` | per file | 用户自定义 §七 stop-loss / §六 timing |

### Layer E — 索引/导航
| File | Purpose |
|---|---|
| `_AUTHORITY_INDEX.md` (本文件) | 权威索引 |
| `README.md` | 简介 + 快速导航 |

---

## §2 引用关系 (依赖图)

```
DD_AUTHORITY_v3.2 (workflow + enforcement + step contracts)
   ├── §1 raw lifecycle → FILENAME_FORMAT_v1
   ├── §3 scorecard → AGENT_OUTPUT_AUTHORITY_v2.0 §A.4 + §C.1
   ├── §4 source weight ladder → VERIFICATION_TOKENS_v1
   ├── §5 VERBATIM 4-way → AI_AGENT_ISOLATION_ARCHITECTURE_v1.0 §1
   └── §7 Gates A+B+C → AGENT_OUTPUT_AUTHORITY_v2.0 §A.9 receipt schema

AGENT_OUTPUT_AUTHORITY_v2.0 (prompt + output schema)
   ├── §A.1 workflow → DD_AUTHORITY_v3.2 §1
   ├── §A.6 VERBATIM → DD_AUTHORITY_v3.2 §5
   ├── §A.9 enforcement → DD_AUTHORITY_v3.2 §7
   ├── §A.10 sandbox isolation → AI_AGENT_ISOLATION_ARCHITECTURE_v1.0
   ├── §B.* → SSOT v2.0 schema (Research Brief)
   └── §C.3 sandbox JSON → _AI_PROJECTS/_shared/OUTPUT_SCHEMA.md

AI_AGENT_ISOLATION_ARCHITECTURE_v1.0
   ├── MCP_SERVER_CONFIG_TO_ADD (用户操作清单)
   ├── SYNTHESIS_SOP_v1.0 (synthesis 流程)
   ├── _AI_PROJECTS/_shared/SANDBOX_CONTRACT.md
   ├── _AI_PROJECTS/_shared/OUTPUT_SCHEMA.md
   └── _AI_PROJECTS/_shared/SANDBOX_RULES.md (5 source 规则 + quarantine)

ROUTING_PROTOCOL_v1
   ├── 用户消息 → 总监 plan-out
   └── 建议 → _AUDITS/_总监_战略建议队列.md
```

---

## §3 Archived (00_rules/_archive/ — 8 files, 不再 active)

合并 / 替换:
- `AI_AGENT_ISOLATION_ARCHITECTURE_v0.1.md` (planning draft → v1.0)
- `GOOGLE_AI_INTEGRATION_v1.md` (DEPRECATED, content promoted into DD_AUTHORITY)
- `ROUND_10_kickoff_2026-04-23.md` (历史 kickoff)
- `DD_WORKFLOW_v2.md` (v3.1 → DD_AUTHORITY_v3.2 Part 1)
- `STEP_CONTRACTS_v1.md` (v1.1 → DD_AUTHORITY_v3.2 Part 3)
- `DD_ENFORCEMENT_v1.md` (v1.1 → DD_AUTHORITY_v3.2 Part 2)
- `AGENT_PROMPT_TEMPLATE_v1.md` (v1.4 → AGENT_OUTPUT_AUTHORITY_v2.0 Part A)
- `RESEARCH_BRIEF_v2.0.md` (v2.0 → AGENT_OUTPUT_AUTHORITY_v2.0 Part B + C)

如需历史参考: `00_rules/_archive/`. **不许引用为 active rule**.

---

## §4 维护规则

- **新加 rule**: 必按 §1 4 layer 归位 + 更新 §2 引用图
- **升级 rule**: bump version + last_updated, 旧版 archive 到 `_archive/`
- **合并 rule**: 用 ESCALATION P0 流程, 经 总监 + 用户共同 approve
- **冲突仲裁**: Layer A > Layer B > Layer C > Layer D (越上层越权威)
- **bumping consolidated rules**: DD_AUTHORITY 或 AGENT_OUTPUT_AUTHORITY 各自独立版本号
