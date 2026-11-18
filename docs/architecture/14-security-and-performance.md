# 14. Security and Performance

### Security Requirements

**Frontend Security:**
- CSP Headers: Configurados via next.config.js (script-src 'self', style-src 'self' 'unsafe-inline')
- XSS Prevention: React escaping nativo + sanitizacao de inputs
- Secure Storage: Tokens em httpOnly cookies (producao) ou localStorage (desenvolvimento)

**Backend Security:**
- Input Validation: Zod schemas em todos os endpoints via ZodValidationPipe
- Rate Limiting: @nestjs/throttler (global: 100 req/min; login: 5 req/15min; risk: 30 req/min)
- CORS Policy: Origins permitidas: seg360.com.br, staging.seg360.com.br, localhost:3000

**Authentication Security:**
- Token Storage: Access token (15min), refresh token (7d, rotativo)
- Password Policy: Min 8 chars, 1 maiuscula, 1 numero (bcrypt salt 10)
- Dados sensiveis: CPF e API keys criptografados com AES-256 em repouso

### Performance Optimization

**Frontend Performance:**
- Bundle Size Target: < 200KB initial JS (gzipped)
- Loading Strategy: Code splitting por rota (automatico Next.js), lazy loading de componentes pesados
- Caching Strategy: SWR com stale-while-revalidate, ISR para paginas SEO (revalidate: 86400)

**Backend Performance:**
- Response Time Target: P95 < 200ms (endpoints simples), < 2s (risk), < 5s (quotes)
- Database: Indexes em campos de busca frequente, connection pooling via Prisma
- Caching: Redis para risk data (24h), quotes (30min), sessions

---
