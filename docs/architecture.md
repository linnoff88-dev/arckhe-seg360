# Seg360 Fullstack Architecture Document

## 1. Introduction

This document outlines the complete fullstack architecture for Seg360, including backend systems, frontend implementation, and their integration. It serves as the single source of truth for AI-driven development, ensuring consistency across the entire technology stack.

**Starter Template:** N/A — Greenfield project. Monorepo configurado do zero com npm workspaces.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2026-02-13 | 1.0 | Criacao inicial a partir do PRD e front-end-spec | BMad Architect |

---

## 2. High Level Architecture

### Technical Summary

Seg360 segue uma arquitetura monolito modular em monorepo, com frontend Next.js 14+ (App Router) e backend NestJS, ambos em TypeScript. O frontend usa SSR/SSG para paginas publicas (SEO) e CSR para dashboards autenticados. O backend expoe uma REST API organizada em modulos por dominio (auth, risk, quotation, policy, broker, admin). PostgreSQL armazena dados relacionais via Prisma ORM, Redis faz cache de cotacoes e dados de risco. Integracoes com insurtechs parceiras seguem o Adapter Pattern para permitir multiplos providers. Deploy em Vercel (frontend) e AWS ECS (backend), com RDS e ElastiCache para banco e cache.

### Platform and Infrastructure Choice

**Platform:** AWS + Vercel (hibrido)
**Key Services:**
- Vercel: Hospedagem Next.js (SSR/SSG, Edge Functions, CDN global)
- AWS ECS (Fargate): API NestJS containerizada
- AWS RDS (PostgreSQL 16): Banco de dados relacional
- AWS ElastiCache (Redis 7): Cache e sessoes
- AWS SES: Envio de emails transacionais
- AWS S3: Armazenamento de arquivos (PDFs de apolice)

**Deployment Regions:** sa-east-1 (Sao Paulo) como regiao primaria

### Repository Structure

**Structure:** Monorepo com npm workspaces
**Monorepo Tool:** npm workspaces (nativo, sem overhead adicional — equipe enxuta)
**Package Organization:**
- `apps/web` — Frontend Next.js
- `apps/api` — Backend NestJS
- `packages/shared` — Tipos TypeScript, constantes, utilitarios compartilhados

### High Level Architecture Diagram

```mermaid
graph TB
    USER[Usuario / Browser] --> VERCEL[Vercel CDN + Edge]
    VERCEL --> NEXTJS[Next.js App<br/>SSR/SSG/CSR]
    NEXTJS --> API[NestJS API<br/>AWS ECS Fargate]
    API --> PG[(PostgreSQL<br/>AWS RDS)]
    API --> REDIS[(Redis<br/>ElastiCache)]
    API --> S3[AWS S3<br/>PDFs]
    API --> SES[AWS SES<br/>Emails]
    API --> INSURTECH[Insurtechs APIs<br/>Simple2u / 88i]
    API --> VIACEP[ViaCEP API]
    API --> PAYMENT[Payment Gateway<br/>Asaas]
    NEXTJS -.->|SSR/API Routes| API
```

### Architectural Patterns

- **Monolito Modular:** Backend NestJS organizado em modulos por dominio, cada modulo com seus controllers, services e repositories — _Rationale:_ Simplicidade para MVP com equipe enxuta, facil evolucao para microservicos se necessario
- **Adapter Pattern (Insurtechs):** Interface abstrata `InsurtechProvider` com implementacoes concretas por parceiro — _Rationale:_ Permite adicionar/trocar insurtechs sem alterar logica de negocio
- **Repository Pattern:** Camada de acesso a dados via Prisma isolada em services — _Rationale:_ Testabilidade, isolamento de queries, facilita mock em testes
- **Server-Side Rendering + Static Generation:** Paginas publicas (landing, SEO) em SSG/ISR; dashboards em CSR com autenticacao — _Rationale:_ SEO otimo para aquisicao organica, dashboards rapidos
- **API Client Layer:** Frontend acessa backend exclusivamente via camada de services (nunca fetch direto) — _Rationale:_ Centralizacao de auth headers, error handling, tipagem
- **Guard-Based Authorization:** NestJS guards para RBAC (Consumer, Broker, Admin) — _Rationale:_ Padrao nativo NestJS, declarativo, testavel

---

## 3. Tech Stack

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

## 4. Data Models

### User

**Purpose:** Usuario da plataforma (consumidor, corretor ou admin)

**Key Attributes:**
- id: string (UUID) - Identificador unico
- email: string (unique) - Email de acesso
- passwordHash: string - Senha hasheada com bcrypt
- name: string - Nome completo
- role: enum (CONSUMER, BROKER, ADMIN) - Perfil de acesso
- phone: string? - Telefone
- cpf: string? - CPF (criptografado)
- createdAt: DateTime - Data de criacao
- updatedAt: DateTime - Data de atualizacao

**Relationships:**
- User 1→1 BrokerProfile (se role = BROKER)
- User 1→N Quote
- User 1→N Policy
- User 1→N Payment

### BrokerProfile

**Purpose:** Dados profissionais do corretor

**Key Attributes:**
- id: string (UUID)
- userId: string (FK → User)
- susepRegistration: string - Registro SUSEP
- companyName: string? - Nome da empresa
- cnpj: string? - CNPJ
- region: string - Regiao de atuacao
- status: enum (PENDING, ACTIVE, SUSPENDED)
- verifiedAt: DateTime?

**Relationships:**
- BrokerProfile 1→1 User
- BrokerProfile 1→N Lead
- BrokerProfile 1→N Referral
- BrokerProfile 1→N Commission

### RiskData

**Purpose:** Dados de risco de calamidade por CEP/regiao

**Key Attributes:**
- id: string (UUID)
- cep: string (indexed)
- city: string
- state: string
- neighborhood: string?
- riskLevel: enum (LOW, MEDIUM, HIGH, VERY_HIGH)
- riskTypes: string[] - Tipos de risco (flood, landslide, windstorm, hail)
- avgDamage: Decimal - Prejuizo medio
- incidentCount12m: int - Ocorrencias nos ultimos 12 meses
- lastUpdated: DateTime
- isApproximate: boolean - Dados aproximados (fallback)

### Quote

**Purpose:** Cotacao de seguro gerada pelo motor de cotacao

**Key Attributes:**
- id: string (UUID)
- userId: string? (FK → User)
- cep: string
- riskLevel: enum
- providerName: string - Insurtech que gerou
- planName: string
- monthlyPremium: Decimal
- coverageAmount: Decimal
- coverageDetails: JSON - Detalhes de cobertura
- propertyType: enum (HOUSE, APARTMENT)
- propertyValue: Decimal
- validUntil: DateTime
- referralCode: string? - Codigo do corretor que referiu

### Policy

**Purpose:** Apolice de seguro emitida

**Key Attributes:**
- id: string (UUID)
- userId: string (FK → User)
- quoteId: string (FK → Quote)
- policyNumber: string (unique) - SEG360-YYYYMMDD-XXXXX
- providerPolicyId: string? - ID na insurtech
- status: enum (ACTIVE, CANCELLED, EXPIRED, SUSPENDED)
- startDate: DateTime
- endDate: DateTime
- coverageDetails: JSON
- monthlyPremium: Decimal

**Relationships:**
- Policy N→1 User
- Policy 1→1 Quote
- Policy 1→N Payment
- Policy 1→1 Commission

### Payment

**Purpose:** Registro de pagamento (unico ou recorrente)

**Key Attributes:**
- id: string (UUID)
- userId: string (FK → User)
- policyId: string (FK → Policy)
- method: enum (PIX, CARD)
- amount: Decimal
- status: enum (PENDING, PAID, FAILED, REFUNDED)
- gatewayId: string - ID no gateway
- gatewayResponse: JSON?
- paidAt: DateTime?

### Lead

**Purpose:** Lead de consumidor atribuido a corretor

**Key Attributes:**
- id: string (UUID)
- brokerId: string (FK → BrokerProfile)
- consumerName: string
- consumerEmail: string
- consumerPhone: string?
- cep: string
- riskLevel: enum
- status: enum (NEW, CONTACTED, CONVERTED, LOST)
- source: string - Origem (referral, organic, etc)
- notes: string?

### Referral

**Purpose:** Link de referencia personalizado do corretor

**Key Attributes:**
- id: string (UUID)
- brokerId: string (FK → BrokerProfile)
- code: string (unique) - Codigo curto
- clicks: int (default 0)
- quotesGenerated: int (default 0)
- salesCompleted: int (default 0)

### Commission

**Purpose:** Comissao do corretor por venda

**Key Attributes:**
- id: string (UUID)
- brokerId: string (FK → BrokerProfile)
- policyId: string (FK → Policy)
- amount: Decimal
- percentage: Decimal
- status: enum (PENDING, PAID)
- paidAt: DateTime?

### InsurancePartner

**Purpose:** Seguradora/insurtech parceira integrada

**Key Attributes:**
- id: string (UUID)
- name: string
- slug: string (unique)
- apiEndpoint: string
- apiKey: string (criptografado)
- status: enum (ACTIVE, INACTIVE)
- commissionRate: Decimal
- supportedRiskTypes: string[]

### EmailLog

**Purpose:** Registro de emails enviados para auditoria

**Key Attributes:**
- id: string (UUID)
- userId: string (FK → User)
- templateId: string
- subject: string
- status: enum (SENT, FAILED)
- sentAt: DateTime?

---

## 5. API Specification

### REST API — Endpoints Summary

**Base URL:** `https://api.seg360.com.br/api/v1`

#### Auth Module
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /auth/register | Public | Registro de usuario |
| POST | /auth/login | Public | Login (retorna JWT) |
| POST | /auth/refresh | Public | Refresh token |
| POST | /auth/forgot-password | Public | Solicitar reset de senha |
| POST | /auth/reset-password | Public | Resetar senha com token |

#### User Module
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /users/me | User | Perfil do usuario logado |
| PATCH | /users/me | User | Atualizar perfil |

#### Risk Module
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /risk/:cep | Public | Consultar risco por CEP |
| GET | /risk/regions | Public | Listar regioes com dados de risco |
| GET | /risk/regions/:state/:city | Public | Dados de risco por cidade (SEO) |

#### Quote Module
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /quotes | Public | Gerar cotacoes (aceita referralCode) |
| GET | /quotes/:id | User | Detalhes de uma cotacao |
| GET | /quotes | User | Listar cotacoes do usuario |

#### Policy Module
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /policies | User | Criar apolice (apos pagamento) |
| GET | /policies | User | Listar apolices do usuario |
| GET | /policies/:id | User | Detalhes da apolice |
| POST | /policies/:id/cancel | User | Cancelar apolice |
| PATCH | /policies/:id/payment-method | User | Atualizar metodo pagamento |
| GET | /policies/:id/pdf | User | Download PDF da apolice |

#### Payment Module
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /payments | User | Criar pagamento (Pix ou cartao) |
| GET | /payments/:id | User | Status do pagamento |
| POST | /payments/webhook | Public* | Webhook do gateway (*verificacao de assinatura) |

#### Broker Module
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /brokers/me | Broker | Perfil do corretor |
| PATCH | /brokers/me | Broker | Atualizar perfil corretor |
| POST | /brokers/referral-link | Broker | Gerar link de referencia |
| GET | /brokers/referrals | Broker | Listar referrals e metricas |
| GET | /brokers/leads | Broker | Listar leads |
| PATCH | /brokers/leads/:id | Broker | Atualizar status do lead |
| GET | /brokers/commissions | Broker | Listar comissoes |
| GET | /brokers/commissions/export | Broker | Export CSV de comissoes |
| GET | /brokers/dashboard | Broker | Metricas do dashboard |

#### Admin Module
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /admin/metrics | Admin | Metricas gerais da plataforma |
| GET | /admin/brokers | Admin | Listar corretores |
| PATCH | /admin/brokers/:id/verify | Admin | Verificar corretor |
| PATCH | /admin/brokers/:id/suspend | Admin | Suspender corretor |
| GET | /admin/policies | Admin | Listar apolices (filtros) |
| GET | /admin/payments | Admin | Listar pagamentos (filtros) |
| GET | /admin/partners | Admin | Listar seguradoras parceiras |
| POST | /admin/partners | Admin | Criar parceira |
| PATCH | /admin/partners/:id | Admin | Atualizar parceira |

### Error Response Format

```typescript
interface ApiError {
  error: {
    code: string;        // Ex: "VALIDATION_ERROR", "NOT_FOUND", "UNAUTHORIZED"
    message: string;     // Mensagem em portugues
    details?: Record<string, string[]>; // Erros por campo (validacao)
    timestamp: string;   // ISO 8601
    requestId: string;   // UUID para rastreamento
  };
}
```

---

## 6. Backend Architecture

### NestJS Module Organization

```
apps/api/src/
├── main.ts
├── app.module.ts
├── common/
│   ├── decorators/        # @CurrentUser, @Roles, @Public
│   ├── filters/           # GlobalExceptionFilter
│   ├── guards/            # JwtAuthGuard, RolesGuard
│   ├── interceptors/      # LoggingInterceptor, TransformInterceptor
│   ├── pipes/             # ZodValidationPipe
│   └── types/             # Tipos comuns do backend
├── modules/
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── strategies/     # JwtStrategy, RefreshStrategy
│   │   └── dto/            # LoginDto, RegisterDto
│   ├── user/
│   │   ├── user.module.ts
│   │   ├── user.controller.ts
│   │   └── user.service.ts
│   ├── risk/
│   │   ├── risk.module.ts
│   │   ├── risk.controller.ts
│   │   ├── risk.service.ts
│   │   └── providers/      # CemademProvider, ViaCepProvider
│   ├── quotation/
│   │   ├── quotation.module.ts
│   │   ├── quotation.controller.ts
│   │   ├── quotation.service.ts
│   │   └── providers/      # InsurtechProvider interface, Simple2uAdapter, MockAdapter
│   ├── policy/
│   │   ├── policy.module.ts
│   │   ├── policy.controller.ts
│   │   ├── policy.service.ts
│   │   └── pdf/            # PolicyPdfGenerator
│   ├── payment/
│   │   ├── payment.module.ts
│   │   ├── payment.controller.ts
│   │   ├── payment.service.ts
│   │   └── providers/      # AsaasProvider, PaymentGateway interface
│   ├── broker/
│   │   ├── broker.module.ts
│   │   ├── broker.controller.ts
│   │   ├── broker.service.ts
│   │   └── lead.service.ts
│   ├── admin/
│   │   ├── admin.module.ts
│   │   ├── admin.controller.ts
│   │   └── admin.service.ts
│   └── email/
│       ├── email.module.ts
│       ├── email.service.ts
│       └── templates/       # HTML templates
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
└── config/
    ├── app.config.ts
    ├── database.config.ts
    ├── redis.config.ts
    └── jwt.config.ts
```

### Insurtech Adapter Pattern

```typescript
// packages/shared/src/types/insurtech.ts
interface InsurtechProvider {
  readonly name: string;
  getPlans(riskTypes: RiskType[]): Promise<InsurancePlan[]>;
  getQuote(params: QuoteRequest): Promise<QuoteResponse>;
  createPolicy(params: PolicyRequest): Promise<PolicyResponse>;
}

// apps/api/src/modules/quotation/providers/simple2u.adapter.ts
class Simple2uAdapter implements InsurtechProvider {
  readonly name = 'simple2u';
  // implementacao especifica
}

// apps/api/src/modules/quotation/providers/mock.adapter.ts
class MockInsurtechAdapter implements InsurtechProvider {
  readonly name = 'mock';
  // dados mockados para desenvolvimento
}
```

### Authentication Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant A as API (NestJS)
    participant DB as PostgreSQL
    participant R as Redis

    C->>A: POST /auth/login {email, password}
    A->>DB: Find user by email
    DB-->>A: User record
    A->>A: Verify password (bcrypt)
    A->>A: Generate JWT (15min) + Refresh Token (7d)
    A->>R: Store refresh token
    A-->>C: {accessToken, refreshToken}

    Note over C,A: Subsequent requests
    C->>A: GET /api/... (Authorization: Bearer {jwt})
    A->>A: JwtAuthGuard validates token
    A->>A: RolesGuard checks role
    A-->>C: Response

    Note over C,A: Token refresh
    C->>A: POST /auth/refresh {refreshToken}
    A->>R: Validate refresh token
    R-->>A: Valid
    A->>A: Generate new JWT + Refresh Token
    A->>R: Rotate refresh token
    A-->>C: {accessToken, refreshToken}
```

---

## 7. Database Schema (Prisma)

```prisma
// apps/api/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  CONSUMER
  BROKER
  ADMIN
}

enum BrokerStatus {
  PENDING
  ACTIVE
  SUSPENDED
}

enum RiskLevel {
  LOW
  MEDIUM
  HIGH
  VERY_HIGH
}

enum PropertyType {
  HOUSE
  APARTMENT
}

enum PolicyStatus {
  ACTIVE
  CANCELLED
  EXPIRED
  SUSPENDED
}

enum PaymentMethod {
  PIX
  CARD
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}

enum LeadStatus {
  NEW
  CONTACTED
  CONVERTED
  LOST
}

enum CommissionStatus {
  PENDING
  PAID
}

enum EmailStatus {
  SENT
  FAILED
}

enum PartnerStatus {
  ACTIVE
  INACTIVE
}

model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String   @map("password_hash")
  name         String
  role         UserRole @default(CONSUMER)
  phone        String?
  cpf          String?
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  brokerProfile BrokerProfile?
  quotes        Quote[]
  policies      Policy[]
  payments      Payment[]
  emailLogs     EmailLog[]

  @@map("users")
}

model BrokerProfile {
  id                String       @id @default(uuid())
  userId            String       @unique @map("user_id")
  susepRegistration String       @map("susep_registration")
  companyName       String?      @map("company_name")
  cnpj              String?
  region            String
  status            BrokerStatus @default(PENDING)
  verifiedAt        DateTime?    @map("verified_at")
  createdAt         DateTime     @default(now()) @map("created_at")

  user        User         @relation(fields: [userId], references: [id])
  leads       Lead[]
  referrals   Referral[]
  commissions Commission[]

  @@map("broker_profiles")
}

model RiskData {
  id              String    @id @default(uuid())
  cep             String    @unique
  city            String
  state           String
  neighborhood    String?
  riskLevel       RiskLevel @map("risk_level")
  riskTypes       String[]  @map("risk_types")
  avgDamage       Decimal   @map("avg_damage") @db.Decimal(12, 2)
  incidentCount12m Int      @map("incident_count_12m")
  lastUpdated     DateTime  @map("last_updated")
  isApproximate   Boolean   @default(false) @map("is_approximate")

  @@index([city, state])
  @@index([riskLevel])
  @@map("risk_data")
}

model Quote {
  id              String       @id @default(uuid())
  userId          String?      @map("user_id")
  cep             String
  riskLevel       RiskLevel    @map("risk_level")
  providerName    String       @map("provider_name")
  planName        String       @map("plan_name")
  monthlyPremium  Decimal      @map("monthly_premium") @db.Decimal(10, 2)
  coverageAmount  Decimal      @map("coverage_amount") @db.Decimal(12, 2)
  coverageDetails Json         @map("coverage_details")
  propertyType    PropertyType @map("property_type")
  propertyValue   Decimal      @map("property_value") @db.Decimal(12, 2)
  validUntil      DateTime     @map("valid_until")
  referralCode    String?      @map("referral_code")
  createdAt       DateTime     @default(now()) @map("created_at")

  user   User?   @relation(fields: [userId], references: [id])
  policy Policy?

  @@index([userId])
  @@index([referralCode])
  @@map("quotes")
}

model Policy {
  id               String       @id @default(uuid())
  userId           String       @map("user_id")
  quoteId          String       @unique @map("quote_id")
  policyNumber     String       @unique @map("policy_number")
  providerPolicyId String?      @map("provider_policy_id")
  status           PolicyStatus @default(ACTIVE)
  startDate        DateTime     @map("start_date")
  endDate          DateTime     @map("end_date")
  coverageDetails  Json         @map("coverage_details")
  monthlyPremium   Decimal      @map("monthly_premium") @db.Decimal(10, 2)
  createdAt        DateTime     @default(now()) @map("created_at")

  user       User        @relation(fields: [userId], references: [id])
  quote      Quote       @relation(fields: [quoteId], references: [id])
  payments   Payment[]
  commission Commission?

  @@index([userId])
  @@index([status])
  @@map("policies")
}

model Payment {
  id              String        @id @default(uuid())
  userId          String        @map("user_id")
  policyId        String        @map("policy_id")
  method          PaymentMethod
  amount          Decimal       @db.Decimal(10, 2)
  status          PaymentStatus @default(PENDING)
  gatewayId       String?       @map("gateway_id")
  gatewayResponse Json?         @map("gateway_response")
  paidAt          DateTime?     @map("paid_at")
  createdAt       DateTime      @default(now()) @map("created_at")

  user   User   @relation(fields: [userId], references: [id])
  policy Policy @relation(fields: [policyId], references: [id])

  @@index([userId])
  @@index([policyId])
  @@index([status])
  @@map("payments")
}

model Lead {
  id            String     @id @default(uuid())
  brokerId      String     @map("broker_id")
  consumerName  String     @map("consumer_name")
  consumerEmail String     @map("consumer_email")
  consumerPhone String?    @map("consumer_phone")
  cep           String
  riskLevel     RiskLevel  @map("risk_level")
  status        LeadStatus @default(NEW)
  source        String
  notes         String?
  createdAt     DateTime   @default(now()) @map("created_at")

  broker BrokerProfile @relation(fields: [brokerId], references: [id])

  @@index([brokerId])
  @@index([status])
  @@map("leads")
}

model Referral {
  id              String   @id @default(uuid())
  brokerId        String   @map("broker_id")
  code            String   @unique
  clicks          Int      @default(0)
  quotesGenerated Int      @default(0) @map("quotes_generated")
  salesCompleted  Int      @default(0) @map("sales_completed")
  createdAt       DateTime @default(now()) @map("created_at")

  broker BrokerProfile @relation(fields: [brokerId], references: [id])

  @@index([brokerId])
  @@map("referrals")
}

model Commission {
  id         String           @id @default(uuid())
  brokerId   String           @map("broker_id")
  policyId   String           @unique @map("policy_id")
  amount     Decimal          @db.Decimal(10, 2)
  percentage Decimal          @db.Decimal(5, 2)
  status     CommissionStatus @default(PENDING)
  paidAt     DateTime?        @map("paid_at")
  createdAt  DateTime         @default(now()) @map("created_at")

  broker BrokerProfile @relation(fields: [brokerId], references: [id])
  policy Policy        @relation(fields: [policyId], references: [id])

  @@index([brokerId])
  @@index([status])
  @@map("commissions")
}

model InsurancePartner {
  id                 String        @id @default(uuid())
  name               String
  slug               String        @unique
  apiEndpoint        String        @map("api_endpoint")
  apiKey             String        @map("api_key")
  status             PartnerStatus @default(ACTIVE)
  commissionRate     Decimal       @map("commission_rate") @db.Decimal(5, 2)
  supportedRiskTypes String[]      @map("supported_risk_types")
  createdAt          DateTime      @default(now()) @map("created_at")

  @@map("insurance_partners")
}

model EmailLog {
  id         String      @id @default(uuid())
  userId     String      @map("user_id")
  templateId String      @map("template_id")
  subject    String
  status     EmailStatus
  sentAt     DateTime?   @map("sent_at")
  createdAt  DateTime    @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id])

  @@index([userId])
  @@map("email_logs")
}
```

---

## 8. Frontend Architecture

### Component Organization

```
apps/web/src/
├── app/                         # Next.js App Router
│   ├── layout.tsx               # Root layout (fonts, providers)
│   ├── page.tsx                 # Home / Landing
│   ├── simulador/
│   │   └── page.tsx             # Simulador de risco
│   ├── risco/
│   │   └── [estado]/[cidade]/
│   │       └── page.tsx         # Paginas SEO regionais (SSG)
│   ├── cotacao/
│   │   ├── page.tsx             # Wizard de cotacao
│   │   └── comparar/
│   │       └── page.tsx         # Comparador de coberturas
│   ├── checkout/
│   │   └── page.tsx             # Pagamento
│   ├── confirmacao/
│   │   └── page.tsx             # Confirmacao de apolice
│   ├── painel/                  # Consumer dashboard
│   │   ├── layout.tsx           # Dashboard layout com sidebar
│   │   ├── page.tsx             # Dashboard home
│   │   └── apolices/
│   │       └── [id]/page.tsx    # Detalhes da apolice
│   ├── corretor/                # Broker dashboard
│   │   ├── layout.tsx
│   │   ├── page.tsx             # Dashboard corretor
│   │   ├── leads/page.tsx
│   │   ├── vendas/page.tsx
│   │   └── comissoes/page.tsx
│   ├── admin/                   # Admin panel
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── corretores/page.tsx
│   │   ├── apolices/page.tsx
│   │   └── parceiros/page.tsx
│   ├── auth/
│   │   ├── login/page.tsx
│   │   ├── cadastro/page.tsx
│   │   └── esqueci-senha/page.tsx
│   └── para-corretores/
│       └── page.tsx             # LP para corretores
├── components/
│   ├── ui/                      # shadcn/ui base components
│   ├── layout/                  # Header, Footer, Sidebar
│   ├── risk/                    # RiskBadge, RiskResult, CepInput
│   ├── quotation/               # CoverageCard, QuoteWizard
│   ├── payment/                 # PixQrCode, CardForm
│   └── dashboard/               # MetricCard, DataTable, Charts
├── hooks/
│   ├── use-auth.ts
│   ├── use-risk.ts
│   ├── use-quotes.ts
│   └── use-policies.ts
├── services/
│   ├── api-client.ts            # Axios instance com interceptors
│   ├── auth.service.ts
│   ├── risk.service.ts
│   ├── quote.service.ts
│   ├── policy.service.ts
│   └── broker.service.ts
├── stores/
│   ├── auth.store.ts            # Zustand: user, tokens
│   └── quote.store.ts           # Zustand: wizard state
├── lib/
│   ├── utils.ts                 # cn(), formatters
│   └── validations.ts           # Zod schemas (import from shared)
└── styles/
    └── globals.css              # Tailwind base + custom tokens
```

### State Management Patterns

- **Auth State (Zustand):** Token storage, user info, login/logout actions. Persistido em localStorage
- **Server State (SWR):** Dados do servidor (policies, leads, quotes) com revalidacao automatica
- **Form State (react-hook-form + Zod):** Wizard de cotacao, formularios de cadastro
- **URL State (Next.js searchParams):** Filtros, paginacao, CEP no simulador

### Protected Route Pattern

```typescript
// apps/web/src/components/layout/ProtectedRoute.tsx
'use client';
import { useAuth } from '@/hooks/use-auth';
import { redirect } from 'next/navigation';
import { UserRole } from '@seg360/shared';

interface Props {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: Props) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <LoadingSkeleton />;
  if (!user) redirect('/auth/login');
  if (!allowedRoles.includes(user.role)) redirect('/');
  return <>{children}</>;
}
```

### API Client Setup

```typescript
// apps/web/src/services/api-client.ts
import axios from 'axios';
import { useAuthStore } from '@/stores/auth.store';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshed = await useAuthStore.getState().refresh();
      if (refreshed) return apiClient(error.config);
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);
```

---

## 9. External APIs

### ViaCEP API

- **Purpose:** Resolver CEP para endereco (bairro, cidade, estado)
- **Documentation:** https://viacep.com.br
- **Base URL:** https://viacep.com.br/ws/
- **Authentication:** Nenhuma (publico)
- **Rate Limits:** Sem limites documentados, usar com moderacao

**Key Endpoints:**
- `GET /{cep}/json` — Retorna endereco completo por CEP

**Integration Notes:** Cache em Redis (TTL 30 dias) — CEPs nao mudam frequentemente.

### Insurtech Partner API (Simple2u / 88i)

- **Purpose:** Gerar cotacoes e emitir apolices de seguros contra calamidades
- **Documentation:** A obter via parceria comercial
- **Base URL:** A definir por parceiro
- **Authentication:** API Key ou OAuth2 (definido pelo parceiro)
- **Rate Limits:** A definir por contrato

**Key Endpoints (interface esperada):**
- `POST /quotes` — Gerar cotacao
- `GET /plans` — Listar planos disponiveis
- `POST /policies` — Emitir apolice

**Integration Notes:** Mock adapter disponivel para desenvolvimento. Adapter Pattern permite trocar providers sem alterar logica.

### Asaas Payment Gateway

- **Purpose:** Processar pagamentos Pix e cartao com suporte a recorrencia
- **Documentation:** https://docs.asaas.com
- **Base URL:** https://api.asaas.com/v3
- **Authentication:** API Key via header
- **Rate Limits:** 100 req/min

**Key Endpoints:**
- `POST /payments` — Criar cobranca (Pix ou cartao)
- `GET /payments/{id}` — Status da cobranca
- `POST /subscriptions` — Criar assinatura recorrente
- Webhook para notificacao de pagamento

**Integration Notes:** Webhooks verificados via assinatura HMAC. Asaas escolhido por suporte nativo a Pix recorrente no Brasil.

---

## 10. Core Workflows

### Quotation to Policy Workflow

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant W as Next.js
    participant A as NestJS API
    participant R as Redis
    participant DB as PostgreSQL
    participant I as Insurtech API
    participant P as Asaas (Payment)
    participant E as AWS SES

    U->>W: Preenche wizard de cotacao
    W->>A: POST /quotes {cep, property, user}
    A->>R: Check cache
    R-->>A: Miss
    A->>I: getQuote(params)
    I-->>A: Lista de planos/precos
    A->>DB: Save quotes
    A->>R: Cache quotes (30min)
    A-->>W: Lista de cotacoes
    W-->>U: Exibe comparador

    U->>W: Seleciona plano, vai para checkout
    W->>A: POST /payments {quoteId, method: PIX}
    A->>P: Criar cobranca Pix
    P-->>A: QR Code + copia-cola
    A->>DB: Save payment (PENDING)
    A-->>W: QR Code data
    W-->>U: Exibe QR Code

    P->>A: Webhook: payment confirmed
    A->>DB: Update payment (PAID)
    A->>I: createPolicy(quoteData)
    I-->>A: providerPolicyId
    A->>DB: Create policy (ACTIVE)
    A->>E: Send confirmation email + PDF
    A-->>W: Policy created (via polling)
    W-->>U: Tela de confirmacao
```

---

## 11. Unified Project Structure

```
seg360/
├── .github/
│   └── workflows/
│       ├── ci.yml                # Lint → Test → Build
│       └── deploy.yml            # Deploy staging/production
├── apps/
│   ├── web/                      # Next.js 14+ frontend
│   │   ├── src/
│   │   │   ├── app/              # App Router pages
│   │   │   ├── components/       # React components
│   │   │   ├── hooks/            # Custom hooks
│   │   │   ├── services/         # API client layer
│   │   │   ├── stores/           # Zustand stores
│   │   │   ├── lib/              # Utilities
│   │   │   └── styles/           # Global CSS
│   │   ├── public/               # Static assets
│   │   ├── next.config.js
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   └── api/                      # NestJS backend
│       ├── src/
│       │   ├── common/           # Guards, filters, pipes, decorators
│       │   ├── modules/          # Feature modules
│       │   ├── prisma/           # Schema, migrations, seed
│       │   ├── config/           # App configuration
│       │   └── main.ts
│       ├── test/                 # E2E tests
│       ├── Dockerfile
│       ├── tsconfig.json
│       └── package.json
├── packages/
│   └── shared/                   # Shared types & utils
│       ├── src/
│       │   ├── types/            # TypeScript interfaces & enums
│       │   ├── constants/        # Shared constants
│       │   ├── validations/      # Zod schemas
│       │   └── utils/            # Shared utility functions
│       ├── tsconfig.json
│       └── package.json
├── docker-compose.yml            # PostgreSQL + Redis local
├── .env.example
├── package.json                  # Root with workspaces
├── turbo.json                    # Turborepo config
├── tsconfig.base.json            # Shared TS config
└── docs/                         # Project documentation
```

---

## 12. Development Workflow

### Prerequisites

```bash
node >= 20.x
npm >= 10.x
docker >= 24.x
docker-compose >= 2.x
```

### Initial Setup

```bash
git clone https://github.com/inematds/seg360.git
cd seg360
npm install
cp .env.example .env
docker compose up -d          # PostgreSQL + Redis
npx prisma migrate dev        # Run migrations
npx prisma db seed            # Seed risk data
```

### Development Commands

```bash
# Start all services (frontend + backend)
npm run dev

# Start frontend only
npm run dev --workspace=apps/web

# Start backend only
npm run dev --workspace=apps/api

# Run all tests
npm test

# Run frontend tests
npm test --workspace=apps/web

# Run backend tests
npm test --workspace=apps/api

# Run E2E tests
npm run test:e2e

# Lint all
npm run lint

# Prisma commands
npm run prisma:migrate --workspace=apps/api    # Create migration
npm run prisma:generate --workspace=apps/api   # Generate client
npm run prisma:studio --workspace=apps/api     # Open Prisma Studio
```

### Environment Configuration

```bash
# apps/web/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000

# apps/api/.env
DATABASE_URL=postgresql://seg360:seg360@localhost:5432/seg360
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-jwt-secret-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars
ASAAS_API_KEY=your-asaas-api-key
ASAAS_WEBHOOK_SECRET=your-webhook-secret
AWS_SES_REGION=sa-east-1
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
S3_BUCKET=seg360-policies
VIACEP_BASE_URL=https://viacep.com.br/ws
```

---

## 13. Deployment Architecture

### Deployment Strategy

**Frontend Deployment:**
- **Platform:** Vercel
- **Build Command:** `npm run build --workspace=apps/web`
- **Output Directory:** `apps/web/.next`
- **CDN/Edge:** Vercel Edge Network (global, automatico)

**Backend Deployment:**
- **Platform:** AWS ECS Fargate
- **Build Command:** `docker build -f apps/api/Dockerfile .`
- **Deployment Method:** Docker container via ECR → ECS Fargate

### Environments

| Environment | Frontend URL | Backend URL | Purpose |
|-------------|-------------|-------------|---------|
| Development | http://localhost:3000 | http://localhost:3001 | Local development |
| Staging | https://staging.seg360.com.br | https://api-staging.seg360.com.br | Pre-production |
| Production | https://seg360.com.br | https://api.seg360.com.br | Live |

---

## 14. Security and Performance

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

## 15. Testing Strategy

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

## 16. Coding Standards

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

## 17. Monitoring and Observability

### Monitoring Stack

- **Frontend Monitoring:** Vercel Analytics (Core Web Vitals, performance)
- **Backend Monitoring:** AWS CloudWatch (ECS metrics, custom metrics)
- **Error Tracking:** Sentry (frontend + backend, source maps, release tracking)
- **Logging:** Pino (JSON estruturado) → CloudWatch Logs

### Key Metrics

**Frontend:** Core Web Vitals (LCP, FID, CLS), JS errors, API latency, page views por rota
**Backend:** Request rate, error rate (5xx), P95 latency, DB query time, cache hit rate, active policies, daily quotes
