# 3. Tech Stack

| Category | Technology | Version | Purpose | Rationale |
|----------|-----------|---------|---------|-----------|
| Frontend Language | TypeScript | 5.4+ | Type safety full-stack | Compartilha tipos com backend via packages/shared |
| Frontend Framework | Next.js | 14+ | SSR/SSG/CSR framework | App Router, otimo para SEO, deploy Vercel nativo |
| UI Component Library | shadcn/ui + Radix | latest | Componentes acessiveis | WCAG AA nativo, customizavel via Tailwind, sem lock-in |
| State Management | Zustand + SWR | 4.x / 2.x | Estado local + cache de API | Leve, TypeScript-first, SWR para revalidacao |
| CSS Framework | Tailwind CSS | 3.4+ | Estilos utilitarios | Mobile-first, design system via config, tree-shaking |
| Backend Language | TypeScript | 5.4+ | Type safety full-stack | Mesmo ecosistema do frontend |
| Backend Framework | NestJS | 10+ | API REST modular | DI nativo, modular, guards, pipes, decorators |
| API Style | REST | OpenAPI 3.0 | Comunicacao front-back | Simples, padrao mercado, facil integracao |
| ORM | Prisma | 5+ | Acesso a dados type-safe | Migrações, type generation, suporte PostgreSQL |
| Database | PostgreSQL | 16 | Banco relacional principal | ACID, JSON support, extensoes, RDS managed |
| Cache | Redis | 7 | Cache e sessoes | ElastiCache managed, pub/sub futuro |
| File Storage | AWS S3 | - | PDFs de apolice | Managed, barato, CDN via CloudFront |
| Authentication | JWT (custom) | - | Auth stateless | Refresh tokens, NestJS guards, sem vendor lock-in |
| Validation | Zod | 3.x | Validacao de schema | Compartilhada front/back via packages/shared |
| Frontend Testing | Jest + React Testing Library | 29.x / 14.x | Testes unitarios frontend | Padrao da comunidade React |
| Backend Testing | Jest + Supertest | 29.x / 6.x | Testes unit + integration | Padrao NestJS, testes de API |
| E2E Testing | Playwright | 1.40+ | Testes end-to-end | Multi-browser, rapido, auto-wait |
| Build Tool | Turbo (turborepo) | 1.x | Build monorepo | Cache de builds, pipeline paralelo |
| CI/CD | GitHub Actions | - | Pipeline de CI/CD | Nativo GitHub, gratuito para repos publicos |
| Email | AWS SES | - | Emails transacionais | Managed, barato, alta entregabilidade |
| Monitoring | Sentry | latest | Error tracking | Frontend + backend, source maps, alertas |
| Logging | Pino | 8.x | Logging estruturado | JSON, rapido, compativel NestJS |

---
