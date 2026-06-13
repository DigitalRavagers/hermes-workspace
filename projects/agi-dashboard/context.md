# Project — AGI Dashboard

## What it is
George's personal "single brain" — Next.js 16 + React 19 + Supabase, live at
agi-dashboard-v2.vercel.app. Separate from Rhynia (the SaaS). This is where George and the AGI
collaborate, track everything, and the AGI operates on his behalf.

## Current state (2026-06-03)
- **Auth + RLS**: locked down, email/password login (georgejohn@digitalravagers.in).
- **Sections live**: Inbox, Projects, Agents, Memory, Intelligence, Architecture, Connections, Chat.
- **Chat = full operator**: reads inbox/memory/projects/agents/intelligence/connections/architecture;
  skills loop (list/load/create); acts (create/update items, create memory, log intelligence,
  sync voicenotes). Default model kilo-auto/free.
- **Voicenotes sync**: works via OpenClaw integration REST API (raw key). Writes to memory + inbox,
  deduped. Auto-syncs daily 02:00 UTC via cron; also "sync my notes" in chat.
- **Connections**: Voicenotes + Notion active; edit/delete on all. MCP brain server at /api/mcp.
- **Intelligence page**: now renders stored intelligence_logs (breakthroughs/patterns/recommendations).

## Architecture (three layers)
1. Supabase = live state (system of record, owned).
2. AGI-OS/ files (this folder) = compressed durable meaning; AGI reads these for context.
3. Google Drive sync of AGI-OS/ = portable sovereign backup.

## Next checkpoints
- Wire Klavis Google Drive → sync AGI-OS/ up (needs George's OAuth click).
- Session-export pipeline: after each chat block, auto-write a session file here + feed intelligence.
- Wire Hermes + OpenClaw to /api/mcp.
- UI polish toward BentoBoard look.

## Key refs
- Repo: github.com/DigitalRavagers/agi-dashboard-v2
- Supabase project ref: utuwsfqssuwkgmgyigwx
- Sessions: `./sessions/` · Skills: `./skills/`
