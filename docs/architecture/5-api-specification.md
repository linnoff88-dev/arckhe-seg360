# 5. API Specification

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
