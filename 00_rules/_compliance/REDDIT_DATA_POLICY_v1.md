---
file_type: compliance_policy
name: Reddit Data Use Policy (internal hard rules)
version: v1.0
created: 2026-04-28
authority: Reddit Responsible Builder Policy + Reddit Data API Terms
applies_to:
  - 抓取员 (scraper orchestrator)
  - 流水主管 + 5 阶段 pipeline (handles raw inbox)
  - 研究员 (writes pain SSOT)
  - 原话手 (verbatim capture)
  - 任何对 02_raw/ 写入的 agent
binding: hard rules — 任一违反 = 自动阻断 commit 并报警
---

# 🛡️ Reddit Data Use Policy · v1.0 (internal)

> **来源**：Reddit Responsible Builder Policy + Reddit Data API Terms（公开页面）
> **目的**：把 Reddit 政策翻译成本仓库内 agent 必须遵守的硬规则；防止"无意识"踩线。

---

## 一、3 条绝对红线（任一违反 → 阻断）

### R1 · 不得用 Reddit 内容训练 AI 模型
- **禁止**：fine-tune / LoRA / 任何 model training；用 Reddit 帖子建可导出的 embedding 数据集；把 raw / verbatim 文件复制到任何 model-training pipeline。
- **允许**：用 Claude（或其他 LLM）做**推理 / 分析 / 摘要**（inference）—— 这不是训练。
- **检测**：禁止任何 agent 写 `.npy` / `.pkl` / `.parquet` / `embeddings.json` / `training_set/` 路径，除非 commit message 明确"非 Reddit 来源"。

### R2 · 不得分发 / 转售 / 公开 Reddit 内容
- **禁止**：把 `02_raw/_processed/*reddit*` / `03_pain_points/VERBATIM/` 推到 public git repo；做成数据集卖；发布原话到 newsletter / blog 完整 quote 段。
- **允许**：内部分析；在最终产品里**引用 insight 而非原文**（"用户痛点是 X"是 insight；引用一段 5 句帖子就是分发）。
- **检测**：`.gitignore` 已涵盖 `**/*.env`；本仓库**整体**不 push 到 public（用户 ownership）。

### R3 · Reddit 数据不得进入最终产品
- **禁止**：MVP / 上线产品里**包含**抓来的 Reddit 帖子 / 评论 / 用户名。
- **允许**：产品**独立解决**抓来的痛点 → 产品代码里没有 Reddit 文本，只有功能。
- **示例**：
  - ✅ "我从 r/SaaS 发现做账痛点 → 我建了 SaaS-Books 产品" — 合规
  - ❌ "我把抓来的 100 条 Reddit 抱怨整理成博客发布" — **违规**
  - ❌ "我训练了一个 LLM 复述 Reddit 上的痛点话术" — **违规**

---

## 二、Rate Limit + 抓取硬限

| 项 | 上限 | 我们的策略 |
|---|---|---|
| OAuth req/min | 100 (Reddit 免费 tier) | 抓取员硬限 60 / min（buffer） |
| OAuth req/10min rolling | 600 | 自动 backoff |
| 单 sub 单次抓取 | 无明文 | 我们硬限 100 帖/sub/次 |
| 一日总抓取 | 无明文 | 我们硬限 5000 帖/日（防"industrial-scale"嫌疑） |
| User-Agent | 必须真实独特 | `ai_reddit_pain_miner/0.1 by u/<your_username>` |

> **依据**：Reddit 公开免费 tier 是 60-100 req/min OAuth。industrial-scale 抓取（Perplexity / Anthropic 案）是被起诉触发点 —— 我们规模 ≪ 那个。

---

## 三、存储 + 保留策略

| 数据类型 | 保留位置 | 保留期 | 删除规则 |
|---|---|---|---|
| Raw 帖子（02_raw/_processed/） | 本地 | 18 月 | 18 月后 mv `_archive/` |
| Verbatim 原话（03_pain_points/VERBATIM/） | 本地 | 永久（pain SSOT 引用） | 用户主动删 OR Reddit DMCA |
| Permalink only（pain SSOT 主体引用） | 本地 + 索引 | 永久 | 同上 |
| 用户的 PII（手机/邮箱/住址） | **从不存** | - | inbox 写入前 redact |
| Reddit 用户名 | 仅 verbatim 文件保留（attribution）；INDEX 不索引 | 同 verbatim | 同上 |

## 四、注册 Reddit App 时的"用途说明"模板

如果 Reddit 注册流程要你填 **purpose / use case**，照下面填，老实 + 防御：

> **Purpose**: Personal pain-point research for product ideation.
>
> **What I'll do**: Read recent posts in 30 SaaS / entrepreneurship / NYC subreddits; identify recurring complaints / feature requests; aggregate into a personal research database.
>
> **What I will NOT do**:
> - Train any AI / ML model on Reddit data
> - Redistribute, resell, or publish Reddit content
> - Build a product that contains Reddit posts / users / comments
> - Exceed personal-use rate limits (≤ 60 req/min)
>
> **Read-only**. No posting, voting, messaging, or modifying any content.

---

## 五、违规后的"自首"流程

如果检测到任何 R1/R2/R3 触发：

1. 立刻停所有抓取脚本（`pkill reddit_pull`）
2. mv 涉嫌文件到 `_AUDITS/_compliance_quarantine/YYYY-MM-DD/`
3. 写 `_AUDITS/_FABRICATION_LOG.md`（沿用现有 audit log）增条目
4. 通知用户决策：删除 / 重新分类 / 申请 Reddit 商业 license

---

## 六、Agent 执行清单（每个 agent 启动时检查）

| Agent | 启动检查项 |
|---|---|
| 抓取员 | rate limit 60/min 已设？User-Agent 已标识？目标 sub 在白名单？ |
| 流水主管 | 入 inbox 的帖子有 permalink？没有 PII？ |
| 研究员 | 写 pain SSOT 时**不引用整段长 quote**（>100 字截断） |
| 原话手 | verbatim 文件含 permalink + 截图日期，方便 DMCA 追溯 |
| 调度员 | 不向任何外部 webhook / API 转发 raw 内容 |
| 自动化工程师 | 写 cron 时不允许出口到 public-reachable 端点 |

---

## 七、复审

- 每月 1 号 合规主管 自动跑 `policy_check`
- Reddit 政策 URL 变化时（`https://support.reddithelp.com/hc/en-us/articles/42728983564564-Responsible-Builder-Policy`）人工重读
- 如果 Reddit 收紧政策（pre-approval 强制 / 个人项目也要付费）→ 暂停抓取，重新评估

---

## 八、与公开诉讼案的距离评估

Reddit 已起诉：
- **Perplexity** (2024) — "industrial-scale scraping" 用于商业 AI 搜索产品
- **Anthropic** (2025) — 控诉用 Reddit 数据训练 Claude

我们和这些案的**关键差异**：
- 我们是**单用户、读取量小**（≤5K/日）— 不是 industrial-scale
- 我们**不训练任何模型** — Claude 是 vendored inference 工具
- 我们**不转售数据** — 全部本地
- 我们**不在产品里嵌入 Reddit 内容**

只要我们守住这 4 条，落在 Reddit 容忍的 personal use 区间。
