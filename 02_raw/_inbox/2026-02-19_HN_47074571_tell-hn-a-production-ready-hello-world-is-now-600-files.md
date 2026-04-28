---
date: 2026-02-19
source: hn
source_detail: "hn post 47074571 by u/thesssaism"
url: "https://news.ycombinator.com/item?id=47074571"
topic: "Tell HN: A production-ready 'Hello World' is now ~600 files"
author: thesssaism
engagement: 8
created_utc: 2026-02-19T15:07:03Z
pain_keywords: ["\\btried .{1,40}? but\\b"]
confidence: medium
status: raw
raw_intake_version: plan_b_v1
---

# Tell HN: A production-ready "Hello World" is now ~600 files

> **Source**: https://news.ycombinator.com/item?id=47074571

## 原始内容

I recently ran an audit on our latest full-stack repo to figure out why &quot;spinning up a new project&quot; felt like such a heavy lift. I counted every file required just to reach a &quot;production-ready&quot; baseline—before writing a single line of unique feature code.<p>The count was roughly 600 files.<p>To be clear, I&#x27;m not talking about a `create-react-app` sandbox. I mean a compliant, scalable SaaS foundation: Next.js frontend, Node.js&#x2F;NestJS backend, mobile wrapper, CI&#x2F;CD pipelines, and enough security config to pass a SOC2 audit.<p>It sounds ridiculous (and honestly, it feels ridiculous), but when I broke it down, I couldn&#x27;t find many files I was willing to delete.<p>Here is where the bloat comes from:<p>First, the &quot;Configuration Hell&quot; accounts for about 40-50 files alone. We aren&#x27;t just dealing with `package.json` anymore. It&#x27;s `tsconfig.json` (base), `tsconfig.build.json`, `tsconfig.spec.json`... multiplied across frontend, backend, and shared libraries. Then add `.eslintrc.js`, `.prettierrc`, `jest.config.js`, `vitest.config.ts`, `nodemon.json`, and the Docker-compose variants for dev, test, and prod.<p>Then there’s the DevOps and Quality layer. We have roughly 20-30 files for GitHub Actions workflows (lint, test, build, deploy, semantic release), Husky hooks (pre-commit, commit-msg), and pull request templates.<p>But the real multiplier is the separation of concerns. In a modern monorepo, a &quot;Hello World&quot; isn&#x27;t just `console.log`. It’s:
- A NestJS module (Controller, Service, Module, DTO, Entity, Unit Test, E2E Test).
- A Next.js slice (Page, Component, Type definition, API client wrapper).
- A shared library entry.<p>We found that adding a single &quot;minimal&quot; API endpoint usually touches 5-7 files just to maintain architectural standards.<p>The trade-off is painful. On one hand, this setup handles the things we used to forget: security headers, proper logging, consistent error handling, and type safety across boundaries. It prevents the &quot;spaghetti code&quot; distinct to startups that scale too fast.<p>On the other hand, the cognitive load of managing a 600-file &quot;empty&quot; project is massive. Updating dependencies becomes a chore because a major version bump in one tool (like ESLint) cascades through forty config files.<p>I’m curious how others are handling this &quot;starting line&quot; complexity.<p>Are you accepting the boilerplate as the cost of doing business? Or have you found a way to strip this down without sacrificing the compliance&#x2F;safety guardrails that enterprise clients demand?<p>It feels like we&#x27;ve over-engineered the entry point of software development, but I’m not sure what the alternative is for a serious project. We tried going &quot;lean&quot; initially, but spent weeks retrofitting auth and testing harnesses later—which was worse.<p>Is there a middle ground I&#x27;m missing, or is ~600 files just the new normal?

## 自动提取的痛点信号

- 命中关键词: \btried .{1,40}? but\b
- 互动度: 8
- 作者: u/thesssaism

<!-- 处理: 调度员 → 5 阶段 pipeline -->
