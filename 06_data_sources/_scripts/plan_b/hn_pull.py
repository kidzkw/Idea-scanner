"""
HN Algolia pull · 2026-04-28
- No auth, no key
- Rate limit: 10K req/h (we use ~30 calls/run, way under)
- Pulls Ask HN + Show HN + general high-point stories matching pain keywords
- Writes to 02_raw/_inbox/
- Dedup state: _state/seen_hn.json
"""
from __future__ import annotations
import time
import urllib.parse
from _lib import (
    PainCandidate, http_get_json, load_seen, save_seen,
    passes_filter, write_raw, matched_positive_keywords, log,
)

ALGOLIA = "https://hn.algolia.com/api/v1"

# Search queries — each is one call. Keep ≤30 total per run.
QUERIES = [
    # pain language sweeps
    {"query": "I wish there was", "tags": "story", "min_points": 5, "max": 50},
    {"query": "is there a tool", "tags": "story", "min_points": 3, "max": 50},
    {"query": "why isn't there", "tags": "story", "min_points": 3, "max": 50},
    {"query": "frustrating", "tags": "ask_hn", "min_points": 5, "max": 50},
    {"query": "looking for a tool", "tags": "ask_hn", "min_points": 3, "max": 50},
    {"query": "would pay", "tags": "story", "min_points": 5, "max": 50},
    # Ask HN broad (filter applies post-fetch)
    {"query": "", "tags": "ask_hn", "min_points": 30, "max": 50},
    # Show HN — find launches with low traction → unmet pain near them
    {"query": "", "tags": "show_hn", "min_points": 30, "max": 30},
]

PLATFORM = "hn"


def search(q: dict) -> list[dict]:
    params = {
        "tags": q["tags"],
        "hitsPerPage": q["max"],
        "numericFilters": f"points>{q['min_points']}",
    }
    if q["query"]:
        params["query"] = q["query"]
    url = f"{ALGOLIA}/search_by_date?{urllib.parse.urlencode(params)}"
    log(f"GET {url}")
    return http_get_json(url).get("hits", [])


def to_candidate(hit: dict) -> PainCandidate | None:
    if not hit.get("objectID"):
        return None
    title = hit.get("title") or ""
    body = hit.get("story_text") or hit.get("comment_text") or ""
    if not title and not body:
        return None
    return PainCandidate(
        platform=PLATFORM,
        post_id=str(hit["objectID"]),
        title=title,
        body=body,
        author=hit.get("author") or "unknown",
        permalink=f"https://news.ycombinator.com/item?id={hit['objectID']}",
        created_utc=hit.get("created_at") or "",
        engagement=int(hit.get("num_comments") or 0) + int(hit.get("points") or 0),
        extra={"points": hit.get("points"), "num_comments": hit.get("num_comments")},
    )


def main() -> int:
    seen = load_seen(PLATFORM)
    log(f"loaded {len(seen)} previously-seen HN ids")
    written = 0
    skipped = 0
    rejected = {"dedup": 0, "filter": 0, "parse": 0}
    new_ids = set(seen)

    for q in QUERIES:
        try:
            hits = search(q)
        except Exception as e:
            log(f"  query failed: {q.get('query','(empty)')} | {e}")
            continue
        log(f"  query {q.get('query','(empty)')!r} tags={q['tags']} → {len(hits)} hits")
        for h in hits:
            cand = to_candidate(h)
            if cand is None:
                rejected["parse"] += 1
                continue
            if cand.post_id in seen:
                rejected["dedup"] += 1
                continue
            ok, reason = passes_filter(cand)
            if not ok:
                rejected["filter"] += 1
                continue
            kws = matched_positive_keywords(cand)
            path = write_raw(cand, kws)
            new_ids.add(cand.post_id)
            written += 1
            log(f"    + {path.name}")
        time.sleep(0.5)  # be polite

    save_seen(PLATFORM, new_ids)
    log(f"DONE | written={written} rejected={rejected} total_seen={len(new_ids)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
