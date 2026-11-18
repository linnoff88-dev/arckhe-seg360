# 8. Frontend Architecture

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
