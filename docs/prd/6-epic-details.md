# 6. Epic Details

### Epic 1: Foundation & Auth

**Goal**: Estabelecer a base tecnica do projeto com monorepo configurado, CI/CD funcional, sistema de autenticacao completo e perfis de usuario. Ao final deste epic, deve ser possivel registrar-se, fazer login e ter acesso ao sistema conforme o perfil (consumidor, corretor, admin). A landing page basica com navegacao estara funcional.

#### Story 1.1: Project Scaffolding & CI/CD

As a developer,
I want a fully configured monorepo with CI/CD pipeline,
so that the team can develop, test and deploy with confidence from day one.

**Acceptance Criteria:**
1. Monorepo criado com workspaces: `apps/web` (Next.js 14+), `apps/api` (NestJS), `packages/shared`
2. TypeScript configurado em todos os workspaces com strict mode
3. ESLint + Prettier configurados com regras compartilhadas
4. PostgreSQL e Redis configurados via Docker Compose para desenvolvimento local
5. Prisma configurado com schema inicial (modelo User basico) e primeira migracao executada
6. GitHub Actions pipeline: lint → test → build em PRs
7. README com instrucoes de setup local (npm install, docker compose up, prisma migrate)
8. Health check endpoint (`GET /api/health`) retornando status 200 com informacoes de versao e conectividade do banco
9. Pagina inicial do Next.js renderizando com layout basico (header, footer, slot de conteudo)

#### Story 1.2: Authentication System

As a user (consumer or broker),
I want to register and login securely,
so that I can access my personalized dashboard.

**Acceptance Criteria:**
1. Endpoint de registro (`POST /api/auth/register`) aceitando: email, password, name, role (consumer/broker)
2. Endpoint de login (`POST /api/auth/login`) retornando JWT access token (15min) + refresh token (7d)
3. Endpoint de refresh (`POST /api/auth/refresh`) para renovacao de tokens
4. Senhas armazenadas com bcrypt (salt rounds >= 10)
5. Validacao de email unico no registro com mensagem de erro clara
6. Validacao de senha: minimo 8 caracteres, 1 maiuscula, 1 numero
7. Frontend: paginas de registro e login com formularios validados (react-hook-form + zod)
8. Frontend: contexto de autenticacao global com persistencia de token e redirect automatico
9. Middleware de autenticacao no backend protegendo rotas que exigem login
10. Rate limiting no login: maximo 5 tentativas por IP em 15 minutos

#### Story 1.3: User Profiles & Role-Based Access

As a platform administrator,
I want role-based access control,
so that consumers, brokers and admins see only what's relevant to them.

**Acceptance Criteria:**
1. Modelo User no Prisma com campos: id, email, name, role (CONSUMER, BROKER, ADMIN), phone, cpf (optional), createdAt, updatedAt
2. Guard de autorizacao no NestJS verificando role do usuario em rotas protegidas
3. Endpoint `GET /api/users/me` retornando perfil do usuario logado
4. Endpoint `PATCH /api/users/me` para atualizar dados do perfil (name, phone)
5. Frontend: pagina de perfil do usuario com formulario de edicao
6. Frontend: navegacao condicional mostrando menu diferente para consumer vs broker vs admin
7. Seed de usuario admin padrao para desenvolvimento local
8. Testes unitarios para guards de autorizacao cobrindo os 3 roles

#### Story 1.4: Landing Page & Navigation

As a visitor,
I want to see a professional landing page that explains the platform,
so that I understand the value proposition and am motivated to use the risk simulator.

**Acceptance Criteria:**
1. Hero section com headline sobre protecao contra calamidades, CTA para simulador de risco e imagem/ilustracao
2. Secao "Como Funciona" com 3-4 passos visuais (simule risco → compare planos → contrate online → fique protegido)
3. Secao de prova social com numeros (prejuizos por desastres, gap de cobertura, familias afetadas)
4. Secao de FAQ com perguntas frequentes sobre seguro contra calamidades
5. Footer com links institucionais, contato e redes sociais
6. Header responsivo com navegacao: Home, Simulador de Risco, Para Corretores, Login/Cadastro
7. SEO basico: meta tags, Open Graph, sitemap.xml
8. Pagina renderizada via SSR para performance e SEO
9. Mobile-first: layout funcional em telas a partir de 320px

---

### Epic 2: Risk Simulator

**Goal**: Implementar o simulador de risco por CEP — a feature central de aquisicao, educacao e viralidade da plataforma. O simulador usa dados publicos para mostrar ao usuario o nivel de risco na sua regiao, historico de desastres e prejuizo medio, motivando a busca por protecao.

#### Story 2.1: CEP Risk Data Service

As a backend developer,
I want a service that resolves CEP to risk data,
so that the risk simulator can show accurate disaster risk information per location.

**Acceptance Criteria:**
1. Integracao com API de CEP (ViaCEP ou similar) para resolver CEP → bairro, cidade, estado, coordenadas
2. Modelo RiskData no Prisma: id, cep, city, state, neighborhood, riskLevel (LOW/MEDIUM/HIGH/VERY_HIGH), riskTypes (array: flood, landslide, windstorm, hail), avgDamage (valor medio de prejuizo), incidentCount12m, lastUpdated
3. Seed de dados de risco para CEPs de regioes conhecidas (RS, RJ, SP litoral, SC, BA) baseados em dados publicos do Cemaden
4. Endpoint `GET /api/risk/:cep` retornando dados de risco com cache Redis (TTL 24h)
5. Quando CEP nao tem dados de risco especificos, retornar dados agregados da cidade/estado com flag indicando "dados aproximados"
6. Tempo de resposta < 2 segundos (NFR1)
7. Rate limiting: maximo 30 consultas por IP em 1 minuto
8. Testes unitarios para o servico de risco cobrindo: CEP valido com dados, CEP valido sem dados especificos (fallback), CEP invalido

#### Story 2.2: Risk Simulator Frontend

As a consumer,
I want to enter my CEP and see my disaster risk level visually,
so that I understand the real risk in my neighborhood and feel motivated to get protection.

**Acceptance Criteria:**
1. Componente de input de CEP com mascara (00000-000) e validacao em tempo real
2. Ao submeter CEP valido, exibir resultado com: nivel de risco (badge colorido), tipos de risco predominantes (icones), numero de ocorrencias nos ultimos 12 meses, prejuizo medio por ocorrencia
3. Exibir comparacao visual: "Prejuizo medio: R$X vs Protecao: R$Y/mes" (FR9)
4. CTA prominente: "Quero me proteger" direcionando para cotacao (placeholder ate Epic 3)
5. Exibir mensagem contextual baseada no nivel de risco (ex: ALTO → "Sua regiao teve 7 ocorrencias no ultimo ano")
6. Loading state com skeleton enquanto busca dados
7. Tratamento de erros: CEP invalido, CEP nao encontrado, timeout da API
8. Componente compartilhavel: botao para copiar link do resultado (URL com CEP como parametro)
9. Pagina acessivel via URL direta: `/simulador?cep=01310100` para compartilhamento
10. Design responsivo mobile-first com resultado visualmente impactante

#### Story 2.3: SEO Landing Pages by Region

As a marketing team,
I want auto-generated SEO pages for high-risk regions,
so that organic traffic discovers the platform when searching about disasters in their area.

**Acceptance Criteria:**
1. Rota dinamica `/risco/[estado]/[cidade]` renderizada via SSR/SSG
2. Conteudo gerado a partir dos dados de risco: titulo com cidade, nivel de risco, tipos de desastre, historico
3. Meta tags e Open Graph otimizados por pagina (titulo, descricao, imagem social)
4. Structured data (JSON-LD) para rich snippets no Google
5. CTA integrado para simulador de risco com CEP pre-preenchido (quando possivel)
6. Paginas geradas para pelo menos as 50 cidades com maior risco nos dados seed
7. Sitemap.xml atualizado incluindo todas as paginas regionais
8. Breadcrumb navegavel: Home > Risco > Estado > Cidade
9. Tempo de carregamento < 2.5s (NFR3)

---

### Epic 3: Quotation Engine

**Goal**: Integrar com insurtechs parceiras para oferecer cotacao instantanea de seguros contra calamidades. Incluir comparador de coberturas para que o consumidor entenda o que cada plano oferece e o que nao oferece, permitindo decisao informada.

#### Story 3.1: Insurtech API Integration Service

As a backend developer,
I want an abstraction layer for insurtech partner APIs,
so that the platform can generate quotes from multiple providers through a unified interface.

**Acceptance Criteria:**
1. Interface `InsurtechProvider` definida em packages/shared com metodos: `getQuote(params)`, `getPlans()`, `getPlanDetails(planId)`
2. Implementacao de pelo menos um provider concreto (mock baseado na API Simple2u ou 88i)
3. Modelo Quote no Prisma: id, userId, cep, riskLevel, providerName, planName, monthlyPremium, coverageAmount, coverageDetails (JSON), validUntil, createdAt
4. Endpoint `POST /api/quotes` aceitando: cep, propertyType, propertyValue, desiredCoverage e retornando lista de cotacoes de todos os providers
5. Cache de cotacoes em Redis (TTL 30min) para evitar chamadas duplicadas
6. Timeout de 5s por provider com fallback graceful (se um provider falhar, retornar os demais)
7. Logging de todas as chamadas a APIs externas para auditoria e debug
8. Testes unitarios com mocks dos providers cobrindo: resposta normal, timeout, erro de provider

#### Story 3.2: Coverage Comparator

As a consumer,
I want to compare coverage plans side by side,
so that I clearly understand what each plan covers and what it doesn't before deciding.

**Acceptance Criteria:**
1. Pagina `/cotacao/comparar` exibindo cards de planos lado a lado (max 3 por vez em desktop, carrossel em mobile)
2. Cada card mostra: nome do plano, preco mensal, valor de cobertura, lista de itens cobertos (checkmark verde) e NAO cobertos (X vermelho)
3. Itens de cobertura padronizados: enchente, deslizamento, vendaval, granizo, danos eletricos, moradia temporaria, salvados
4. Filtro por tipo de cobertura (ex: "mostrar apenas planos com cobertura de enchente")
5. Ordenacao: menor preco, maior cobertura, melhor custo-beneficio (cobertura/preco)
6. Botao "Contratar este plano" em cada card direcionando para wizard de contratacao (Epic 4)
7. Tooltip explicativo em cada item de cobertura (linguagem simples, sem jargao)
8. Indicador visual "Mais Popular" ou "Melhor Custo-Beneficio" baseado em dados reais
9. Estado de loading e estado vazio (nenhuma cotacao disponivel para o perfil)
10. Link para refazer simulacao de risco se usuario quiser ajustar parametros

#### Story 3.3: Quotation Wizard

As a consumer,
I want a step-by-step quotation flow,
so that I can get personalized insurance quotes quickly and easily.

**Acceptance Criteria:**
1. Wizard em 3 passos: (1) Dados do Imovel, (2) Dados Pessoais, (3) Resultado/Comparacao
2. Passo 1: CEP (pre-preenchido se veio do simulador), tipo de imovel (casa/apartamento), valor estimado, area (m²)
3. Passo 2: Nome completo, CPF, email, telefone — com validacao em tempo real
4. Passo 3: Redireciona para comparador de coberturas (Story 3.2) com cotacoes geradas
5. Dados do wizard persistidos no estado (nao perdidos ao navegar entre passos)
6. Indicador de progresso visual mostrando o passo atual
7. Validacao inline em cada campo com mensagens em portugues
8. Botoes "Voltar" e "Proximo" em cada passo
9. Se usuario estiver logado, pre-preencher dados pessoais do perfil
10. Salvar cotacao no banco vinculada ao usuario (se logado) ou ao email informado

---

### Epic 4: Digital Contracting

**Goal**: Implementar o fluxo completo de contratacao digital — do checkout ao pagamento, assinatura e emissao de apolice. O consumidor deve conseguir contratar um seguro contra calamidade em minutos, 100% online.

#### Story 4.1: Checkout & Payment Integration

As a consumer,
I want to pay for my insurance plan via Pix or credit card,
so that I can complete the purchase quickly and securely.

**Acceptance Criteria:**
1. Pagina de checkout com resumo do plano selecionado: coberturas, valor mensal, vigencia
2. Integracao com gateway de pagamento (Asaas, Stripe ou Mercado Pago) para Pix e cartao de credito
3. Modelo Payment no Prisma: id, userId, quoteId, method (PIX/CARD), amount, status (PENDING/PAID/FAILED/REFUNDED), gatewayId, paidAt, createdAt
4. Para Pix: gerar QR Code e codigo copia-cola com validade de 30 minutos
5. Para cartao: formulario seguro (tokenizado pelo gateway) com validacao
6. Webhook do gateway para atualizar status do pagamento automaticamente
7. Tela de confirmacao de pagamento com status em tempo real (polling ou webhook)
8. Tratamento de pagamento expirado (Pix) e recusado (cartao) com opcao de tentar novamente
9. Logging de todas as transacoes para auditoria (NFR10)
10. Pagamento recorrente mensal configurado no gateway para modelo assinatura

#### Story 4.2: Policy Issuance

As a consumer,
I want to receive my insurance policy immediately after payment,
so that I know I'm protected right away.

**Acceptance Criteria:**
1. Modelo Policy no Prisma: id, userId, quoteId, paymentId, policyNumber (unico), providerPolicyId, status (ACTIVE/CANCELLED/EXPIRED), startDate, endDate, coverageDetails (JSON), monthlyPremium, createdAt
2. Apos confirmacao de pagamento, criar Policy automaticamente com status ACTIVE
3. Gerar numero de apolice unico no formato SEG360-YYYYMMDD-XXXXX
4. Enviar email de confirmacao com: numero da apolice, resumo de coberturas, data de vigencia, PDF em anexo (geracao basica)
5. Endpoint `GET /api/policies/:id` retornando detalhes da apolice para o painel do consumidor
6. Endpoint `GET /api/policies` listando todas as apolices do usuario logado
7. Comunicacao com API da insurtech parceira para registro formal da apolice (ou mock no MVP)
8. Testes para o fluxo completo: pagamento confirmado → policy criada → email enviado

#### Story 4.3: Subscription Management

As a consumer,
I want to manage my insurance subscription,
so that I can cancel or update my payment method when needed.

**Acceptance Criteria:**
1. Endpoint `POST /api/policies/:id/cancel` para cancelamento com data efetiva (fim do periodo pago)
2. Endpoint `PATCH /api/policies/:id/payment-method` para atualizacao de metodo de pagamento
3. Email de confirmacao de cancelamento com data efetiva e orientacoes
4. Email de lembrete de renovacao 7 dias antes do vencimento mensal
5. Tratamento de falha de pagamento recorrente: 3 tentativas automaticas em 3, 7 e 14 dias; apos isso, suspender apolice
6. Pagina no painel do consumidor para visualizar status da assinatura e realizar acoes (cancelar, trocar cartao)
7. Historico de pagamentos no painel do consumidor

---

### Epic 5: Broker Platform

**Goal**: Criar o painel do corretor com ferramentas para gestao de leads, acompanhamento de vendas, comissoes e links personalizados. Corretores devem conseguir acessar nicho lucrativo de calamidades com ferramentas que resolvem suas dores (falta de leads, operacao manual, sem presenca digital).

#### Story 5.1: Broker Onboarding & Verification

As a broker,
I want to register on the platform with my SUSEP credentials,
so that I can start selling disaster insurance through Seg360.

**Acceptance Criteria:**
1. Modelo BrokerProfile no Prisma: id, userId, susepRegistration, companyName, cnpj (optional), region, status (PENDING/ACTIVE/SUSPENDED), verifiedAt, createdAt
2. Fluxo de onboarding do corretor apos registro: formulario com dados profissionais (registro SUSEP, CNPJ, regiao de atuacao)
3. Validacao basica do numero de registro SUSEP (formato correto)
4. Status PENDING ate verificacao manual pelo admin (MVP — verificacao automatica na Fase 2)
5. Email de boas-vindas com orientacoes sobre a plataforma
6. Endpoint `GET /api/brokers/me` retornando perfil completo do corretor
7. Endpoint admin `PATCH /api/admin/brokers/:id/verify` para aprovar corretor
8. Testes para fluxo: registro → pending → verificacao → active

#### Story 5.2: Broker Dashboard & Leads

As a broker,
I want a dashboard with my leads, quotes and sales,
so that I can manage my business efficiently on the platform.

**Acceptance Criteria:**
1. Dashboard do corretor em `/corretor/dashboard` com metricas: leads recebidos (mes), cotacoes geradas, vendas concluidas, comissao total (mes)
2. Lista de leads com: nome, CEP, nivel de risco, data de entrada, status (NOVO/CONTATADO/CONVERTIDO/PERDIDO)
3. Modelo Lead no Prisma: id, brokerId, consumerName, consumerEmail, consumerPhone, cep, riskLevel, status, source, createdAt
4. Distribuicao de leads: quando consumidor solicita cotacao em regiao com corretores ativos, lead e criado automaticamente para corretor(es) da regiao
5. Corretor pode atualizar status do lead e adicionar notas
6. Filtros por: status, periodo, CEP/regiao
7. Notificacao por email quando novo lead e atribuido
8. Dados de cotacao e venda vinculados ao corretor que gerou o lead

#### Story 5.3: Broker Referral Links & Commission Tracking

As a broker,
I want personalized referral links and commission tracking,
so that I can share the risk simulator with my clients and earn commissions on sales.

**Acceptance Criteria:**
1. Endpoint `POST /api/brokers/referral-link` gerando link personalizado: `/simulador?ref=BROKER_CODE`
2. Modelo Referral no Prisma: id, brokerId, code (unico), clicks, quotesGenerated, salesCompleted, createdAt
3. Rastreamento: cliques no link, cotacoes geradas, vendas concluidas atraves do link
4. Modelo Commission no Prisma: id, brokerId, policyId, amount, percentage, status (PENDING/PAID), paidAt, createdAt
5. Comissao calculada automaticamente na venda baseada no plano e percentual do corretor
6. Pagina de comissoes no painel do corretor com: historico, valor pendente, valor pago
7. Export de relatorio de comissoes em CSV
8. Testes para rastreamento: clique no link → cotacao → venda → comissao criada

---

### Epic 6: Consumer Dashboard & Admin

**Goal**: Completar a experiencia do consumidor com painel de gestao de apolices e implementar painel administrativo para gestao operacional da plataforma (seguradoras, corretores, apolices, metricas).

#### Story 6.1: Consumer Dashboard

As a consumer,
I want a dashboard to view and manage my policies,
so that I can check my coverage status and access my documents anytime.

**Acceptance Criteria:**
1. Dashboard do consumidor em `/painel` com: apolices ativas (cards com status, cobertura, proximo vencimento), historico de simulacoes
2. Pagina de detalhes da apolice: numero, coberturas, vigencia, status, historico de pagamentos, botao de download do PDF
3. Indicador visual de protecao: "Voce esta protegido" (com apolice ativa) ou "Voce NAO esta protegido" (sem apolice)
4. Link rapido para refazer simulacao de risco ou gerar nova cotacao
5. Secao de notificacoes: lembretes de renovacao, alertas de status
6. Design responsivo com foco mobile

#### Story 6.2: Admin Panel - Platform Management

As an admin,
I want a management panel to oversee the platform operations,
so that I can manage partners, brokers and monitor key metrics.

**Acceptance Criteria:**
1. Painel admin em `/admin` protegido por role ADMIN
2. Dashboard com metricas: total de apolices ativas, GMV do mes, numero de corretores ativos, numero de cotacoes, taxa de conversao
3. CRUD de seguradoras parceiras: Modelo InsurancePartner no Prisma (id, name, apiEndpoint, apiKey, status, commissionRate, createdAt)
4. Lista de corretores com status e acoes (verificar, suspender)
5. Lista de apolices com filtros (status, periodo, corretor, seguradora)
6. Lista de pagamentos com filtros e status
7. Endpoint `GET /api/admin/metrics` retornando metricas agregadas
8. Paginacao em todas as listas (20 itens por pagina)

#### Story 6.3: Email Notifications System

As a platform user,
I want to receive relevant email notifications,
so that I'm informed about important events related to my insurance.

**Acceptance Criteria:**
1. Servico de email integrado (SendGrid, AWS SES ou similar) com templates HTML responsivos
2. Templates de email para: confirmacao de registro, boas-vindas do corretor, confirmacao de contratacao, lembrete de renovacao (7 dias antes), confirmacao de cancelamento, novo lead para corretor
3. Modelo EmailLog no Prisma: id, userId, templateId, subject, status (SENT/FAILED), sentAt
4. Endpoint interno de envio com retry automatico (max 3 tentativas) em caso de falha
5. Emails em portugues com branding basico da Seg360
6. Unsubscribe link funcional em emails de marketing (LGPD)
7. Testes para cada template garantindo renderizacao correta

---
