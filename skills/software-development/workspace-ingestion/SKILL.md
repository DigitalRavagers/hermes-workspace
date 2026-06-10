---
name: workspace-ingestion
description: "Systematically ingest and understand large migrated workspaces or codebases without overwhelming context."
version: 1.0.0
author: Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [Workspace, Context, Ingestion, Migration, Codebase, Orientation]
    related_skills: [codebase-inspection, github-repo-management]
---

# Workspace Ingestion & Context Orientation

When asked to "go through" a large workspace, migrated codebase, or extensive project directory, do NOT attempt to read every file. This will exhaust context limits and waste time. Instead, use a systematic, layered approach to extract the maximum signal with minimal token cost.

## When to Use
- User asks to "go through the entire workspace" or "understand how this project developed".
- Inheriting a migrated workspace (e.g., from another agent platform).
- Needing to orient to a large, unfamiliar codebase before taking action.
- User provides a large directory and asks for a summary or next steps.

## The 4-Layer Ingestion Pattern

### Layer 1: Topography (Structure & Scale)
Get the lay of the land without reading content.
```bash
# List top-level files and directories with sizes to spot large artifacts
ls -la /path/to/workspace

# Find unusually large files that might be logs, backups, or dumps (avoid reading these directly)
find /path/to/workspace -type f -size +10M -printf "%s %p\n" 2>/dev/null | sort -n | tail -10
```

### Layer 2: Metadata & Intent (The "Why" and "What")
Read only the high-level documentation and configuration files that define the project's purpose, rules, and state.
Target files (read via `read_file`):
- `README.md`, `AGENTS.md`, `SOUL.md`, `USER.md`, `MEMORY.md`
- `PROJECTS.md`, `HANDOFF.md`, `CONTRIBUTING.md`
- `package.json`, `requirements.txt`, `pyproject.toml` (for dependency context)
- Domain-specific indexes (e.g., `AI-OS-SKILLS-INDEX.md`, `SUBSCRIPTIONS.md`)

### Layer 3: Recent Evolution (The "How it got here")
Instead of reading all files, inspect the version control history to understand recent changes, scale of work, and current state.
```bash
cd /path/to/workspace
# See the last 10-20 commits to understand recent focus
git log --oneline -20

# Inspect the most recent significant commit to see what was actually changed/added
git show <recent-commit-hash> --stat
```
*Note: If the workspace is not a git repo, look for `CHANGELOG.md`, `HISTORY.md`, or recent daily log files (e.g., `memory/YYYY-MM-DD.md`).*

### Layer 4: Consolidation & Memory Update
Distill the findings into actionable, persistent context. Do not save transient task states.
- Use the `memory` tool (action='add' or 'replace') to capture:
  - Core projects and their distinct boundaries.
  - Critical constraints (budget, timeline, technical limits).
  - Active subscriptions, API endpoints, or infrastructure details.
- If the memory is nearing its limit, use `action='replace'` to merge older, overlapping entries into a concise, updated summary.

## Pitfalls to Avoid
1. **Reading massive files directly**: Files >1MB (like full database dumps, complete voice note transcripts, or raw logs) should be summarized via external tools or searched via `search_files`, not read via `read_file`.
2. **Assuming file names equal current state**: A file named `legacy-config.json` might be the *only* config in use. Always verify via Layer 3 (git history) or Layer 2 (metadata).
3. **Saving transient state to memory**: Do not save "fixed bug X" or "submitted PR Y". Save durable facts: "Project uses pytest with xdist", "User prefers concise responses".
4. **Over-explaining the process**: When reporting back to the user, state the outcomes first ("I've synced the core context: 3 projects, 2 active constraints, 1 pending migration task"). Do not narrate the 4-layer process unless asked.

## Example Workflow
```python
# 1. Topography
terminal("ls -la /workspace && find /workspace -type f -size +10M | head -5")
# 2. Metadata
read_file("/workspace/HANDOFF.md")
read_file("/workspace/PROJECTS.md")
# 3. Evolution
terminal("cd /workspace && git log --oneline -10 && git show HEAD --stat")
# 4. Consolidation
memory(action="replace", target="memory", old_text="...", content="...")
```