# 15. Testing Strategy

### Testing Pyramid

```
         E2E (Playwright)
        /    Fluxos criticos    \
       /    cotacao→contratacao   \
      Integration (Supertest)
     /   Endpoints API completos   \
    /   Auth + Guards + Database    \
   Unit (Jest + RTL)
  / Services, Components, Hooks,   \
 /   Utils, Validators, Pipes       \
```

### Test Organization

**Frontend Tests:** `apps/web/src/**/*.test.tsx`
- Componentes com React Testing Library
- Hooks com renderHook
- Services com mocks do axios

**Backend Tests:** `apps/api/src/**/*.spec.ts`
- Services com Prisma mocks
- Controllers com supertest
- Guards e pipes unitarios

**E2E Tests:** `apps/web/e2e/*.spec.ts`
- Simulacao de risco completa
- Cotacao → contratacao → confirmacao
- Login → dashboard → gestao de apolice

---
