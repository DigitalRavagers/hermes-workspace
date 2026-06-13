# SKILL: gdoc-to-md-convert

Convert all .gdoc files in the AGI-OS vault to .md format via rclone, 
so Obsidian and GBrain can read them. Runs automatically as part of 
the nightly end-of-day cron.

## When to run
- Nightly, after the midnight sync, before GBrain re-index
- On demand: when George adds new voice notes to `voicenotes/` or files to `daily/`

## Steps

### 1. Find all unconverted .gdoc files
```bash
# List .gdoc files in voicenotes/ and daily/ that don't have a .md counterpart
rclone lsf "gdrive:AGI-OS/voicenotes/" --include "*.gdoc" \
  --config /home/hermes/.config/rclone/rclone.conf > /tmp/gdocs_list.txt

rclone lsf "gdrive:AGI-OS/daily/" --include "*.gdoc" -R \
  --config /home/hermes/.config/rclone/rclone.conf >> /tmp/gdocs_list.txt
```

### 2. Export each .gdoc as .md
```bash
# For voicenotes folder
rclone copy "gdrive:AGI-OS/voicenotes/" /tmp/gdoc-export/ \
  --drive-export-formats "md" \
  --include "*.gdoc" \
  --config /home/hermes/.config/rclone/rclone.conf

# For daily folder
rclone copy "gdrive:AGI-OS/daily/" /tmp/gdoc-export-daily/ \
  --drive-export-formats "md" \
  --include "*.gdoc" -R \
  --config /home/hermes/.config/rclone/rclone.conf
```

### 3. Upload .md files back to Drive
```bash
rclone copy /tmp/gdoc-export/ "gdrive:AGI-OS/voicenotes/" \
  --include "*.md" \
  --config /home/hermes/.config/rclone/rclone.conf

rclone copy /tmp/gdoc-export-daily/ "gdrive:AGI-OS/daily/" \
  --include "*.md" \
  --config /home/hermes/.config/rclone/rclone.conf
```

### 4. Cleanup temp dirs
```bash
rm -rf /tmp/gdoc-export /tmp/gdoc-export-daily /tmp/gdocs_list.txt
```

### 5. Trigger GBrain re-index (if new .md files were created)
```bash
# GBrain watches the file system — signal a re-ingest if supported
# Or call the ingest endpoint directly
curl -s -X POST http://localhost:3131/mcp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer gbrain_1f9ce5caca9b650aaedda963727217270bf35d9899e4b548008fcfc0858a75d2" \
  -d '{"method": "tools/call", "params": {"name": "log_ingest", "arguments": {"source": "gdoc-convert-cron"}}}'
```

## Notes
- rclone `--drive-export-formats "md"` exports Google Docs as Markdown automatically
  using the existing OAuth token — no separate Google API key needed
- .md files are saved with the SAME name as the .gdoc (extension replaced)
- Obsidian will pick them up on next sync; GBrain on next ingest cycle
- This skill is idempotent — safe to run multiple times (rclone skips unchanged files)
