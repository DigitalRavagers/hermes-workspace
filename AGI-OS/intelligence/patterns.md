# Patterns

> Recurring observations about George's work, decisions, and system behavior.

## Work Patterns
- Voice notes are George's primary capture method — everything important is in Voicenotes first
- Morning = priorities. He responds best to async nudges at 8-9 AM IST.
- Deep work sessions happen in Claude Code; async monitoring in Hermes Telegram

## System Patterns
- Container restarts lose in-memory patches — always use mounted entrypoint.sh
- Next.js NEXT_PUBLIC_* vars baked at build time — runtime env overrides don't work
- SurrealDB migrations must be run after every container recreate

---
*Hermes: append new patterns here with date*
