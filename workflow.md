# AGI-OS Shared Vault — Workflow

> This file governs how all tools (Obsidian, Graphify, GBrain, AGI Dashboard, Hermes) 
> read from and write to this vault. All agents load this alongside claude.md.

---

## The Single Source of Truth

**Vault path:** `I:\My Drive\AGI-OS\` (Google Drive, synced locally on Windows)

Every tool points here. One write, every reader sees it.

| Tool | Access method |
|---|---|
| Obsidian | Direct — vault = this folder |
| Graphify | Direct — reads `[[wiki-links]]` in .md files |
| GBrain MCP | VPS: rclone `gdrive:AGI-OS/` (already configured) |
| Hermes Agent | VPS: rclone pull + systemd cron |
| AGI Dashboard | Via API Gateway → `api.digitalravagers.in/drive/*` → rclone |
| Claude Code | Direct (this machine, `I:\My Drive\AGI-OS\`) |

---

## Folder Map

```
AGI-OS/
├── claude.md          Master context — agents load this first
├── workflow.md        This file — how the vault operates
│
├── identity/          Who George is (static, rarely changes)
│   ├── core.md        Values, mission, decision principles
│   ├── mind.md        Cognitive style, working patterns
│   └── money.md       Financial context, subscriptions, goals
│
├── routing/           Decision rules for agents
│   ├── routing-table.md          Which agent handles what
│   ├── tools-and-agents.md       Full stack reference
│   ├── voicenotes-tag-registry.md Tag → project mapping
│   ├── personal-vs-work.md       Context switching rules
│   └── mind-vs-money.md          Priority framework
│
├── projects/          One folder per active project
│   └── [slug]/
│       ├── context.md            Static project brief (what, why, status)
│       └── sessions/             Session closure .md files for this project
│
├── intelligence/      Living knowledge — Hermes updates these nightly
│   ├── breakthroughs.md          Key discoveries and unlocks
│   ├── patterns.md               Recurring themes across all work
│   └── recommendations.md        Active suggestions and next moves
│
├── skills/            Playbooks for agents (SKILL.md + skill.yaml per skill)
│   └── [skill-name]/
│       ├── SKILL.md              How to execute the skill
│       └── skill.yaml            Metadata, triggers, model routing
│
├── sessions/          Cross-project session closures (date-stamped)
│   ├── _TEMPLATE.md
│   └── YYYY-MM-DD.md
│
├── voicenotes/        All voice notes — .gdoc (source) + .md (auto-converted)
│   └── YYYY-MM-DD [tags] Title.gdoc / .md
│
├── daily/             Everything that happens each day
│   ├── [YYYY-MM-DD]/            One subfolder per day (created by George)
│   │   ├── conversations/       Claude / Hermes chat exports (.md)
│   │   ├── links/               URLs, references saved that day
│   │   └── attachments/         Files, images, misc
│   └── [project-name]/          Project-specific daily work
│
└── reference/
    └── architecture.md           Live system map and endpoints
```

---

## Daily Workflow

### George's Side (capture)
1. Throughout the day: record voice notes in Voicenotes app (tagged with project tags)
2. Save conversations with Claude / Hermes to `daily/[date]/conversations/`
3. Drop links, files, attachments into `daily/[date]/`
4. No manual sorting required — Hermes handles end-of-day processing

### Voicenotes Sync (automated, n8n)
- New Voicenotes note → n8n webhook → Open Notebook (semantic index, 273+ sources)
- New .gdoc file lands in `voicenotes/` → Hermes end-of-day cron detects it
- Hermes exports .gdoc → .md via Google Docs API (see automation below)
- .md file saved alongside .gdoc with same name
- GBrain re-indexes the new .md on next ingest cycle

### Hermes End-of-Day Processing (midnight IST cron)
For each new file in `daily/[today]/` and `voicenotes/`:
1. Convert .gdoc → .md if not already done
2. Extract structured knowledge: decisions, patterns, breakthroughs, next actions
3. Append to `intelligence/patterns.md`, `intelligence/breakthroughs.md` if relevant
4. Write session closure to `sessions/YYYY-MM-DD.md`
5. Push to GitHub (hermes-workspace) + rclone sync to Drive
6. GBrain re-indexes new/updated files

---

## .gdoc → .md Automation

### How it works
Hermes's midnight cron runs a conversion step before indexing:

```bash
# On VPS — part of hermes end-of-day skill
# Uses rclone to export Google Docs as plain text (Markdown-compatible)
rclone copy "gdrive:AGI-OS/voicenotes/" /tmp/vn-export/ \
  --drive-export-formats "md" \
  --include "*.gdoc" \
  --no-update-modtime

# Then copy exported .md files back to Drive alongside originals
rclone copy /tmp/vn-export/ "gdrive:AGI-OS/voicenotes/" \
  --include "*.md" \
  --no-update-modtime
```

**rclone flag used:** `--drive-export-formats "md"` — when rclone encounters a .gdoc, 
it exports it as Markdown automatically. No Google Docs API key needed separately 
(uses the existing rclone OAuth token).

### Manual fallback (for now, until automation is live)
For any new .gdoc note you want immediately available in Obsidian:
- Google Docs → File → Download → Markdown (.md)
- Save to same folder as the .gdoc with the same filename

---

## File Naming Convention

All files in this vault use the following frontmatter:

```yaml
---
title: "Short descriptive title"
date: YYYY-MM-DD
type: session | identity | pattern | skill | reference | voicenote | daily
project: rhynia | agi-os | botsify | digital-ravagers | red-unicorn | personal
tags: [#tag1, #tag2]
source: george | hermes | claude | voicenotes | n8n
---
```

Voice note files follow the existing naming pattern: `YYYY-MM-DD [tags] Title.md`

---

## Agent Loading Order

When any agent starts a task, load in this order:
1. `claude.md` — who George is and what we're building
2. `workflow.md` — this file, how the vault operates
3. `routing/routing-table.md` — which agent handles what
4. `projects/[relevant-project]/context.md` — project-specific context
5. `intelligence/patterns.md` + `intelligence/recommendations.md` — current state

---

## API Gateway File Bridge (AGI Dashboard access)

AGI Dashboard (Vercel, no disk access) reads/writes vault files via:

```
GET  https://api.digitalravagers.in/drive/read?path=AGI-OS/projects/rhynia/context.md
POST https://api.digitalravagers.in/drive/write
     Body: { "path": "AGI-OS/sessions/2026-06-13.md", "content": "..." }
```

These routes call `rclone cat` / `rclone rcat` on the VPS using the existing 
OAuth token at `/home/hermes/.config/rclone/rclone.conf`.
