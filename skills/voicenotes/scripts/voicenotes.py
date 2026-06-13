#!/usr/bin/env python3
"""Voicenotes API client for the voicenotes skill.

Wraps the Voicenotes "open-claw" integration API. Stdlib only (urllib), so it
runs anywhere Python 3 is installed with no pip install required.

Auth token resolution order:
  1. --token CLI flag
  2. VOICENOTES_API_KEY environment variable
  3. auth_token.txt sitting next to this script's parent skill dir

Usage:
  python voicenotes.py search "what did I say about the rhynia launch"
  python voicenotes.py recordings --tags work ideas --start 2026-05-01 --end 2026-06-01
  python voicenotes.py get <recording_uuid>
  python voicenotes.py create "Remember to email George about the demo"

All output is JSON printed to stdout. On error, a JSON object with an "error"
key is printed and the exit code is non-zero.
"""

import argparse
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

BASE_URL = "https://api.voicenotes.com/api/integrations/open-claw"
UUID_RE = re.compile(r"^[a-zA-Z0-9]{8}$")
TOKEN_FILENAME = "auth_token.txt"


def resolve_token(cli_token: str | None) -> str:
    if cli_token:
        return cli_token.strip()
    env = os.environ.get("VOICENOTES_API_KEY")
    if env:
        return env.strip()
    # auth_token.txt lives in the skill root (parent of this scripts/ dir)
    token_path = Path(__file__).resolve().parent.parent / TOKEN_FILENAME
    if token_path.exists():
        return token_path.read_text(encoding="utf-8").strip()
    raise SystemExit(
        json.dumps({
            "error": "No auth token found. Pass --token, set VOICENOTES_API_KEY, "
                     f"or create {token_path}."
        })
    )


def request(method: str, path: str, token: str, body: dict | None = None) -> dict:
    url = BASE_URL + path
    data = None
    # Voicenotes sits behind Cloudflare, which bans the default urllib
    # user-agent (error 1010). Present a normal browser-style UA.
    headers = {
        "Authorization": token,
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                      "AppleWebKit/537.36 (KHTML, like Gecko) "
                      "Chrome/124.0.0.0 Safari/537.36",
    }
    if body is not None:
        data = json.dumps(body).encode("utf-8")
        headers["Content-Type"] = "application/json"
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            raw = resp.read().decode("utf-8")
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", errors="replace")
        return {"error": f"HTTP {e.code}", "detail": _maybe_json(detail), "url": url}
    except urllib.error.URLError as e:
        return {"error": "connection_failed", "detail": str(e.reason), "url": url}
    return _maybe_json(raw)


def _maybe_json(raw: str):
    try:
        return json.loads(raw)
    except (json.JSONDecodeError, ValueError):
        return raw


def to_utc_timestamp(date_str: str) -> str:
    """Accept YYYY-MM-DD or a full ISO string, return a UTC ISO timestamp."""
    s = date_str.strip()
    try:
        if len(s) == 10:
            dt = datetime.strptime(s, "%Y-%m-%d").replace(tzinfo=timezone.utc)
        else:
            dt = datetime.fromisoformat(s.replace("Z", "+00:00"))
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
    except ValueError:
        raise SystemExit(json.dumps({"error": f"Bad date: {date_str!r}. Use YYYY-MM-DD."}))
    return dt.astimezone(timezone.utc).isoformat()


def cmd_search(args, token):
    if not args.query.strip():
        return {"error": "Empty search query."}
    q = urllib.parse.quote(args.query, safe="")
    return request("GET", f"/search/semantic?query={q}", token)


def cmd_recordings(args, token):
    body: dict = {}
    if args.tags:
        body["tags"] = args.tags
    if args.start or args.end:
        if not (args.start and args.end):
            return {"error": "Provide both --start and --end for a date range."}
        body["date_range"] = [to_utc_timestamp(args.start), to_utc_timestamp(args.end)]
    return request("POST", "/recordings", token, body=body)


def cmd_get(args, token):
    uuid = args.uuid.strip()
    if not UUID_RE.match(uuid):
        return {"error": f"Invalid recording UUID {uuid!r}. Expected 8 alphanumeric chars."}
    return request("GET", f"/recordings/{uuid}", token)


def cmd_create(args, token):
    if not args.transcript.strip():
        return {"error": "Cannot create an empty note."}
    body = {
        "recording_type": 3,
        "transcript": args.transcript,
        "device_info": "open-claw",
    }
    return request("POST", "/recordings/new", token, body=body)


def main():
    # Notes can contain emoji / non-Latin chars; the Windows console defaults to
    # cp1252 and would crash on them. Force UTF-8 output.
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except (AttributeError, ValueError):
        pass
    parser = argparse.ArgumentParser(description="Voicenotes API client")
    parser.add_argument("--token", help="Auth token (overrides env / file)")
    sub = parser.add_subparsers(dest="command", required=True)

    p = sub.add_parser("search", help="Semantic search across notes")
    p.add_argument("query")
    p.set_defaults(func=cmd_search)

    p = sub.add_parser("recordings", help="List recordings, optionally filtered")
    p.add_argument("--tags", nargs="*", help="Filter by tag names")
    p.add_argument("--start", help="Range start (YYYY-MM-DD, UTC)")
    p.add_argument("--end", help="Range end (YYYY-MM-DD, UTC)")
    p.set_defaults(func=cmd_recordings)

    p = sub.add_parser("get", help="Fetch a full transcript by UUID")
    p.add_argument("uuid")
    p.set_defaults(func=cmd_get)

    p = sub.add_parser("create", help="Create a new text note")
    p.add_argument("transcript")
    p.set_defaults(func=cmd_create)

    args = parser.parse_args()
    token = resolve_token(args.token)
    result = args.func(args, token)
    print(json.dumps(result, indent=2, ensure_ascii=False))
    if isinstance(result, dict) and "error" in result:
        sys.exit(1)


if __name__ == "__main__":
    main()
