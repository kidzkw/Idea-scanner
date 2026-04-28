---
date: 2015-03-31
source: se
source_detail: "se post softwarerecs_18368 by u/Pacerier"
url: "https://softwarerecs.stackexchange.com/questions/18368/is-there-a-tool-to-convert-php-from-higher-version-to-lower-version"
topic: "Is there a tool to convert PHP from higher version to lower version?"
author: Pacerier
engagement: 21
created_utc: 2015-03-31T12:44:44Z
pain_keywords: ["\\bis there (a|an|any) (tool|app|way)\\b"]
confidence: medium
status: raw
raw_intake_version: plan_b_v1
---

# Is there a tool to convert PHP from higher version to lower version?

> **Source**: https://softwarerecs.stackexchange.com/questions/18368/is-there-a-tool-to-convert-php-from-higher-version-to-lower-version

## 原始内容

Is there a converter to convert PHP code from a higher version (e.g. dropdown-select PHP 5.7) to a lower version (e.g. dropdown-select PHP 5.2)?

This would extremely useful  for compatibility with existing legacy systems. It must be able to convert PHP 5.3's anonymous functions into the equivalent PHP 5.2's string-based versions using create_function. (Indeed that's the only feature I need actually.)

Of course, support for the additional features would be great too, e.g.:

PHP 5.6's argument unpacking.

PHP 5.4's "permanent short echo tags" <?= (in prior versions, this tag is only enabled if short_open_tag etc are used). The app should provide an option to convert <?= into <?php echo.

A standalone converter (runnable at least on Windows) would be sufficient, though preferably an option to plugin-integrate with Notepad++ and possibly PHP Storm. (E.g. whenever I save a file e.g. my_file.php.pre, it would automatically do the conversions and output my_file.php.)

## 自动提取的痛点信号

- 命中关键词: \bis there (a|an|any) (tool|app|way)\b
- 互动度: 21
- 作者: u/Pacerier

<!-- 处理: 调度员 → 5 阶段 pipeline -->
