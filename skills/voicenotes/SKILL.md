---
name: voicenotes
description: >-
  Fetch, search, and create notes and meeting transcripts from the user's
  Voicenotes account. Use this skill WHENEVER the user wants to look something
  up from their Voicenotes, recall what they said or recorded, find a past
  voice note or meeting, search their notes by topic, list recent recordings,
  pull a full transcript, or save a new text note. Trigger on phrases like
  "what did I say about X in my notes", "find my voice note about Y", "search
  my Voicenotes", "pull up my meeting from last week", "what's in my recent
  recordings", "check my notes", or "add a note to Voicenotes" — even when the
  user just says "my notes" or "my meetings" without naming Voicenotes
  explicitly, if Voicenotes is their notes source.
---

# Voicenotes

Read and write the user's Voicenotes account through the official "open-claw"
integration API. A bundled Python script (`scripts/voicenotes.py`, stdlib only)
handles auth, URL-encoding, UUID validation, and JSON parsing so you don't have
to hand-build HTTP requests.

## Authentication

The script resolves the auth token in this order: `--token` flag →
`VOICENOTES_API_KEY` env var → `auth_token.txt` in the skill root. For this
install the token lives in `auth_token.txt` next to this file, so you normally
pass nothing. If a call returns `HTTP 401`/`403`, the token is missing or
expired — tell the user and ask them to regenerate it at
`https://voicenotes.com/app?open-claw=true#settings`.

## How to use it

Run the script with the Bash tool. It always prints JSON to stdout; on failure
it prints `{"error": ...}` and exits non-zero. Pick the command that matches
what the user is after:

**Search by topic / meaning** — the default for "find / recall / what did I say
about…". Semantic, so natural-language queries work well:
```bash
python "C:/Users/George/.claude/skills/voicenotes/scripts/voicenotes.py" search "decisions from the rhynia kickoff"
```
Returns results ordered by relevance. Each has a `type`:
- `note` — a complete matching note (has its own `uuid`, fetchable).
- `note_split` — a relevant chunk of a larger note; use its `uuid` with `get`
  to read the whole thing.
- `import_split` — a chunk of an imported file; **cannot** be fetched
  individually, so present it as-is.

**List recordings, optionally filtered** — for "show my recent notes",
"meetings from last week", "notes tagged work":
```bash
python ".../voicenotes.py" recordings
python ".../voicenotes.py" recordings --tags work ideas
python ".../voicenotes.py" recordings --start 2026-05-01 --end 2026-06-01
```
Paginated, ~10 per page. Dates are UTC; pass `--start` and `--end` together.

**Get a full transcript** — when you have a recording's 8-char identifier and
need the whole thing (e.g. after a search returned a `note_split`). Note: the
identifier is the `id` field on `recordings`/`get` records and the `uuid` field
on `search` results — pass whichever is present:
```bash
python ".../voicenotes.py" get a1B2c3D4
```
Returns the full note. `recording_type`: 1 = voice note, 2 = meeting, 3 = text.
Meeting transcripts include `[HH:MM:SS] Speaker N:` timestamps and a `duration`
in milliseconds.

**Create a text note** — only when the user explicitly asks to save/add a note:
```bash
python ".../voicenotes.py" create "Follow up with George on the demo Friday"
```

## Working effectively

- **Lead with search.** Most "what did I…" / "find my…" requests are semantic
  searches, not list-and-scan. Search first, then `get` the full note only if
  the user needs more than the returned snippet.
- **Transcripts may contain HTML** formatting in the `transcript` field. Strip
  or render it sensibly when summarizing back to the user; don't dump raw tags.
- **Summarize, don't dump.** These notes are personal and can be long. Give the
  user the answer plus the source note's title/date, and offer to pull the full
  transcript rather than pasting everything.
- **Respect the rate limit** (~3 requests/second). Don't fan out dozens of
  parallel `get` calls; fetch what you need.
- **Pass user text verbatim** as the script argument — it handles encoding.
  Don't pre-escape or modify the query/transcript yourself.
- The token is a secret. Never print `auth_token.txt`, never echo the token in
  a command, and never include it in output shown to the user.
