---
name: voicenotes-second-brain
description: Query George's VoiceNotes second brain (Open Notebook) and search 273 imported voice notes
triggers:
  - "search my notes"
  - "what did I say about"
  - "look up in my second brain"
  - "check my voice notes"
  - "ask my brain"
---

# VoiceNotes Second Brain

George's 150+ voice notes are fully indexed in Open Notebook on the VPS.

## Quick Ask (AI-synthesised answer with sources)
```
POST https://api.digitalravagers.in/search
Content-Type: application/json

{"query": "your question here", "type": "ask"}
```
Returns a sourced answer synthesised by Gemini 2.5 Flash.

## Text Search (fast keyword)
```
POST https://api.digitalravagers.in/search
{"query": "keyword", "type": "text", "limit": 10}
```

## Direct Open Notebook API (from VPS)
```
POST http://localhost:5055/api/search/ask/simple
{
  "question": "Your question",
  "strategy_model": "model:ux9jryw1n0uuueng1a9c",
  "answer_model": "model:ux9jryw1n0uuueng1a9c",
  "final_answer_model": "model:ux9jryw1n0uuueng1a9c",
  "notebook_id": "notebook:natcr8xz1kv2exfayuyt"
}
```

## System Info
- UI: https://notebook.digitalravagers.in
- 273 sources, 4752 embedding chunks
- LLM: Gemini 2.5 Flash via Kilo Code (model:ux9jryw1n0uuueng1a9c)
- Embed: text-embedding-3-small via Kilo Code (model:2w1rg5rkm7qoyxuxma0x)
- Notebooks: 8 (VoiceNotes by category) + master notebook:natcr8xz1kv2exfayuyt
