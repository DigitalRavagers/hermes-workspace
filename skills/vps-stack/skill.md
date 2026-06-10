---
name: vps-stack
description: Manage and operate George's sovereign VPS stack on Rabisu (185.255.93.254)
triggers:
  - "check the stack"
  - "VPS status"
  - "restart open notebook"
  - "check n8n"
  - "deploy"
---

# VPS Stack Operations

## SSH Access
Host: 185.255.93.254, User: root (credentials in vault)

## Services
| Service | URL | Internal Port | Docker |
|---------|-----|--------------|--------|
| Open Notebook UI | https://notebook.digitalravagers.in | 8502 | agi-stack-open-notebook-1 |
| Open Notebook API | (via nginx /api/) | 5055 | same container |
| n8n | https://automation.digitalravagers.in | 5678 | agi-stack-n8n-1 |
| SurrealDB | internal only | 8000 | agi-stack-surrealdb-1 |
| API Gateway | https://api.digitalravagers.in | 4000 | systemd: api-gateway |
| Hermes | systemd: hermes | — | — |

## Common Commands
```bash
# Stack status
cd /opt/agi-stack && docker compose ps

# Restart Open Notebook
docker compose restart open-notebook

# View logs
docker logs --tail 50 agi-stack-open-notebook-1

# Restart API Gateway
systemctl restart api-gateway

# Nginx reload
systemctl reload nginx
```

## After Open Notebook Restart (always do this)
The embedding patch in entrypoint.sh runs automatically.
Migrations are at v14 (up to date — no manual migration needed since 1.9.0).

## Key Paths
- Stack config: /opt/agi-stack/docker-compose.yml
- Environment: /opt/agi-stack/.env
- Open Notebook data: /opt/agi-stack/data/notebooks/
- Entrypoint patch: /opt/agi-stack/data/notebooks/entrypoint.sh
- API Gateway: /opt/api-gateway/main.py
- Nginx config: /etc/nginx/sites-available/agi-stack

## n8n API
Base: https://automation.digitalravagers.in
API Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjFjYjE4Ny0zNWJjLTQ0YjUtYjEzNy01MmMwMTNlZjQ5OWYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiOTY0YjY4MTctNTdkMC00NDAyLWFjZDQtN2VmNTgzZTgyMGU3IiwiaWF0IjoxNzgxMDI0Nzk5fQ.UFQAAjoI2bIujotrTyacCAReyDYV8OQg7pJ0Lekp67E
