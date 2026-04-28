"""
Plan B shared lib · 2026-04-28
- Writes raw markdown files to 02_raw/_inbox/ in the format the 5-stage pipeline expects
- Deduplicates by (platform, post_id)
- Filters by pain-keyword regex (positive must hit; negative must miss)
- Stdlib only (urllib, json, re, pathlib) — no pip install needed
"""
from __future__ import annotations
import html
import json
import re
import sys
import time
import urllib.request
import urllib.parse
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable

# -------- paths (resolved relative to repo root, not cwd) --------
REPO_ROOT = Path(__file__).resolve().parents[3]   # .../AI_Reddit
INBOX = REPO_ROOT / "02_raw" / "_inbox"
STATE_DIR = Path(__file__).resolve().parent / "_state"
STATE_DIR.mkdir(exist_ok=True)
INBOX.mkdir(parents=True, exist_ok=True)

# -------- pain keyword filter (v0.1; relax/tighten in forum_taxonomy.md) --------
POSITIVE_KEYWORDS = [
    r"\bI wish there (was|were)\b",
    r"\bis there (a|an|any) (tool|app|way)\b",
    r"\bhow do you (guys|all)\b",
    r"\bwhy (isn'?t|doesn'?t) (there|anyone)\b",
    r"\bno one has built\b",
    r"\b(frustrating|nightmare|wasting hours|wastes my time)\b",
    r"\bI('?d| would) pay\b",
    r"\bwould pay (good money|for)\b",
    r"\btried .{1,40}? but\b",
    r"\bswitched from\b",
    r"\bcan'?t find a\b",
    r"\b(recommend|looking for) a tool\b",
    r"\bhate that\b",
    r"\bworkaround\b",
    r"\bhack(ed)? together\b",
]
POSITIVE_RE = re.compile("|".join(POSITIVE_KEYWORDS), re.IGNORECASE)

NEGATIVE_PATTERNS = [
    r"\bDAE\b",                          # "Does anyone else" venting
    r"\bcirclejerk\b",
    r"\bI built (this|a)\b",             # author's own promo
    r"\bcheck out (my|our) (tool|app)\b",
    r"\baffiliate\b",
    r"\bhiring\b",
    r"\bjob (post|opening)\b",
]
NEGATIVE_RE = re.compile("|".join(NEGATIVE_PATTERNS), re.IGNORECASE)

MIN_BODY_CHARS = 50
MIN_ENGAGEMENT = 3   # comments / reactions / score floor


# -------- types --------
def clean_html(s: str) -> str:
    """HN/SE return bodies with HTML entities and <p>-style markup. Decode + flatten."""
    if not s:
        return ""
    s = re.sub(r"<\s*p\s*>", "\n\n", s, flags=re.IGNORECASE)
    s = re.sub(r"<br\s*/?>", "\n", s, flags=re.IGNORECASE)
    s = re.sub(r"<[^>]+>", "", s)
    s = html.unescape(s)
    s = re.sub(r"\n{3,}", "\n\n", s).strip()
    return s


@dataclass
class PainCandidate:
    platform: str            # "hn" / "se" / "gh" / "reddit"
    post_id: str             # platform-native id
    title: str
    body: str
    author: str
    permalink: str
    created_utc: str         # ISO 8601
    engagement: int          # comments / score / reactions — whichever fits
    extra: dict = field(default_factory=dict)

    def __post_init__(self):
        self.title = clean_html(self.title)
        self.body = clean_html(self.body)

    @property
    def date(self) -> str:
        return self.created_utc[:10]

    @property
    def text_for_filter(self) -> str:
        return f"{self.title}\n{self.body}"

    @property
    def slug(self) -> str:
        s = re.sub(r"[^a-zA-Z0-9-]+", "-", self.title.lower()).strip("-")
        return s[:60] or "untitled"


# -------- dedup state --------
def _state_file(platform: str) -> Path:
    return STATE_DIR / f"seen_{platform}.json"

def load_seen(platform: str) -> set[str]:
    p = _state_file(platform)
    if not p.exists():
        return set()
    return set(json.loads(p.read_text(encoding="utf-8")))

def save_seen(platform: str, ids: Iterable[str]) -> None:
    _state_file(platform).write_text(
        json.dumps(sorted(set(ids)), indent=2), encoding="utf-8"
    )


# -------- filter --------
def passes_filter(c: PainCandidate) -> tuple[bool, str]:
    if len(c.body) + len(c.title) < MIN_BODY_CHARS:
        return False, "body too short"
    if c.engagement < MIN_ENGAGEMENT:
        return False, f"engagement {c.engagement} < {MIN_ENGAGEMENT}"
    if NEGATIVE_RE.search(c.text_for_filter):
        return False, "negative keyword hit"
    if not POSITIVE_RE.search(c.text_for_filter):
        return False, "no positive pain keyword"
    return True, "ok"


# -------- write to _inbox --------
def write_raw(c: PainCandidate, matched_keywords: list[str]) -> Path:
    """Write one candidate to 02_raw/_inbox/ as a markdown file with frontmatter
    that the 5-stage pipeline can consume.
    """
    fname = f"{c.date}_{c.platform.upper()}_{c.post_id}_{c.slug}.md"
    path = INBOX / fname
    if path.exists():
        return path  # idempotent
    fm = [
        "---",
        f"date: {c.date}",
        f"source: {c.platform}",
        f'source_detail: "{c.platform} post {c.post_id} by u/{c.author}"',
        f'url: "{c.permalink}"',
        f'topic: "{c.title.replace(chr(34), chr(39))[:120]}"',
        f"author: {c.author}",
        f"engagement: {c.engagement}",
        f"created_utc: {c.created_utc}",
        f"pain_keywords: {json.dumps(matched_keywords)}",
        "confidence: medium",
        "status: raw",
        "raw_intake_version: plan_b_v1",
        "---",
        "",
        f"# {c.title}",
        "",
        "> **Source**: " + c.permalink,
        "",
        "## 原始内容",
        "",
        c.body.strip() if c.body else "_(post has no body text — title-only)_",
        "",
        "## 自动提取的痛点信号",
        "",
        f"- 命中关键词: {', '.join(matched_keywords) or '(none — flagged for manual review)'}",
        f"- 互动度: {c.engagement}",
        f"- 作者: u/{c.author}",
        "",
        "<!-- 处理: 调度员 → 5 阶段 pipeline -->",
        "",
    ]
    path.write_text("\n".join(fm), encoding="utf-8")
    return path


def matched_positive_keywords(c: PainCandidate) -> list[str]:
    text = c.text_for_filter
    out = []
    for pat in POSITIVE_KEYWORDS:
        if re.search(pat, text, re.IGNORECASE):
            out.append(pat)
    return out


# -------- HTTP helper (stdlib, GET only, JSON) --------
def http_get_json(url: str, headers: dict | None = None, timeout: int = 30) -> dict:
    req = urllib.request.Request(url, headers=headers or {"User-Agent": "ai_reddit_pain_miner/0.1"})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8"))


def log(msg: str) -> None:
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    # Windows default cp936/gbk console can't encode Chinese/emoji.
    # Force UTF-8 on stdout once per process.
    try:
        print(f"[{ts}] {msg}", flush=True)
    except UnicodeEncodeError:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        print(f"[{ts}] {msg}", flush=True)


# Ensure UTF-8 output from the start (idempotent).
try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass
