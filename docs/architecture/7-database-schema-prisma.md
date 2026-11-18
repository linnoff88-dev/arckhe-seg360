# 7. Database Schema (Prisma)

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
