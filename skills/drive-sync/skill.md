---
name: drive-sync
description: Sync AGI-OS folder to Google Drive — backup all operational data
triggers:
  - "sync to drive"
  - "backup to drive"
  - "push to google drive"
  - "drive sync"
---

# Google Drive Sync

George's Google Drive is the sovereign backup layer. Every session log, context file,
and intelligence update is mirrored there for daily physical backup.

## Status
- rclone: installed on VPS
- Remote name: gdrive (once configured)
- Sync path: /home/hermes/hermes-workspace/AGI-OS/ → gdrive:AGI-OS/

## Run Sync
```bash
/home/hermes/bin/hermes-sync.sh
```
This does: copy .hermes → workspace → git commit → git push → rclone sync to Drive

## Manual Drive-Only Sync
```bash
rclone sync /home/hermes/hermes-workspace/AGI-OS/ gdrive:AGI-OS/ --progress
```

## Setup Status (one-time, needs George)
rclone needs to be authorized for Drive. Run on VPS:
```bash
rclone config
# Choose: n (new remote), name: gdrive, type: drive
# Follow OAuth flow — or use existing token from AGI Dashboard
```

## Folder Structure on Drive
```
AGI-OS/
├── claude.md           ← master context (load this first)
├── identity/
├── routing/
├── projects/
│   ├── botsify/
│   ├── rhynia/
│   ├── digital-ravagers/
│   ├── red-unicorn/
│   └── agi-os/
├── intelligence/
├── skills/
├── sessions/
└── reference/
```
