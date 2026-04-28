"""
Stack Exchange pull · 2026-04-28
- No auth (300 req/day/IP without key, 10K with key — we use ~20 req/run, no key needed)
- Sites: workplace / superuser / serverfault / sysadmin / freelancing / pm / ux
- Strategy: questions with high views + low/no accepted answer → unmet need signal
- Writes to 02_raw/_inbox/
- Dedup: _state/seen_se.json
"""
from __future__ import annotations
import time
import urllib.parse
from datetime import datetime, timezone
from _lib import (
    PainCandidate, http_get_json, load_seen, save_seen,
    passes_filter, write_raw, matched_positive_keywords, log,
)

API = "https://api.stackexchange.com/2.3"
PLATFORM = "se"

# (site, sort, order, min_score) — each is one call, ≤30 total
SITES = [
    {"site": "workplace",   "min_score": 5},
    {"site": "freelancing", "min_score": 3},
    {"site": "pm",          "min_score": 3},
    {"site": "ux",          "min_score": 3},
    {"site": "softwarerecs","min_score": 3},   # gold mine — "is there a tool"
    {"site": "superuser",   "min_score": 5},
    {"site": "serverfault", "min_score": 5},
    {"site": "webapps",     "min_score": 3},   # SaaS/web app pain
    {"site": "money",       "min_score": 3},   # personal finance pain
]


def search_unanswered(site: str, min_score: int) -> list[dict]:
    """High-score questions with NO accepted answer = unmet need."""
    params = {
        "order": "desc",
        "sort": "votes",
        "site": site,
        "pagesize": 30,
        "filter": "withbody",   # include question body
        "min": min_score,
    }
    url = f"{API}/questions/no-answers?{urllib.parse.urlencode(params)}"
    log(f"GET {url}")
    try:
        return http_get_json(url).get("items", [])
    except Exception as e:
        log(f"  failed: {e}")
        return []


def search_active(site: str, min_score: int) -> list[dict]:
    """Recent active questions matching pain language → use post-filter."""
    params = {
        "order": "desc",
        "sort": "activity",
        "site": site,
        "pagesize": 50,
        "filter": "withbody",
        "min": min_score,
    }
    url = f"{API}/questions?{urllib.parse.urlencode(params)}"
    log(f"GET {url}")
    try:
        return http_get_json(url).get("items", [])
    except Exception as e:
        log(f"  failed: {e}")
        return []


def to_candidate(item: dict, site: str) -> PainCandidate | None:
    qid = item.get("question_id")
    if not qid:
        return None
    return PainCandidate(
        platform=PLATFORM,
        post_id=f"{site}_{qid}",
        title=item.get("title", ""),
        body=item.get("body", ""),
        author=(item.get("owner") or {}).get("display_name", "unknown"),
        permalink=item.get("link") or f"https://{site}.stackexchange.com/q/{qid}",
        created_utc=datetime.fromtimestamp(
            item.get("creation_date", 0), tz=timezone.utc
        ).isoformat().replace("+00:00", "Z"),
        engagement=int(item.get("view_count", 0) // 100) + int(item.get("score", 0)),
        extra={
            "view_count": item.get("view_count"),
            "score": item.get("score"),
            "answer_count": item.get("answer_count"),
            "is_answered": item.get("is_answered"),
            "site": site,
        },
    )


def main() -> int:
    seen = load_seen(PLATFORM)
    log(f"loaded {len(seen)} previously-seen SE ids")
    written = 0
    rejected = {"dedup": 0, "filter": 0, "parse": 0}
    new_ids = set(seen)

    for cfg in SITES:
        site = cfg["site"]
        # 1) unanswered = strong signal of unmet need
        for item in search_unanswered(site, cfg["min_score"]):
            cand = to_candidate(item, site)
            if cand is None:
                rejected["parse"] += 1; continue
            if cand.post_id in seen:
                rejected["dedup"] += 1; continue
            ok, reason = passes_filter(cand)
            if not ok:
                rejected["filter"] += 1; continue
            kws = matched_positive_keywords(cand)
            path = write_raw(cand, kws)
            new_ids.add(cand.post_id)
            written += 1
            log(f"    + {path.name}")
        time.sleep(0.5)

        # 2) recent active — for fresh signal
        for item in search_active(site, cfg["min_score"]):
            cand = to_candidate(item, site)
            if cand is None:
                rejected["parse"] += 1; continue
            if cand.post_id in seen:
                rejected["dedup"] += 1; continue
            ok, reason = passes_filter(cand)
            if not ok:
                rejected["filter"] += 1; continue
            kws = matched_positive_keywords(cand)
            path = write_raw(cand, kws)
            new_ids.add(cand.post_id)
            written += 1
            log(f"    + {path.name}")
        time.sleep(0.5)

    save_seen(PLATFORM, new_ids)
    log(f"DONE | written={written} rejected={rejected} total_seen={len(new_ids)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
