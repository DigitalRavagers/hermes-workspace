# AGI OS — Project Context

**Status:** Phase 4 complete, continuous evolution

## What's Live
- VPS stack: Open Notebook 1.9.0, n8n, API Gateway, SurrealDB, Nginx+SSL
- Second Brain: 273 sources, 4752 embeddings, live ask API
- AGI Dashboard: agi-dashboard-v2.vercel.app (MCP server, Telegram bot, chat agent)
- Hermes: 24/7 agent, wired to AGI Dashboard + Rhynia MCPs

## Next Phase
- GitHub sync for Hermes workspace (this repo)
- Google Drive sync (daily backup, rclone)
- GBrain integration with Open Notebook
- Voicenotes webhook → n8n → Open Notebook pipeline tighter integration

## Architecture Decision: Hybrid Source of Truth
Layer 1: Supabase (live state — AGI Dashboard DB)
Layer 2: This repo (session .md files — compressed meaning)
Layer 3: Google Drive (daily physical backup sync of this repo)
