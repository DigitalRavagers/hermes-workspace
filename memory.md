# George's Current Project State (Jun 2026)

## This VPS Stack (/opt/agi-stack/)
- **Open Notebook 1.9.0** — https://notebook.digitalravagers.in (Next.js UI), API localhost:5055
  - 273 VoiceNote sources, 4752 embedding chunks (Gemini 2.5 Flash via Kilo Code)
  - Master notebook: notebook:natcr8xz1kv2exfayuyt
  - Ask API: POST http://localhost:5055/api/search/ask/simple
  - Public ask: POST https://api.digitalravagers.in/search {"query":"...","type":"ask"}
  - Esperanto embedding patch: /opt/agi-stack/data/notebooks/entrypoint.sh
- **n8n** — https://automation.digitalravagers.in (automation.digitalravagers.in)
  - API key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (hermes-automation, no expiry)
  - VoiceNotes daily sync workflow active
- **API Gateway (FastAPI)** — https://api.digitalravagers.in (/opt/api-gateway/main.py)
  - /search (ask + text), /trigger, /notify, /health, /webhook/{path}
- **SurrealDB** — internal only, port 8000, migration v14

## AGI Dashboard (Cloud — Vercel)
- URL: https://agi-dashboard-v2.vercel.app
- Supabase ref: utuwsfqssuwkgmgyigwx
- MCP: https://agi-dashboard-v2.vercel.app/api/mcp, Bearer 279d839265010dc0a7533e87bb29386c1c642ed6d11f6c7f
- 11 MCP tools: search_memory, save_memory, create_item, list_items, get_voice_notes, get_projects, list_skills, load_skill, register_connection, sync_connection, get_architecture
- Telegram Brain Bot: @GeorgeAGIBrainBot wired to /api/telegram/webhook
- Daily nudge cron: 8:00 AM IST via /api/cron/daily-nudge

## Rhynia (Cloud — Vercel)
- URL: https://web.rhynia.app
- Supabase ref: dwiajhgpbqxmvpraoffq
- MCP: https://web.rhynia.app/api/mcp, Bearer rhy_live_ea3732a993e6007ecbcc2d4f8d8ef4914bfde588fcf6c009934dc037b1017729
- Status: Live. Stage 2 UX done. Stage 3 (monetisation UI) next.
- PayPal: Monthly $19, Annual $149, LTD $299

## Hermes MCPs (Connected)
- AGI Dashboard brain: 11 tools
- Rhynia: 17 tools

## Key API Credentials
- **Kilo Code (OPENAI_API_KEY):** JWT in /opt/agi-stack/.env — base https://api.kilo.ai/api/gateway
- **OpenRouter:** sk-or-v1-fa23b579... in .env
- **Moonshot/Kimi K2:** api.moonshot.ai/v1 (international endpoint only)

## Current Priorities (Jun 2026)
1. Botsify — George's main job, full-time focus
2. Rhynia — Stage 3 monetisation UI, then Stage 4 Agent
3. AGI OS wiring — Hermes ↔ Open Notebook ↔ AGI Dashboard tight integration
4. Red Unicorn — stealth, early stage

## GitHub Workspace (LIVE)
- Repo: https://github.com/DigitalRavagers/hermes-workspace
- Auto-sync: /home/hermes/bin/hermes-sync.sh (every 4h + nightly via jobs.json)
- Contents: soul.md, user.md, memory.md, jobs.json, skills/, AGI-OS/
- PAT stored: /home/hermes/.hermes/.github_token (not tracked by git)

## GBrain (Installed)
- Location: /home/hermes/gbrain/ (v0.42.38.0, Bun-powered)
- Data: /home/hermes/gbrain-data/ (PGLite, embedded Postgres)
- Config: /home/hermes/gbrain/.env (Kilo Code API, Gemini 2.5 Flash)
- CLI: cd /home/hermes/gbrain && bun run src/cli.ts <command>
- Key commands: init, ask, search, query, import, sync, doctor
- Adds: knowledge graph + synthesis layer on top of Open Notebook
