# 4. Technical Assumptions

### Repository Structure: Monorepo

Monorepo com workspaces separados:
- `apps/web` — Frontend Next.js
- `apps/api` — Backend NestJS
- `packages/shared` — Tipos, utilitarios e constantes compartilhadas

Justificativa: Facilita compartilhamento de tipos/interfaces entre front e back, simplifica CI/CD, equipe enxuta (1-2 devs).

### Service Architecture

Monolito modular no MVP. Backend NestJS organizado em modulos (auth, risk, quotation, policy, broker, admin). Considerar decomposicao em microservicos na Fase 2 conforme a complexidade crescer.

- **Frontend**: Next.js 14+ com App Router (SSR para SEO, CSR para dashboards)
- **Backend**: NestJS com TypeScript (modular, testavel, ecosistema robusto)
- **Database**: PostgreSQL (relacional, ACID, suporte a JSON para dados flexiveis)
- **Cache**: Redis (cache de cotacoes, sessoes, dados de risco por CEP)
- **ORM**: Prisma (type-safe, migrações, compativel com NestJS)
- **Auth**: JWT + refresh tokens (stateless, escalavel)
- **Pagamentos**: Integracao com gateway que suporte Pix (ex: Stripe, Mercado Pago, Asaas)
- **Hosting**: AWS (EC2/ECS para API, Vercel para frontend Next.js, RDS para PostgreSQL, ElastiCache para Redis)
- **CI/CD**: GitHub Actions

### Testing Requirements

Unit + Integration testing:
- **Unit**: Jest para backend (services, utils) e frontend (componentes, hooks)
- **Integration**: Testes de API (supertest) para endpoints criticos
- **E2E**: Cypress ou Playwright para fluxos criticos (cotacao → contratacao) — introducao gradual
- **Cobertura minima**: 80% em modulos criticos (quotation, payment, policy)

### Additional Technical Assumptions and Requests

- APIs de insurtechs parceiras (Simple2u, 88i) seguem padroes REST com autenticacao via API key ou OAuth2
- Dados publicos do Cemaden/IBGE estao disponiveis via API REST ou download de datasets para processamento
- ViaCEP ou similar para resolucao de CEP → endereco → coordenadas
- Gateway de pagamento deve suportar recorrencia mensal (assinatura) e Pix
- LGPD: consentimento explicito para coleta de dados, direito de exclusao, anonimizacao em analytics
- Ambiente de staging separado de producao para validacao pre-deploy
- Feature flags para lancamento gradual de funcionalidades

---
