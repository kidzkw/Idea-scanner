---
date: 2025-09-22
source: hn
source_detail: "hn post 45338653 by u/tlonny"
url: "https://news.ycombinator.com/item?id=45338653"
topic: "Ask HN: What am I doing wrong Re Agentic coding"
author: tlonny
engagement: 33
created_utc: 2025-09-22T19:56:21Z
pain_keywords: ["\\b(frustrating|nightmare|wasting hours|wastes my time)\\b"]
confidence: medium
status: raw
raw_intake_version: plan_b_v1
---

# Ask HN: What am I doing wrong Re Agentic coding

> **Source**: https://news.ycombinator.com/item?id=45338653

## 原始内容

Here is the prompt I gave both Claude Code CLI, and the VSCode agent for my TS project:<p>```<p>I have modified the type signature and behaviour of how jobs are created. Previously, job definition create took a batch argument (created from a queue). Now it takes the queue directly, is async, requires the databaseClient to be passed in at creation (vs. when the batch is executed). It no longer returns anything - which is fine because the result was only being used for logging - which is now done for us so we don&#x27;t have to worry. Can we refactor the codebase to make use of the new JobDefinition.create? Remove the vestigial &quot;Job created&quot; log please.<p>Perform this task and this task only. If you see something unrelated that you believe needs to be refactored - DO NOT MODIFY IT. ONLY PERFORM ACTIONS DIRECTLY RELEVANT TO THIS TASK<p>```<p>So there are two instructions:<p>1. Do the task<p>2. Don&#x27;t do stuff that isn&#x27;t the task (added in frustration on subsequent attempts)<p>My experience:<p>The agent flow started well - it found all the files that needed to change and began making edits.<p>By about file #5 I noticed that on top of requested refactor it started re-ordering object keys of the `JobDefinition.create` method. Although semantically a no-op, this was incredibly frustrating as it made diffs much harder to review.<p>A little later, it started to modify log messages it wasn&#x27;t happy with before eventually completely going off the rails and adding arguments to my function definitions that it _thought_ they needed (introducing type&#x2F;run-time errors).<p>VSCode would periodically pause and ask for a confirmation in order to continue. Each time I used the opportunity to re-prompt the agent to stay on target:<p>Me: &quot;STOP GOING OFF TASK - STOP RENAMING VARIABLES, REORDERING PARAMS. JUST DO AS THE TASK TELLS YOU AND NOTHING ELSE&quot;<p>Agent: &quot;You&#x27;re absolutely right. I apologize for going off task. Let me focus solely on the task: refactoring JobDefinition.create calls to use the new signature and removing vestigial &quot;Job created&quot; logs&quot;<p>And each time the bad behavior would return after some time.<p>I&#x27;m not sure what I&#x27;m doing wrong. I assumed this sort of mechanical monkey work would be bread and butter for an agentic workflow - but it just keeps losing coherence.<p>I ended up reverting all the changes as I had absolutely 0 trust in the quality of the generated code.<p>I apologise for the wall of text but I&#x27;m quite frustrated about all the time wasted and am desperate to know what I&#x27;m doing wrong!<p>Thanks in advance!

## 自动提取的痛点信号

- 命中关键词: \b(frustrating|nightmare|wasting hours|wastes my time)\b
- 互动度: 33
- 作者: u/tlonny

<!-- 处理: 调度员 → 5 阶段 pipeline -->
