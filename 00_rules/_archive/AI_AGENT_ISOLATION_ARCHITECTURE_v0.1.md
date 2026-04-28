---
file_type: architecture_plan
version: v0.1 (planning draft)
created: 2026-04-27
authority: 总监 + 用户共同 own 战略；架构主管 own 工程实施
purpose: "Per-AI Sandbox Architecture — 每个 AI agent (Claude/ChatGPT/Grok/Gemini) 独立 chrome MCP + 独立 project folder, 防 fabrication cross-contamination + 干净 audit 归因"
trigger: "FABRICATION_LOG 累计 Gemini 6 + Claude 1 = 7 events 横跨 §1/§3/§7/§8/§verbatim. 用户 2026-04-27 决议: 'AI agent 单独 MCP chrome + 单独 project folder'"
status: PLANNING — 待用户决策开放问题后转入工程实施
---

# AI Agent Per-Source Isolation Architecture v0.1

## §1 战略目标

### 1.1 解决的问题
当前架构 (post-batch3, 2026-04-26):
- **单一 chrome MCP 实例** 跨 4 AI 共享 → race condition (已串行 mitigate, 但仍有 cross-AI tab state 交叉风险)
- **单一 workspace** `D:\Claude\AI_Semi_Research\` → 所有 agent 直接读写 SSOT, fabrication 直接污染 canonical 数据
- **无 AI-source level 隔离** → Gemini 6 次 fabrication 中有 4 次直接写入 SSOT 后被 测谎员 catch (滞后型修正)
- **无 quarantine 机制** → Gemini "active refutation" 失败模式可主动覆盖正确 consensus

### 1.2 升级目标
1. **anti-contamination**: AI fabrication 必须 quarantine 在该 AI 自身 project, 不直接进 canonical SSOT
2. **clean attribution**: per-AI fabrication rate 可精确测算, 故障模式可独立追踪
3. **independent freshness**: 每 AI 独立 chrome profile / 独立 remote-debug-port / 独立 cookies / 独立 rate-limit budget
4. **scalability**: 新增 AI 源 (Perplexity / DeepSeek / Mistral) = 新 project folder + 新 chrome 实例, 不重写 pipeline
5. **synthesis 单点**: phase 2 研究员 是 ONLY merge 点, 4 sandbox → 1 canonical SSOT

---

## §2 架构总览

### 2.1 文件夹结构 (新增)

```
D:\Claude\AI_Semi_Research\
├── 03_tickers\                    ← canonical SSOT (仅 synthesis 写)
├── _AUDITS\                        ← 共享 audit (含 FABRICATION_LOG, 战略队列)
├── 00_rules\                       ← 共享 rules
├── 02_raw\                         ← 共享 raw lifecycle
├── 04_daily_log\                   ← 共享日志
├── 05_triggers\                    ← 共享 catalyst calendar
└── _AI_PROJECTS\                   ← 🆕 per-AI sandbox 根目录
    ├── claude_research\            ← Claude (无 chrome, web 路径)
    │   ├── _outputs\               ← per-ticker JSON
    │   │   └── 2026-04-27\
    │   │       └── NVDA.json
    │   ├── _raw_fetches\           ← WebFetch 缓存 (URL → HTML snapshot)
    │   ├── _quarantine\            ← 待审 finding (synthesis 前 hold)
    │   ├── README.md               ← Claude-specific 规则
    │   └── _lock_active.txt        ← 当前会话 lock
    ├── chatgpt_research\           ← ChatGPT (chrome :9223)
    │   ├── _outputs\
    │   ├── _conversations\         ← 每 chat URL 对应一份 snapshot
    │   ├── _quarantine\
    │   ├── chrome_profile\         ← 独立 user-data-dir
    │   ├── chrome_launch.ps1       ← 启动脚本
    │   ├── README.md
    │   └── _lock_active.txt
    ├── grok_research\              ← Grok (chrome :9224)
    │   ├── _outputs\
    │   ├── _conversations\
    │   ├── _quarantine\
    │   ├── chrome_profile\
    │   ├── chrome_launch.ps1
    │   ├── README.md
    │   ├── _ratelimit_state.json   ← Grok 特别: rate limit cooldown 状态
    │   └── _lock_active.txt
    └── gemini_research\            ← Gemini (chrome :9225, **强制 quarantine**)
        ├── _outputs\               ← 默认 quarantine_pending
        ├── _conversations\
        ├── _quarantine\            ← 主存放区
        ├── chrome_profile\
        ├── chrome_launch.ps1
        ├── README.md
        ├── _quarantine_rules.md    ← Gemini 6 fabrication 累计后的强制规则
        └── _lock_active.txt
```

### 2.2 Chrome 实例分配

| AI | Chrome instance | port | profile dir | 备注 |
|---|---|---|---|---|
| Claude | none | n/a | n/a | 走 WebSearch + WebFetch native |
| ChatGPT | dedicated | 9223 | `_AI_PROJECTS\chatgpt_research\chrome_profile\` | chatgpt.com 唯一允许域 |
| Grok | dedicated | 9224 | `_AI_PROJECTS\grok_research\chrome_profile\` | grok.com / x.com/i/grok 允许 |
| Gemini | dedicated | 9225 | `_AI_PROJECTS\gemini_research\chrome_profile\` | gemini.google.com 唯一; **禁 Deep Research** |

启动脚本模板 (chatgpt 示例):
```powershell
# _AI_PROJECTS\chatgpt_research\chrome_launch.ps1
$profileDir = "D:\Claude\AI_Semi_Research\_AI_PROJECTS\chatgpt_research\chrome_profile"
$port = 9223
& "C:\Program Files\Google\Chrome\Application\chrome.exe" `
  --user-data-dir="$profileDir" `
  --remote-debugging-port=$port `
  --window-name="ChatGPT_Research_Sandbox" `
  https://chatgpt.com
```

### 2.3 chrome MCP 调用规范

每个 AI subagent prompt 必带:
```yaml
mcp_target:
  port: 9223  # 或 9224/9225
  allowed_domains: [chatgpt.com]  # 域白名单
  isolated_context: "ChatGPT_NVDA_2026-04-27_<uuid>"
  freshness_gate: ≤10 messages
  forbidden_modes: []  # gemini 加 ["deep_research"]
```

---

## §3 Workflow 变化

### 3.1 当前 (post-batch3)
```
main Claude → spawn 4 agents → 4 agents 直接读写 03_tickers/ + _AUDITS/RBv2_pilot/
                                ↓
                         共享 chrome MCP race
                         共享 SSOT 污染风险
```

### 3.2 新架构
```
main Claude → spawn 4 agents (each scoped to own project)
                ↓
  Claude → _AI_PROJECTS/claude_research/_outputs/<date>/<ticker>.json
  ChatGPT → _AI_PROJECTS/chatgpt_research/_outputs/<date>/<ticker>.json (chrome :9223)
  Grok → _AI_PROJECTS/grok_research/_outputs/<date>/<ticker>.json (chrome :9224)
  Gemini → _AI_PROJECTS/gemini_research/_quarantine/<date>/<ticker>.json (chrome :9225)
                ↓
  研究员 (synthesis, ONLY merge 点)
    ├── reads 4 project folders
    ├── 测谎员 inline check (Gemini 强制 raw_quote 支撑性 + freshness ≤24h gate)
    ├── 失败 finding → 留在 quarantine, 不进 SSOT
    └── 写 03_tickers/<TICKER>.md v2.0 + _AUDITS/RBv2_pilot/_consensus_matrix.md
                ↓
  测谎员 (final sample=1.0 audit on canonical SSOT)
                ↓
  邮件 / 总监 战略综合
```

---

## §4 Per-AI Project 规范

### 4.1 Claude_research
- **无 chrome dependency**, 走 WebSearch + WebFetch
- **角色**: primary anchor source (SEC EDGAR / IR primary fetch)
- **新规则**: 不许 cite `03_tickers/*.md` 自身作为 evidence URL (Claude phantom_citation_internal_loop 故障 — CRDO DustPhotonics 案例)
- **README**: 列出 Claude-specific guidance + freshness 要求 + 不许 cite 内部文件作为 evidence

### 4.2 ChatGPT_research
- **chrome :9223** dedicated profile
- **白名单**: chatgpt.com only (其他 tab 自动关闭)
- **角色**: secondary verification + structured data extraction
- **状态记录**: `_conversations\<chat_id>.json` 存每次 chat URL + 时间戳 + token estimate
- **freshness gate**: ≤10 message turns → new chat (per memory feedback_chrome_chat_freshness)

### 4.3 Grok_research
- **chrome :9224** dedicated profile
- **白名单**: grok.com / x.com/i/grok
- **角色**: tertiary + X/Twitter real-time discussion (analyst chatter)
- **特殊**: `_ratelimit_state.json` 跟踪 "Fast" mode quota
  ```json
  {
    "last_query_at": "2026-04-26T22:00:00-04:00",
    "quota_resets_at": "2026-04-26T23:56:00-04:00",
    "queries_this_window": 7,
    "fallback_mode": "auto"  // auto / always-fallback / disabled
  }
  ```
- **fallback 协议**: rate limit hit → 写 `mcp_fallback_waiver` 受 receipt, synthesis 阶段降级 verified_triple

### 4.4 Gemini_research (强制 quarantine)
- **chrome :9225** dedicated profile
- **白名单**: gemini.google.com only
- **强制 quarantine 协议** (基于 6 fabrication 累计):
  ```
  所有 Gemini outputs 默认进 _quarantine\, NOT _outputs\
  必须经 测谎员 检查通过才 promote 到 _outputs\
  ```
- **Quarantine rules** (`_quarantine_rules.md`):
  - **Rule G1**: §1 snapshot 数字 (mcap/price/shares) 必须 freshness ≤24h, >24h 自动 reject
  - **Rule G2**: §8 killer_triggers / §3 catalyst 数字必须 raw_quotes 支撑, 无 verbatim → unverified_gemini_synthesis 不进 SSOT
  - **Rule G3**: fabrication_self_check 含 "refute"/"override" 措辞 + 与 3-AI 冲突 → audit_VP block
  - **Rule G4**: Deep Research mode FORBIDDEN (per memory v1.3)
  - **Rule G5**: §5 同业 + §8 hidden findings 仍是 Gemini 强项, allowed 但 quarantine 标记
- **Promote 标准**: 测谎员 verify 通过且 cross-AI consensus 不冲突

---

## §5 Synthesis Phase (研究员 单点)

### 5.1 输入
```python
inputs = {
  "claude": "_AI_PROJECTS/claude_research/_outputs/2026-04-27/NVDA.json",
  "chatgpt": "_AI_PROJECTS/chatgpt_research/_outputs/2026-04-27/NVDA.json",
  "grok": "_AI_PROJECTS/grok_research/_outputs/2026-04-27/NVDA.json",
  "gemini": "_AI_PROJECTS/gemini_research/_quarantine/2026-04-27/NVDA.json",
}
```

### 5.2 流程
1. **Read 4 inputs** (Gemini 是 quarantine 状态, default trust = low)
2. **Inline 测谎员 quarantine check** (在 synthesis 前):
   - Gemini Rule G1-G5 全部检查
   - 失败 finding → 留 quarantine, mark `synthesis_excluded: true` + reason
3. **Cross-AI consensus matrix** (§9):
   - 排除 quarantined Gemini findings
   - 计算 spread on remaining
4. **Merge to canonical SSOT** (`03_tickers/NVDA.md`):
   - §1-§9 v2.0 数据
   - frontmatter 加 `gemini_quarantine_summary: {findings_excluded: N, reasons: [...]}`
5. **写 consensus matrix** (`_AUDITS/RBv2_pilot/_consensus_matrix_<batch>.md`)
6. **Phase 3 测谎员 final sample=1.0 audit** on canonical SSOT (现有流程不变)

---

## §6 Migration Plan (分阶段)

### Phase 0 (今天 / 4-27): 规划文档 + 用户决策
- ✅ 本文件落地
- ⏳ 用户 review + 决策开放问题 (§9)

### Phase 1 (Day 1-2): Chrome 实例基建
- 写 4 启动脚本 (`chrome_launch.ps1` per project)
- 用户手动 sign-in 4 chrome profiles (一次性, 然后 cookies persist)
- 测试 chrome MCP 能否同时连接多个 port (技术风险)

### Phase 2 (Day 2-3): Gemini quarantine 优先 (highest urgency)
- 建 `_AI_PROJECTS\gemini_research\` 完整目录
- 写 `_quarantine_rules.md` G1-G5
- 修改 RBv2_v2.0.md spec §9 加 quarantine 检查
- 修改 AGENT_PROMPT_TEMPLATE 加 Gemini-only finding 强制 raw_quote 验证

### Phase 3 (Day 3-4): Grok project (rate-limit 隔离)
- 建 `_AI_PROJECTS\grok_research\` 完整目录
- 写 `_ratelimit_state.json` 跟踪 + fallback 协议
- 测试: 跑一票 rate-limit fallback 路径

### Phase 4 (Day 4-5): ChatGPT + Claude projects
- 完成剩余两个 project 框架
- Claude 加 phantom_citation_internal_loop 防御规则

### Phase 5 (Day 5-6): Synthesis pipeline 重写
- 研究员 prompt 改为读 4 project folders
- inline quarantine check codify

### Phase 6 (Day 6-7): 现有数据迁移
- batch1+2+3 已 done 12 票: 留在 `_AUDITS/RBv2_pilot/` 不动 (历史归档)
- 新批次 (Tier 1 stale 9 票 + 后续) 用新架构

---

## §7 Gemini Spec Change ↔ 本架构关系

原"第二刀" Gemini fabrication spec change 是这个架构的**子集**:
- spec change §9 加 raw_quote 检查 → **本架构 Phase 2 实现** (Gemini quarantine rules G1-G5)
- AGENT_PROMPT_TEMPLATE 加 Gemini-only 强制条款 → **本架构 Phase 2 实现** (写到 _quarantine_rules.md)
- memory 计数 6x ESCALATION → **本架构 trigger** (这个架构是 ESCALATION 的 spec response)

**结论**: 不再单独做 Gemini spec change, 直接做这个架构, 一次解决 cross-AI 隔离 + Gemini quarantine + Claude phantom_citation_internal_loop 防御 + 未来 AI 源扩展性。

---

## §8 风险 & 缓解

| 风险 | 影响 | 缓解 |
|---|---|---|
| chrome MCP 同时连多 port 不支持 | high (架构基础) | 测试: 启动 2 chrome on 9222+9223, 看 mcp__chrome-devtools tools 能否 target | 
| 用户 4 次 sign-in 麻烦 | medium | 一次性 cost, profile 持久; 失败 fallback 到 single-chrome serial (现状) |
| Subscription tier 不够 | medium | ChatGPT Plus / Grok Premium / Gemini Pro 用户决策 |
| 现有 batch1+2+3 数据迁移 | low | 不迁移, 历史归档; 新批次用新架构 |
| 各 AI rate-limit 互不可见 | medium | 每 project `_ratelimit_state.json` + main Claude 总览仪表盘 (P3) |
| Synthesis 阶段读 4 source 慢 | low | 本地 file read, 不是远程 fetch |

---

## §9 待用户决策的开放问题

1. **Chrome profile 模式**: 4 独立 `--user-data-dir` (推荐) vs 共享 profile + tab 隔离? **推荐独立**
2. **Sign-in cost**: 用户愿意一次性 sign in 4 chrome profile (~10 min total)?
3. **Subscription tier**: ChatGPT Plus / Grok Premium / Gemini Pro 全订阅? 或部分?
4. **Output 格式**: JSON only? 还是 JSON + markdown 双份? (推荐 JSON only, synthesis 写 markdown)
5. **Conversation persistence**: 每 chat 存 snapshot 永久 (audit reproducibility) vs 每批次清空 (磁盘节省)?
6. **首批测试 ticker**: NVDA (anchor, +26.5% drift) vs 小票 (LITE 已 done 借鉴) 试跑?
7. **Phase 2-6 时间窗**: 集中 1 周做完 vs 分散到 2 周 (与 Tier 1 stale 升级并行)?
8. **回退策略**: 如新架构 Phase 1 测试失败 (chrome 多 port 不可行), 回退到当前架构 + 仅做 Gemini spec change (原"第二刀")?

---

## §10 Implementation 后续 (待 §9 决策后启动)

待用户回答 §9 后, 主线程会:
1. 把决策落实成 `00_rules\AI_AGENT_ISOLATION_ARCHITECTURE_v1.0.md` (final 版)
2. 派 架构主管 拆 Phase 1-6 工程 ticket
3. 总监战略队列 Phase 1-6 各登记一行 P0 (架构主管 own)
4. main Claude 物理 dispatch 各 phase 的 worker (自动化工程师 写脚本 / 前端全栈员 / etc)

---

## §11 文件位置

- 本文件: `D:\Claude\AI_Semi_Research\00_rules\AI_AGENT_ISOLATION_ARCHITECTURE_v0.1.md`
- 触发证据: `_AUDITS\_FABRICATION_LOG.md` (Gemini 6 + Claude 1 累计)
- 战略队列: `_AUDITS\_总监_战略建议队列.md` (P0 gemini_fabrication_3rd_event_ESCALATION)
- 用户原话: 2026-04-27 "AI agent 单独 MCP chrome + 单独 project folder"

---

end of v0.1 planning draft.
