<!--
═══════════════════════════════════════════════════════════════════
  RAW INPUT 模板 (PAIN edition) · v1 · 2026-04-28
  使用方法:
  1. **抓取员** 自动产出 (Plan B fetcher 已用此 frontmatter, 见 06_data_sources/_scripts/plan_b/_lib.py)
  2. 人工添加: 复制本文件 → 命名 YYYY-MM-DD_<PLATFORM>_<post_id>_<topic-kebab>.md
  3. 投到 02_raw/_inbox/
  4. 在 Claude 对话里说「处理 inbox」→ 调度员 触发 5 阶段 pipeline
═══════════════════════════════════════════════════════════════════
-->

---
date: YYYY-MM-DD
source: hn                  # hn / se / gh / reddit / ih / ph / g2 / capterra / quora / so / x / yelp / glassdoor / upwork / other
source_detail: ""           # "hn post 46030021 by u/psicombinator" / "G2 review on Notion 2-star"
url: ""                     # 永久 permalink (DMCA 追溯用)
topic: ""                   # 一句话点题, ≤120 字符
author: ""                  # 平台 handle (不填真名)
engagement: 0               # 评论数 + 反应/点赞 — 用于分诊员 engagement floor
created_utc: ""             # ISO 8601 — 帖子创建时间
pain_keywords: []           # 命中的正向关键词列表 (来自 _lib.py POSITIVE_KEYWORDS)
confidence: medium          # low / medium / high — 抓取员 / 用户对该 raw 的可信度
status: raw                 # raw → processing (分诊员 accepted) → rejected/processed
raw_intake_version: plan_b_v1
---

# {{帖子标题}}

> **Source**: {{permalink URL}}

## 原始内容

<!-- 直接粘贴帖子正文 (HN: story_text; SE: question body; GH: issue body; Reddit: selftext)
     由 抓取员 自动 clean_html (去 <p> / 实体解码) 后写入 -->



## 自动提取的痛点信号

- 命中关键词: {{逗号分隔}}
- 互动度: {{engagement_score}}
- 作者: u/{{author}}

<!-- 处理: 调度员 → 分诊员 → 提取员 → 对比员 → 规则稽查 → 归档员 -->
<!-- 5 阶段后, raw 文件 mv 到 02_raw/_processed/<YYYY-MM>/ -->

## (可选) 用户备注

<!-- 如果你手工投递, 想让 提取员 关注什么? 写在这里, 不会进 SSOT -->
