"""
GitHub Issues pull · 2026-04-28
- Auth: GitHub Personal Access Token (PAT) — set GITHUB_PAT in .env or env
- Rate limit: 5K req/h authenticated, 60/h unauthenticated
- Strategy: search issues with high reactions ("+1") in active repos → unmet feature need
- Writes to 02_raw/_inbox/
- Dedup: _state/seen_gh.json
"""
from __future__ import annotations
import os
import time
import urllib.parse
from pathlib import Path
from _lib import (
    PainCandidate, http_get_json, load_seen, save_seen,
    passes_filter, write_raw, matched_positive_keywords, log,
)

API = "https://api.github.com"
PLATFORM = "gh"

# Search queries — uses GitHub issue search syntax
# https://docs.github.com/en/search-github/searching-on-github/searching-issues-and-pull-requests
QUERIES = [
    'is:issue is:open reactions:>20 sort:reactions-+1-desc',
    'is:issue is:open "I wish there was" sort:reactions-+1-desc',
    'is:issue is:open "feature request" reactions:>10 sort:reactions-+1-desc',
    'is:issue is:open "would pay" sort:reactions-+1-desc',
    'is:issue is:open "no good way" sort:reactions-+1-desc',
    'is:issue is:open "is there a way" reactions:>5 sort:reactions-+1-desc',
]

PAGES_PER_QUERY = 1   # 30 results/page, 1 page = 30 hits per query → 6 queries × 30 = 180 max


def _read_env_file() -> dict[str, str]:
    """Lightweight .env parser; only reads PAT for now."""
    repo_root = Path(__file__).resolve().parents[3]
    env_path = repo_root / ".env"
    out = {}
    if env_path.exists():
        for line in env_path.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, _, v = line.partition("=")
            out[k.strip()] = v.strip().strip('"').strip("'")
    return out


def get_token() -> str | None:
    return os.environ.get("GITHUB_PAT") or _read_env_file().get("GITHUB_PAT")


def search(query: str, page: int = 1, token: str | None = None) -> list[dict]:
    params = {"q": query, "per_page": 30, "page": page}
    url = f"{API}/search/issues?{urllib.parse.urlencode(params)}"
    headers = {
        "User-Agent": "ai_reddit_pain_miner/0.1",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    if token:
        headers["Authorization"] = f"Bearer {token}"
    log(f"GET {url}")
    return http_get_json(url, headers=headers).get("items", [])


def to_candidate(item: dict) -> PainCandidate | None:
    issue_id = item.get("id")
    if not issue_id:
        return None
    repo = item.get("repository_url", "").split("/repos/")[-1]
    reactions = item.get("reactions", {}) or {}
    return PainCandidate(
        platform=PLATFORM,
        post_id=str(issue_id),
        title=item.get("title", ""),
        body=item.get("body", "") or "",
        author=(item.get("user") or {}).get("login", "unknown"),
        permalink=item.get("html_url", ""),
        created_utc=item.get("created_at", "").replace("+00:00", "Z"),
        engagement=int(reactions.get("+1", 0)) + int(item.get("comments", 0)),
        extra={
            "repo": repo,
            "reactions_plus_one": reactions.get("+1", 0),
            "comments": item.get("comments", 0),
            "state": item.get("state"),
            "labels": [l.get("name") for l in (item.get("labels") or [])],
        },
    )


def main() -> int:
    token = get_token()
    if not token:
        log("[WARN] GITHUB_PAT not set -- running unauthenticated (60 req/h limit)")
        log("       Generate one at: https://github.com/settings/tokens (no scope needed for public read)")
    else:
        log(f"using GitHub PAT ending in ...{token[-4:]}")

    seen = load_seen(PLATFORM)
    log(f"loaded {len(seen)} previously-seen GH ids")
    written = 0
    rejected = {"dedup": 0, "filter": 0, "parse": 0}
    new_ids = set(seen)

    for q in QUERIES:
        for page in range(1, PAGES_PER_QUERY + 1):
            try:
                hits = search(q, page=page, token=token)
            except Exception as e:
                log(f"  query failed: {q} | {e}")
                # Likely rate limit if unauth; bail early to avoid hammering
                if "rate limit" in str(e).lower() or "403" in str(e):
                    log("  rate limited — stopping early")
                    save_seen(PLATFORM, new_ids)
                    return 1
                continue
            log(f"  query {q[:60]!r} page {page} → {len(hits)} hits")
            for item in hits:
                cand = to_candidate(item)
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
            time.sleep(1)   # GH search has stricter limit (30/min for search)

    save_seen(PLATFORM, new_ids)
    log(f"DONE | written={written} rejected={rejected} total_seen={len(new_ids)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
