# 12. Development Workflow

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
