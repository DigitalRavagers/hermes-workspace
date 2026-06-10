---
name: gbrain
description: Use GBrain — Postgres-native personal knowledge brain with hybrid RAG, graph traversal, and synthesis
triggers:
  - "search gbrain"
  - "query brain"
  - "ingest into gbrain"
  - "add to knowledge graph"
  - "gbrain synthesis"
  - "enrich person"
---

# GBrain — Knowledge Brain Layer

GBrain sits on top of Open Notebook as the synthesis + graph layer.
Built by Garry Tan (YC President) for personal AI agents. 146K pages, 24K people at scale.

## Location
/home/hermes/gbrain/ (installed, Bun-powered)
Data: /home/hermes/gbrain-data/brain.db (PGLite, embedded)

## Core CLI Commands (run as hermes user)
```bash
cd /home/hermes/gbrain

# Ingest a file/URL/directory
bun run src/cli.ts ingest <path-or-url>

# Ask a question (synthesis with citations)
bun run src/cli.ts ask "What do I know about Botsify?"

# Search
bun run src/cli.ts search "keyword or concept"

# List entities
bun run src/cli.ts list people
bun run src/cli.ts list companies

# Import from Open Notebook (future integration)
# Pull source texts from Open Notebook → ingest into GBrain for graph traversal
```

## What GBrain Adds Over Open Notebook
- **Knowledge graph**: auto-extracts entities (people, companies) + typed edges
- **Synthesis**: "actual answer" not just chunks — prose with citations + gap analysis
- **Graph traversal**: "who works at Acme?" across meeting notes, emails, voice notes
- **Gap analysis**: explicitly says what the brain doesn't know yet

## Integration with Open Notebook
Open Notebook = semantic search over VoiceNotes (273 sources, 4752 chunks)
GBrain = synthesis + graph layer over everything (VoiceNotes + meetings + emails + Botsify docs)

Workflow:
1. Ingest Open Notebook sources into GBrain for graph enrichment
2. Use Open Notebook for fast BM25/vector search
3. Use GBrain for cross-source synthesis and entity lookups

## Config
.env at /home/hermes/gbrain/.env
- OPENAI_API_KEY: Native OpenAI key (direct, not gateway)
- GBRAIN_LLM_MODEL: gpt-4o-mini
- GBRAIN_EMBEDDING_MODEL: text-embedding-3-small
