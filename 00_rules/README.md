# 00_rules — 权威规则

本目录下文件是 Claude / sub-agents 每次对话必读的硬约束.

完整索引 + 引用关系 → **`_AUTHORITY_INDEX.md`** (master index)

## 9 active rules (4 layer)

| Layer | File | Version | 一句话 |
|---|---|---|---|
| A 架构 | `AI_AGENT_ISOLATION_ARCHITECTURE_v1.0.md` | v1.0 | 5-AI sandbox + dedicated chrome MCP per source |
| A 操作 | `MCP_SERVER_CONFIG_TO_ADD.md` | v1.0 | 用户加 5 chrome-devtools MCP server entries 指南 |
| A 流程 | `SYNTHESIS_SOP_v1.0.md` | v1.0 | 研究员 8-step synthesis (5 sandbox → canonical 单点) |
| A 路由 | `ROUTING_PROTOCOL_v1.md` | v1.0 | 总监 plan-out, main Claude dispatch |
| **B 核心** | **`DD_AUTHORITY_v3.2.md`** | **v3.2** | **Workflow 6-stage + Gates A/B/C + 11 Step Contracts + Resilience + Forbidden + Warmup (consolidated)** |
| **C 核心** | **`AGENT_OUTPUT_AUTHORITY_v2.0.md`** | **v2.0** | **Agent prompt §0-§10 + SSOT §1-§9 schema + 7-dim scoring + sandbox JSON (consolidated)** |
| C 验证 | `VERIFICATION_TOKENS_v1.md` | v1.1 | verified_quad + Source Weight + Integrity Modifier |
| C 文件 | `FILENAME_FORMAT_v1.md` | v1.0 | raw 文件 frontmatter + 命名规范 |
| D 用户 | `trading_rules_*.md` | per file | 用户自定义 §七 stop-loss 等 |

冲突仲裁: Layer A > B > C > D.

## 已归档 (`_archive/`, 8 files)

Tier 2 consolidation (2026-04-27):
- DD_WORKFLOW_v2 (v3.1) + STEP_CONTRACTS_v1 (v1.1) + DD_ENFORCEMENT_v1 (v1.1) → **DD_AUTHORITY_v3.2.md**
- AGENT_PROMPT_TEMPLATE_v1 (v1.4) + RESEARCH_BRIEF_v2.0 (v2.0) → **AGENT_OUTPUT_AUTHORITY_v2.0.md**

Tier 1 archived earlier:
- AI_AGENT_ISOLATION_ARCHITECTURE_v0.1.md (superseded by v1.0)
- GOOGLE_AI_INTEGRATION_v1.md (DEPRECATED)
- ROUND_10_kickoff_2026-04-23.md (历史 kickoff)

## 命名约定
- 主版本变更: bump version (v1.x → v2.0)
- 用户 trading rules: `trading_rules_YYYY-MM-DD.md`
- 归档: 移到 `_archive/` 不删
