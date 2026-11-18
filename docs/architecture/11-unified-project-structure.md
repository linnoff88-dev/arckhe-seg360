# 11. Unified Project Structure

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
