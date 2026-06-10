# AGI OS — Master Context for AI Agents

> Load this file first. It tells you who George is, what we're building, and how to operate.

## Identity
George John (@Georgex17) — founder, builder. Runs Digital Ravagers Inc. (DRIN). Based in India (IST = UTC+5:30).

## The Mission
Build a personal AGI OS: a sovereign, self-improving ecosystem of agents, data, and automation.
Full data sovereignty — all data lives here (VPS + Drive + GitHub), no vendor lock-in.

## The Stack (as of Jun 2026)
- **Capture:** Voicenotes (lifetime) + Notion + Email + WhatsApp
- **Brain:** Supabase (source of truth) + Open Notebook (semantic search, 273 sources, 4752 chunks)
- **Action:** Hermes (24/7 VPS agent) + n8n (orchestration) + API Gateway + Claude Code (deep work)
- **Dashboard:** AGI Dashboard v2 (agi-dashboard-v2.vercel.app) — the control plane

## Active Projects (priority order)
1. **Botsify** — George's full-time job, top priority
2. **Rhynia** — daily planner SaaS (web.rhynia.app), Stage 3 monetisation next
3. **Digital Ravagers Inc.** — AI agency / holding company
4. **Red Unicorn** — stealth product, early stage
5. **AGI OS** — this ecosystem (always running in background)
6. **Creative Grooves Inc.** — music ventures (Suno Pro)

## Key Endpoints (agents can call these)
- Second Brain Ask: POST https://api.digitalravagers.in/search {"query":"...", "type":"ask"}
- AGI Dashboard MCP: https://agi-dashboard-v2.vercel.app/api/mcp (Bearer 279d839265010dc0a7533e87bb29386c1c642ed6d11f6c7f)
- Rhynia MCP: https://web.rhynia.app/api/mcp (Bearer rhy_live_ea3732a993e6007ecbcc2d4f8d8ef4914bfde588fcf6c009934dc037b1017729)
- n8n API: https://automation.digitalravagers.in (API key in Hermes vault)
- Telegram George: chat_id 1883986773

## Folder Convention (this repo)
- `identity/` — who George is, his mind, his money situation
- `routing/` — how to route tasks, tools, agents
- `projects/[slug]/context.md` — live project brief
- `projects/[slug]/sessions/` — daily session logs (YYYY-MM-DD-[block].md)
- `intelligence/` — patterns, breakthroughs, recommendations Hermes surfaces
- `skills/` — reusable playbooks (same as Hermes skills)
- `reference/architecture.md` — live system map
- `sessions/` — cross-project daily digests

## Session Log Format
Each session file: `YYYY-MM-DD-[project]-[block].md`
Sections: Objective / Context Used / Decisions Made / Artifacts Created / What to Remember / Next Checkpoint

## Agent Rules
1. Never expose credentials in session logs or intelligence files
2. Sync this repo to Google Drive after every write
3. Telegram George before doing anything irreversible
4. When in doubt, ask → don't assume
