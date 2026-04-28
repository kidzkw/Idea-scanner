---
file_type: taxonomy
name: Pain Point Taxonomy
version: v0.1
created: 2026-04-28
purpose: 给每个 pain SSOT frontmatter `tags:` 字段一个受控词表，方便聚类 + 索引
---

# 🗂️ Pain Point Taxonomy · v0.1

> 每个 pain SSOT 的 frontmatter 至少打 1 个「受众」标签 + 1 个「领域」标签。
> 词表演化中，新词加在末尾。

---

## A · 受众标签 (audience:*)

| 标签 | 含义 |
|---|---|
| `audience:solo-founder` | 单兵创始人，0-5 人 team |
| `audience:smb-owner` | 中小企业主（10-100 人） |
| `audience:freelancer` | 自由职业者（设计 / 开发 / 文案） |
| `audience:creator` | YouTuber / 播客 / Twitch / Substack |
| `audience:dev` | 开发者（侧重工程师身份） |
| `audience:designer` | 设计师 |
| `audience:marketer` | 营销人 |
| `audience:sales` | 销售 |
| `audience:teacher-student` | 教育 K12 / 大学 |
| `audience:parent` | 父母 |
| `audience:nyc-resident` | 纽约本地居民（房产/通勤/餐饮 niche） |
| `audience:remote-worker` | 远程工作者 |
| `audience:job-seeker` | 求职者 |
| `audience:non-tech-smb` | 非科技中小企业（餐厅/诊所/律所） |

## B · 领域标签 (domain:*)

| 标签 | 含义 |
|---|---|
| `domain:productivity` | 任务/笔记/时间管理 |
| `domain:dev-tools` | 开发者工具 |
| `domain:saas-ops` | SaaS 运营 |
| `domain:marketing` | 营销自动化/SEO/内容 |
| `domain:sales-crm` | 销售 / CRM |
| `domain:finance-personal` | 个人理财 |
| `domain:finance-smb` | 中小企业财务 |
| `domain:hr-hiring` | 招聘 / 雇员管理 |
| `domain:education` | 教育/培训 |
| `domain:creator-tools` | 创作者工具 |
| `domain:ai-workflow` | AI workflow / agent |
| `domain:data-analytics` | 数据分析 |
| `domain:e-commerce` | 电商 |
| `domain:local-services` | 本地服务（NYC 居民优势） |
| `domain:health-fitness` | 健身/营养（**注意 G2 法律：医疗诊断免谈**） |
| `domain:travel` | 旅行 |
| `domain:home-management` | 家居管理 |

## C · 解决形态标签 (solution_form:*)

| 标签 | 含义 |
|---|---|
| `form:webapp` | 纯 webapp |
| `form:browser-ext` | 浏览器扩展 |
| `form:cli` | 命令行工具 |
| `form:api-only` | API + docs 即产品 |
| `form:slack-bot` | Slack/Discord bot |
| `form:cms-template` | 模板/主题/preset |
| `form:notion-airtable-template` | Notion / Airtable 模板 |
| `form:newsletter` | 付费 newsletter |
| `form:directory` | 目录站 / SEO arbitrage |
| `form:notification` | 通知/警报服务 |
| `form:done-for-you` | 服务化（人工 + AI 后台） |

## D · 严重度信号标签 (signal:*)

| 标签 | 含义 |
|---|---|
| `signal:financial-loss` | 用户实际损失钱 |
| `signal:time-waste` | 用户每天花 ≥30min 在 workaround |
| `signal:data-loss-risk` | 现状有数据丢失风险 |
| `signal:embarrassment` | 社交损失（出错被骂 / 客户流失） |
| `signal:legal-risk` | 用户面临合规风险 |
| `signal:wtp-stated` | 至少 1 条 verbatim 说"I'd pay" |
| `signal:wtp-revealed` | 同类已有付费产品 ≥$10/mo |

## E · 平台来源标签（自动打）

由 抓取员 自动按帖子来源打：
`source:reddit:<sub>` / `source:hn` / `source:ih` / `source:ph` / `source:g2` / `source:quora` / `source:so` / `source:github` / `source:discord:<server>` / `source:upwork` / `source:yelp` / `source:glassdoor`

## F · 演化规则

- 新词加在末尾，**不删旧词**（防 SSOT 引用断链）。
- 弃用词在词表后加 `(deprecated YYYY-MM-DD)`。
- 新增标签需 `进化员` 季度报告中触发，或用户直接指令。
