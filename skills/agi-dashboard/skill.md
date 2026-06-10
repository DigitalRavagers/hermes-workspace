---
name: agi-dashboard
description: Read and write to George's AGI Dashboard brain via MCP — projects, memory, items, intelligence
triggers:
  - "add to my brain"
  - "check my projects"
  - "save this to memory"
  - "search memory"
  - "create a task"
  - "log intelligence"
---

# AGI Dashboard Brain MCP

George's personal single source of truth. All projects, tasks, memories, intelligence logs.

## MCP Connection
URL: https://agi-dashboard-v2.vercel.app/api/mcp
Auth: Bearer 279d839265010dc0a7533e87bb29386c1c642ed6d11f6c7f

## Available Tools (11)
- search_memory — semantic search across memory entries
- save_memory — save new memory entry with tags
- create_item — create task/idea/note in inbox
- list_items — list items by type/status/project
- get_voice_notes — retrieve synced voice notes
- get_projects — list George's projects with context
- list_skills — list available AGI skills
- load_skill — load skill content by slug
- register_connection — add a new integration
- sync_connection — trigger a connection sync
- get_architecture — live system map with counts

## Projects (George's active)
- Botsify (top priority, full-time job)
- Rhynia (daily planner SaaS, live)
- Digital Ravagers Inc. (DRIN, holding)
- Red Unicorn (stealth)
- AGI OS (this ecosystem)
- Creative Grooves Inc. (music)

## Telegram Delivery
Send to George: POST api.telegram.org/bot{token}/sendMessage
chat_id: 1883986773
