# System Architecture Reference

## VPS (185.255.93.254 — Rabisu, $8/mo)
```
/opt/agi-stack/               Docker Compose stack
  ├── open-notebook:1.9.0    Next.js UI :8502 | API :5055 | SurrealDB :8000
  ├── n8n:2.25.6             Automation :5678
  └── surrealdb:2            DB (internal only)

/opt/api-gateway/             FastAPI :4000 (systemd)
  ├── /health /status
  ├── /search (ask+text → Open Notebook)
  ├── /trigger → n8n
  ├── /notify → Telegram
  └── /webhook/{path} → n8n proxy

/home/hermes/                 Hermes agent (systemd)
  ├── .hermes/               memory + skills
  └── hermes-workspace/      git-tracked workspace (→ GitHub + Drive)
```

## Cloud
```
AGI Dashboard (Vercel)        agi-dashboard-v2.vercel.app
  └── Supabase utuwsfqssuwkgmgyigwx
  └── /api/mcp               11 tools (agent harness)
  └── /api/telegram/webhook  Brain bot @GeorgeAGIBrainBot

Rhynia (Vercel)               web.rhynia.app
  └── Supabase dwiajhgpbqxmvpraoffq
  └── /api/mcp               17 tools
```

## Nginx (SSL via Certbot, expires 2026-09-07)
```
notebook.digitalravagers.in  → :8502 (Next.js) + /api/ → :5055
automation.digitalravagers.in → :5678
webhook.digitalravagers.in   → :5678
api.digitalravagers.in       → :4000
```

## Data Flow
VoiceNotes → n8n (daily sync) → Open Notebook (SurrealDB)
                                      ↓
                              API Gateway /search
                                      ↓
                              Hermes / Claude Code / AGI Dashboard
