# GitHub Personal Access Token (PAT) — 5 分钟设置

> 没有 PAT，`gh_pull.py` 限 60 req/h（仍能跑，但拉得少）。
> 有 PAT，限 5K req/h，且 GitHub 不会因为风控屏蔽你。

## 步骤

1. 打开 https://github.com/settings/tokens
2. 点 **"Generate new token"** → 选 **"Generate new token (classic)"**
3. 表单：
   - **Note**: `ai_reddit_pain_miner`
   - **Expiration**: 90 days（到期再生成）
   - **Scopes**: **全部不勾选** ⭐（公开 issues 不需要任何权限）
4. 点 **"Generate token"**
5. 复制出现的 token（`ghp_...` 开头，**只显示一次**）

## 写入 .env

在 `D:/Claude/AI_Reddit/.env` 添加：

```
GITHUB_PAT=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

文件不存在就新建。`.env` 已被 `.gitignore` 覆盖，安全。

## 验证

```powershell
cd D:\Claude\AI_Reddit\06_data_sources\_scripts\plan_b
python gh_pull.py
```

第一行应该显示 `using GitHub PAT ending in ...XXXX`，不再 `[WARN] GITHUB_PAT not set`。
