---
name: notebooklm-direct
description: Direct NotebookLM API integration without browser auth. Use to list notebooks, create notebooks, add sources, chat, and generate artifacts. Works with Google's existing session via cookies/token.
homepage: https://notebooklm.google.com
metadata:
  openclaw:
    emoji: "📓"
    requires:
      env:
        - NOTEBOOKLM_COOKIE
---

# NotebookLM Direct API

Direct HTTP API integration with NotebookLM. No browser automation needed — works with your existing Google session.

## Authentication

**Option 1: Cookie from browser (easiest)**
1. Open notebooklm.google.com in your browser (logged in)
2. DevTools → Application → Cookies
3. Copy the value of `__Secure-1PSID` or `SSID` cookie
4. Set environment variable: `export NOTEBOOKLM_COOKIE="your_cookie_value"`

**Option 2: Auth token from local NotebookLM CLI**
If you've used `notebooklm login` locally, copy `~/.notebooklm/storage-state.json`

## API Endpoints (Internal)

NotebookLM uses internal Google APIs. Key endpoints:

```
Base: https://notebooklm.google.com/api/v1

GET  /notebooks              - List notebooks
POST /notebooks              - Create notebook
GET  /notebooks/{id}         - Get notebook details
POST /notebooks/{id}/sources - Add source
POST /notebooks/{id}/chat    - Send message
```

## Scripts

Use the wrapper script for common operations:

```bash
# List notebooks
node ~/.openclaw/workspace/skills/notebooklm-direct/scripts/notebooklm-api.mjs list

# Create notebook
node ~/.openclaw/workspace/skills/notebooklm-direct/scripts/notebooklm-api.mjs create "My Research"

# Add text source
node ~/.openclaw/workspace/skills/notebooklm-direct/scripts/notebooklm-api.mjs add-source <notebook-id> \
  --title "VoiceNotes Summary" \
  --content "Paste content here"

# Add Google Drive file
node ~/.openclaw/workspace/skills/notebooklm-direct/scripts/notebooklm-api.mjs add-drive <notebook-id> \
  --file-id "1ABC..." \
  --title "Document"

# Chat
node ~/.openclaw/workspace/skills/notebooklm-direct/scripts/notebooklm-api.mjs chat <notebook-id> \
  "Summarize the key insights"

# Generate artifact
node ~/.openclaw/workspace/skills/notebooklm-direct/scripts/notebooklm-api.mjs generate <notebook-id> \
  --type briefing \
  --prompt "Create an executive summary"
```

## Quick Start

1. Get your cookie from browser
2. Export it: `export NOTEBOOKLM_COOKIE="..."`
3. Test: `node scripts/notebooklm-api.mjs list`

## Limitations

- Uses internal APIs (may change without notice)
- Rate limited by Google
- Some features may require specific Google account permissions
