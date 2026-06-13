# Routing Table — Which Agent / Tool Does What

## Task → Agent Mapping
| Task Type | Primary | Fallback |
|-----------|---------|---------|
| Deep architecture / code | Claude Code | — |
| 24/7 monitoring / crons | Hermes | — |
| Automation workflows | n8n | Hermes |
| Research / synthesis | Open Notebook ask | AGI Dashboard search_memory |
| Task management | Rhynia (via MCP) | AGI Dashboard create_item |
| Memory retrieval | AGI Dashboard search_memory | Open Notebook |
| File / Drive ops | Hermes (rclone) | Claude Code |
| Telegram messaging | Hermes /notify | API Gateway /notify |
| Data capture | Voicenotes → n8n webhook | — |

## Model → Task Mapping
| Model | Use For |
|-------|---------|
| Kilo Code (kilo-auto/free) | Default; monitoring, routine tasks |
| Kilo Code (kilo-auto/balanced) | Complex reasoning, multi-step |
| Kimi K2 (moonshot) | Heavy lifting, long context |
| Claude | Planning, architecture, major decisions only |
| Gemini 2.5 Flash (via Kilo) | Second brain synthesis, embeddings |

## Escalation Path
routine cron → Hermes handles → if blocked → Telegram George → if complex → Claude Code session
