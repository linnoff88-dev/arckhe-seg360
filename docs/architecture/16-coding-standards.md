# 16. Coding Standards

### Critical Fullstack Rules

- **Type Sharing:** Todas as interfaces, enums e DTOs compartilhados DEVEM ser definidos em `packages/shared/src/types/` e importados de la. Nunca duplicar tipos entre frontend e backend
- **API Calls:** Frontend NUNCA faz fetch/axios direto. Sempre usar a camada de services (`apps/web/src/services/`)
- **Environment Variables:** Backend acessa via `@nestjs/config` ConfigService. Frontend apenas via `NEXT_PUBLIC_*`. Nunca `process.env` direto em codigo de negocio
- **Error Handling:** Todos os endpoints DEVEM usar o GlobalExceptionFilter. Erros retornam o formato `ApiError` padrao
- **Validation:** Toda entrada de usuario validada com Zod (shared schemas). Backend usa ZodValidationPipe. Frontend usa react-hook-form + zodResolver
- **Database Access:** Apenas services acessam Prisma. Controllers NUNCA acessam banco diretamente
- **Naming em portugues:** URLs e labels em portugues (ex: `/painel`, `/corretor`). Codigo em ingles

### Naming Conventions

| Element | Frontend | Backend | Example |
|---------|----------|---------|---------|
| Components | PascalCase | - | `RiskBadge.tsx` |
| Hooks | camelCase com 'use' | - | `useAuth.ts` |
| Services | camelCase + .service | camelCase + .service | `auth.service.ts` |
| API Routes | - | kebab-case | `/api/v1/broker-profiles` |
| DB Tables | - | snake_case | `broker_profiles` |
| Shared Types | PascalCase | PascalCase | `UserRole`, `QuoteResponse` |
| Files | kebab-case | kebab-case | `risk-badge.tsx`, `auth.guard.ts` |

---
