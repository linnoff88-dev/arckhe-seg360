# 9. External APIs

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
