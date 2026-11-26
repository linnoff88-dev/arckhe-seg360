# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Seg360** is a Brazilian insurance marketplace platform specializing in calamity/disaster insurance (enchente, deslizamento, vendaval, granizo). The project is in early planning phase — no application code exists yet. Business documents are written in Portuguese (pt-BR).

Repository: `github.com/linnoff88-dev/seg360`

## Development Methodology: BMad Method

This project uses the **BMad Method** (`bmad-method` npm devDependency) for AI-driven agile planning and development. The framework lives in `.bmad-core/` and provides specialized agent personas invoked via `/BMad:agents:<name>` slash commands.

### BMad Agents (slash commands)

| Command | Agent | Role |
|---------|-------|------|
| `/analyst` | Analyst | Market research, brainstorming, project briefs |
| `/pm` | PM | PRD creation and management |
| `/architect` | Architect | Architecture design |
| `/po` | PO | Document alignment, master checklist |
| `/sm` | SM | Story creation (`*draft` → create-next-story) |
| `/dev` | Dev (James) | Story implementation (`*develop-story`) |
| `/qa` | QA (Quinn) | Risk assessment, test design, QA gates |
| `/ux-expert` | UX Expert | Frontend specs, UI design |
| `/bmad-orchestrator` | Orchestrator | Multi-agent coordination |

### BMad Task Commands

Tasks are invoked via `/BMad:tasks:<name>` (e.g., `/create-next-story`, `/qa-gate`, `/review-story`).

### BMad Planning Workflow

1. **Analyst**: Brainstorming → Market Research → Competitor Analysis → Project Brief
2. **PM**: Project Brief → PRD (with FRs, NFRs, Epics & Stories)
3. **UX Expert** (optional): Frontend Spec → UI Prompts
4. **Architect**: PRD → Architecture Document
5. **PO**: Run Master Checklist → Shard Documents
6. **SM/Dev Cycle**: Create Stories → Implement → QA Review

## Project Configuration

`.bmad-core/core-config.yaml` defines key paths:
- **PRD**: `docs/prd.md` (sharded to `docs/prd/`)
- **Architecture**: `docs/architecture.md` (sharded to `docs/architecture/`)
- **Stories**: `docs/stories/`
- **QA artifacts**: `docs/qa/`
- **Dev always-load files**: `docs/architecture/coding-standards.md`, `docs/architecture/tech-stack.md`, `docs/architecture/source-tree.md`
- **Debug log**: `.ai/debug-log.md`

## Commands

```bash
npm install          # Install dependencies (currently only bmad-method)
```

No build, test, or lint commands are configured yet — the project has no application code.

## Workflow Preferences

- **Validacao continua**: Ao executar o plano de fases (BMad workflow), validar cada etapa antes de prosseguir para a proxima
- **Commit por fase**: Ao terminar cada fase, salvar o documento, atualizar o git (commit), e limpar contexto antes de iniciar a proxima fase
- **Progresso rastreado em `todo.md`**: Manter atualizado com status de cada fase
- **Idioma dos documentos de negocio**: Portugues (pt-BR)
- **Execucao autonoma**: Continuar executando fases sequencialmente ate concluir o plano, sem aguardar confirmacao entre fases
