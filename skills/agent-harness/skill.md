---
name: agent-harness
description: Control the AGI Dashboard as the unified agent harness — any agent reads/writes through here
triggers:
  - "use the agent harness"
  - "log to AGI dashboard"
  - "create task in AGI"
  - "update project status"
  - "save to brain"
  - "morning digest"
  - "end of day recap"
---

# AGI Dashboard — Agent Harness

The AGI Dashboard is the unified control plane. ALL agents (Hermes, Claude Code, future agents)
read and write through this interface. No parallel data stores — one source of truth.

## MCP Endpoint
```
URL:  https://agi-dashboard-v2.vercel.app/api/mcp
Auth: Bearer 279d839265010dc0a7533e87bb29386c1c642ed6d11f6c7f
```

## Tool Reference (11 tools)

### READ
- `search_memory` — semantic search: `{"query": "...", "limit": 10}`
- `list_items` — `{"type": "task|idea|note", "status": "inbox|active"}`
- `get_projects` — all projects with context
- `get_voice_notes` — synced voice notes
- `get_architecture` — live system map with counts
- `list_skills` — available AGI skills
- `load_skill` — `{"slug": "skill-name"}`

### WRITE
- `save_memory` — `{"content": "...", "tags": ["tag1"], "type": "note|insight"}`
- `create_item` — `{"title": "...", "type": "task", "description": "...", "project_slug": "..."}`
- `log_intelligence` — `{"content": "...", "type": "pattern|breakthrough|recommendation"}`
- `register_connection` — add new integration
- `sync_connection` — trigger a connection sync

## Standard Workflows

### Morning Digest (runs 8 AM IST via cron)
1. `list_items` → get open tasks
2. `search_memory` query:"yesterday" → context
3. `get_voice_notes` → overnight captures
4. Synthesise → Telegram George: priorities for the day

### End-of-Day Recap
1. `list_items` status=completed → what got done
2. `save_memory` → capture session summary
3. Write to AGI-OS/sessions/YYYY-MM-DD.md
4. `hermes-sync.sh` → push to GitHub + Drive

### Capture & Route
When George sends a Voicenote or Telegram message:
1. `save_memory` with content + tags
2. If it contains a task → `create_item`
3. If it's an insight → `log_intelligence`
4. Route to correct project via get_projects

## Agent Interop Protocol
Any agent working in this system:
1. Reads `AGI-OS/claude.md` for context
2. Reads `AGI-OS/projects/[slug]/context.md` for project specifics
3. Writes session summary to `AGI-OS/projects/[slug]/sessions/YYYY-MM-DD-[block].md`
4. Calls `hermes-sync.sh` after writing
5. Sends completion Telegram to George (chat_id 1883986773)
