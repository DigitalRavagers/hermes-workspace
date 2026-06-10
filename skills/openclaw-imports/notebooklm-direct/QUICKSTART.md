# NotebookLM Direct - Quick Start

## Step 1: Get Your Cookie (One-time setup)

**Chrome:**
1. Open https://notebooklm.google.com (make sure you're logged in)
2. Press `F12` → DevTools opens
3. Click `Application` tab (top)
4. Left sidebar → `Storage` → `Cookies` → `https://notebooklm.google.com`
5. Find `__Secure-1PSID` or `SSID` in the list
6. Copy the value (long string of letters/numbers)

**Alternative method:**
1. Open NotebookLM
2. DevTools → Network tab
3. Refresh page
4. Click any request
5. Headers → Request Headers → Copy `cookie:` value

## Step 2: Set Environment Variable

```bash
export NOTEBOOKLM_COOKIE="paste_your_cookie_here"
```

To make it permanent, add to `~/.bashrc` or `~/.zshrc`.

## Step 3: Test Connection

```bash
node ~/.openclaw/workspace/skills/notebooklm-direct/scripts/notebooklm-api.mjs list
```

If you see your notebooks, it works! ✅

## Common Tasks

### List All Notebooks
```bash
node scripts/notebooklm-api.mjs list
```

### Create New Notebook
```bash
node scripts/notebooklm-api.mjs create "George's Brain"
```

### Add VoiceNotes Export
```bash
node scripts/notebooklm-api.mjs add-source <notebook-id> \
  --title "VoiceNotes Summary May 2026" \
  --content "$(cat /path/to/voicenotes.txt)"
```

### Chat with Notebook
```bash
node scripts/notebooklm-api.mjs chat <notebook-id> \
  "What are my top business ideas based on these notes?"
```

### Add Google Drive File
```bash
node scripts/notebooklm-api.mjs add-drive <notebook-id> \
  --file-id "1ABC123..." \
  --title "Business Plan"
```

## Troubleshooting

**"Cookie invalid" error:**
- Cookie expired (lasts ~2 weeks)
- Get fresh cookie from browser

**"No notebooks found":**
- Cookie might be wrong
- Try different cookie (`SSID` instead of `__Secure-1PSID`)

**Rate limiting:**
- Google limits API calls
- Wait 1-2 minutes between requests

## Security Note

Your cookie is like a password — keep it secret. Never commit it to git or share it.
