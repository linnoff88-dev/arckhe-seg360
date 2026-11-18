# 4. Data Models

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
