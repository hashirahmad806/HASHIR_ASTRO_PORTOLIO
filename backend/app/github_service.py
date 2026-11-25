"""Live GitHub activity, repository metrics, and 52-week contribution heatmap service."""

from __future__ import annotations

import asyncio
import os
import re
import time
from typing import Any, Dict, List, Optional, Tuple
import httpx

GITHUB_USERNAME = "hashirahmad806"
CACHE_TTL_SECONDS = 900  # 15 minutes

_cache: Optional[Dict[str, Any]] = None
_cache_expires_at: float = 0.0


def _calculate_streaks(days: List[Dict[str, Any]]) -> Tuple[int, int]:
    """Compute longest and active contribution streaks from daily calendar cells."""
    if not days:
        return 0, 0

    sorted_days = sorted(days, key=lambda d: d["date"])
    longest = 0
    running = 0
    for day in sorted_days:
        if day.get("level", 0) > 0:
            running += 1
            if running > longest:
                longest = running
        else:
            running = 0

    # Active streak counts trailing non-zero days (allowing today to be 0 if yesterday was active)
    active = 0
    idx = len(sorted_days) - 1
    if idx >= 0 and sorted_days[idx].get("level", 0) == 0:
        idx -= 1
    while idx >= 0 and sorted_days[idx].get("level", 0) > 0:
        active += 1
        idx -= 1

    return active, longest


def _parse_contributions_html(html: str) -> Tuple[List[Dict[str, Any]], int]:
    """Extract contribution calendar cells and total yearly count from GitHub HTML."""
    days: List[Dict[str, Any]] = []
    td_matches = re.findall(r"<td([^>]+)>", html)
    for attrs in td_matches:
        if "ContributionCalendar-day" not in attrs:
            continue
        date_m = re.search(r'data-date="([^"]+)"', attrs)
        level_m = re.search(r'data-level="([^"]+)"', attrs)
        if date_m and level_m:
            level = int(level_m.group(1))
            days.append({"date": date_m.group(1), "level": level})

    days.sort(key=lambda d: d["date"])
    total_match = re.search(r"(\d+[,.]?\d*)\s+contributions?\s+in\s+the\s+last\s+year", html, re.I)
    total = int(total_match.group(1).replace(",", "").replace(".", "")) if total_match else sum(
        d["level"] for d in days
    )
    return days, total


async def fetch_github_activity(force_refresh: bool = False) -> Dict[str, Any]:
    """Fetch GitHub profile, repositories, recent push events, and contribution calendar."""
    global _cache, _cache_expires_at
    now = time.time()
    if not force_refresh and _cache is not None and now < _cache_expires_at:
        return {**_cache, "cached": True}

    token = os.getenv("GITHUB_TOKEN", "").strip()
    headers = {"User-Agent": "HashirPortfolioAPI/2.0", "Accept": "application/vnd.github+json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            profile_res, repos_res, events_res, contrib_res = await asyncio.gather(
                client.get(f"https://api.github.com/users/{GITHUB_USERNAME}", headers=headers),
                client.get(
                    f"https://api.github.com/users/{GITHUB_USERNAME}/repos?per_page=100&sort=pushed",
                    headers=headers,
                ),
                client.get(
                    f"https://api.github.com/users/{GITHUB_USERNAME}/events/public?per_page=20",
                    headers=headers,
                ),
                client.get(
                    f"https://github.com/users/{GITHUB_USERNAME}/contributions",
                    headers={"User-Agent": "Mozilla/5.0"},
                ),
            )

            profile_json = profile_res.json() if profile_res.status_code == 200 else {}
            repos_json = repos_res.json() if repos_res.status_code == 200 else []
            events_json = events_res.json() if events_res.status_code == 200 else []
            contrib_html = contrib_res.text if contrib_res.status_code == 200 else ""

        lang_counts: Dict[str, int] = {}
        for r in repos_json:
            lang = r.get("language")
            if lang:
                lang_counts[lang] = lang_counts.get(lang, 0) + 1
        total_lang = sum(lang_counts.values()) or 1
        languages = [
            {"name": k, "percentage": round((v / total_lang) * 100)}
            for k, v in sorted(lang_counts.items(), key=lambda item: item[1], reverse=True)[:5]
        ]

        latest_repos = [
            {
                "name": r.get("name"),
                "description": r.get("description") or "Active engineering repository on GitHub.",
                "language": r.get("language") or "Code",
                "stars": r.get("stargazers_count", 0),
                "forks": r.get("forks_count", 0),
                "url": r.get("html_url"),
                "pushedAt": (r.get("pushed_at") or "")[:10],
            }
            for r in repos_json[:6]
        ]

        recent_events = [
            {
                "type": ev.get("type"),
                "repo": (ev.get("repo") or {}).get("name", "").replace(f"{GITHUB_USERNAME}/", ""),
                "createdAt": (ev.get("created_at") or "")[:10],
                "url": f"https://github.com/{(ev.get('repo') or {}).get('name', GITHUB_USERNAME)}",
            }
            for ev in events_json
            if ev.get("type") in ("PushEvent", "CreateEvent", "ForkEvent")
        ][:6]

        calendar_days, total_contribs = _parse_contributions_html(contrib_html)
        active_streak, longest_streak = _calculate_streaks(calendar_days)

        payload: Dict[str, Any] = {
            "source": "github-live",
            "cached": False,
            "profile": {
                "username": profile_json.get("login", GITHUB_USERNAME),
                "name": profile_json.get("name", "Hashir Ahmad"),
                "publicRepos": profile_json.get("public_repos", 49),
                "followers": profile_json.get("followers", 3),
                "following": profile_json.get("following", 4),
                "url": profile_json.get("html_url", f"https://github.com/{GITHUB_USERNAME}"),
            },
            "stats": {
                "totalContributions": total_contribs or 248,
                "currentStreak": active_streak,
                "longestStreak": longest_streak,
                "totalRepos": profile_json.get("public_repos", 49),
            },
            "languages": languages,
            "latestRepos": latest_repos,
            "recentActivity": recent_events,
            "contributionCalendar": calendar_days[-364:] if len(calendar_days) > 364 else calendar_days,
        }
        _cache = payload
        _cache_expires_at = now + CACHE_TTL_SECONDS
        return payload
    except Exception:
        if _cache is not None:
            return {**_cache, "cached": True}
        return {
            "source": "verified-fallback",
            "cached": False,
            "profile": {
                "username": GITHUB_USERNAME,
                "name": "Hashir Ahmad",
                "publicRepos": 49,
                "followers": 3,
                "following": 4,
                "url": f"https://github.com/{GITHUB_USERNAME}",
            },
            "stats": {
                "totalContributions": 248,
                "currentStreak": 4,
                "longestStreak": 14,
                "totalRepos": 49,
            },
            "languages": [
                {"name": "JavaScript", "percentage": 46},
                {"name": "TypeScript", "percentage": 22},
                {"name": "Python / Jupyter", "percentage": 18},
                {"name": "Astro", "percentage": 14},
            ],
            "latestRepos": [],
            "recentActivity": [],
            "contributionCalendar": [],
        }
