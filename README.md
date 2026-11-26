ï»¿<p align="center">
  <img src="docs/seg360-banner.png" alt="Seg360 ê¢â¬â Seguros contra Desastres no Brasil" width="800" />
</p>

<h1 align="center">Seg360 ê¢â¬â Marketplace de Seguros contra Calamidades</h1>

<p align="center">
  <strong>Protecao acessivel contra enchentes, deslizamentos, vendavais e granizo para o Brasil.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?logo=next.js" alt="Next.js 14" />
  <img src="https://img.shields.io/badge/NestJS-10-E0234E?logo=nestjs" alt="NestJS 10" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL 16" />
  <img src="https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma" alt="Prisma 5" />
  <img src="https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Testes-39%20passando-brightgreen" alt="39 testes" />
  <img src="https://img.shields.io/badge/Licenca-Proprietaria-red" alt="Licenca" />
</p>

---

## Indice

- [Sobre o Projeto](#sobre-o-projeto)
- [O Problema](#o-problema)
- [A Solucao](#a-solucao)
- [Funcionalidades](#funcionalidades)
- [Publico-Alvo](#publico-alvo)
- [Modelo de Negocio](#modelo-de-negocio)
- [Metricas de Sucesso](#metricas-de-sucesso)
- [Arquitetura Tecnica](#arquitetura-tecnica)
- [Tech Stack](#tech-stack)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Modelos de Dados](#modelos-de-dados)
- [API ê¢â¬â Endpoints](#api--endpoints)
- [Setup Local](#setup-local)
- [Scripts Disponiveis](#scripts-disponiveis)
- [Testes](#testes)
- [Deploy](#deploy)
- [Variaveis de Ambiente](#variaveis-de-ambiente)
- [Roadmap](#roadmap)
- [Contribuicao](#contribuicao)

---

## Sobre o Projeto

**Seg360** e o primeiro marketplace brasileiro especializado em seguros contra calamidades naturais. A plataforma conecta consumidores, corretores de seguros e seguradoras/insurtechs em um ecossistema digital focado em educacao sobre risco, cotacao instantanea e contratacao 100% online.

O nome "Seg360" representa a visao de **protecao 360 graus** contra desastres naturais ê¢â¬â cobrindo todos os tipos de risco (enchente, deslizamento, vendaval, granizo) em todas as regioes do Brasil.

---

## O Problema

O Brasil enfrenta uma crise crescente de desastres naturais com protecao de seguro quase inexistente:

| Indicador | Valor |
|-----------|-------|
| Prejuizos por desastres (2013-2024) | **R$ 732 bilhoes** |
| Prejuizos so em 2025 (ate abril) | **R$ 28,5 bilhoes** |
| Alertas do Cemaden em 2024 | **3.620** (recorde historico) |
| Lares com seguro contra enchente | **< 0,14%** (~126 mil de ~90 milhoes) |
| Residencias com seguro residencial | ~20%, mas < 1% cobre enchente |

### Por que as solucoes atuais falham

1. **Cobertura de enchente nao vem no plano basico** ê¢â¬â precisa ser contratada a parte e a maioria desconhece
2. **Vieses cognitivos** impedem a compra: otimismo ("nao vai acontecer comigo"), aversao a perda, inercia
3. **Processo burocratico**: contratacao complexa, linguagem tecnica, dependencia de corretor presencial
4. **Percepcao errada de preco**: consumidores acham que custa como seguro de carro, quando custa R$15-50/mes
5. **Nenhum player focado** especificamente em seguros contra calamidades/desastres naturais

---

## A Solucao

Seg360 se diferencia por:

- **Simulador de Risco por CEP**: Ferramenta viral que mostra o risco real de desastre na regiao do usuario usando dados publicos (Cemaden, IBGE, Defesa Civil)
- **Comparador de Coberturas**: Mostra claramente o que cada apolice cobre e o que NAO cobre, com linguagem simples
- **Cotacao em 60 segundos**: Processo 100% digital, wizard de 3 passos, sem burocracia
- **Micro-seguros acessiveis**: Planos a partir de R$9,90/mes via Pix, modelo assinatura sem fidelidade
- **Plataforma de Corretores**: Leads quentes, links de referencia, comissoes de 30-40% ê¢â¬â um nicho lucrativo para corretores diversificarem carteira

---

## Funcionalidades

### Para Consumidores

| Funcionalidade | Descricao |
|----------------|-----------|
| Simulador de Risco | Digite seu CEP e veja o nivel de risco, historico de desastres e prejuizo medio na sua regiao |
| Cotacao Instantanea | Wizard de 3 passos: dados do imovel, dados pessoais, resultado com planos comparados |
| Comparador de Coberturas | Cards lado a lado com checkmarks (cobre) e X (nao cobre) para cada cobertura |
| Contratacao Digital | Pagamento via Pix (QR Code) ou cartao de credito, emissao imediata de apolice |
| Painel do Consumidor | Apolices ativas, indicador de protecao, historico de simulacoes |
| Gestao de Assinatura | Cancelamento, historico de pagamentos, troca de metodo de pagamento |

### Para Corretores

| Funcionalidade | Descricao |
|----------------|-----------|
| Onboarding com SUSEP | Cadastro com validacao de registro SUSEP (15 digitos), status verificado por admin |
| Dashboard de Metricas | Leads recebidos, cotacoes geradas, vendas concluidas, comissao total do mes |
| Gestao de Leads | Lista com status (Novo/Contatado/Convertido/Perdido), filtros, notas |
| Links de Referencia | Link personalizado do simulador (`/simulador?ref=CODIGO`) com rastreamento de cliques, cotacoes e vendas |
| Comissoes | Historico, valor pendente e pago, calculado automaticamente na venda |

### Para Administradores

| Funcionalidade | Descricao |
|----------------|-----------|
| Metricas da Plataforma | Apolices ativas, GMV mensal, corretores ativos, taxa de conversao |
| Gestao de Corretores | Lista com status, acao de verificar/aprovar |
| Verificacao de Corretores | Workflow PENDING -> ACTIVE via painel admin |

### Funcionalidades Transversais

| Funcionalidade | Descricao |
|----------------|-----------|
| Autenticacao JWT | Access token (15min) + refresh token (7d), bcrypt, rate limiting |
| Perfis (RBAC) | Consumidor, Corretor, Admin ê¢â¬â com guards e navegacao condicional |
| Email Notifications | 6 templates HTML responsivos: registro, boas-vindas corretor, confirmacao apolice, renovacao, cancelamento, novo lead |
| Landing Page SEO | Hero, stats, "Como Funciona", FAQ, footer, meta tags, Open Graph |
| Paginas SEO Regionais | 10 paginas SSG por estado/cidade com JSON-LD e breadcrumbs |
| Sitemap XML | Gerado automaticamente incluindo paginas regionais |

---

## Publico-Alvo

### Consumidores (B2C)

Proprietarios ou inquilinos de imoveis em regioes com historico de enchente, deslizamento ou vendaval ê¢â¬â especialmente RS, litoral SP/RJ, BA, MG, SC. Pessoas que nao sabem que a cobertura de enchente e separada do seguro residencial e que desconhecem opcoes acessiveis.

### Corretores de Seguros (B2B)

Corretores registrados na SUSEP, especialmente independentes que buscam diversificar carteira. Hoje 70% da receita vem de auto (comissao 10-25%). No Seg360, acessam nicho lucrativo (comissao 30-40%) com leads quentes e ferramentas digitais.

### Seguradoras e Insurtechs (B2B)

Seguradoras que oferecem produtos de seguro residencial/calamidade (Simple2u, 88i), buscando novos canais de distribuicao digital.

---

## Modelo de Negocio

```
Consumidor ê¢ââ¬ê¢ââ¬compraê¢ââ¬ê¢ââ¬> Seg360 ê¢ââ¬ê¢ââ¬distribuiê¢ââ¬ê¢ââ¬> Insurtech/Seguradora
                         |
                    Take Rate (%)
                         |
              Corretor ê¢â Âê¢ââ¬ê¢ââ¬comissao (30-40%)
```

- **Modelo**: Embedded Insurance via API ê¢â¬â Seg360 distribui produtos de seguradoras parceiras
- **Receita**: Take rate sobre cada venda (porcentagem do premio mensal)
- **Pagamento**: Assinatura mensal sem fidelidade, via Pix ou cartao
- **Split**: Plataforma retêÂ©m comissao, repassa parcela ao corretor (quando aplicavel)

---

## Metricas de Sucesso

### Metas para 6 meses pos-lancamento

| Metrica | Meta |
|---------|------|
| Apolices vendidas | 1.000 |
| Corretores ativos | 50 |
| Simulacoes de risco | 50.000 |
| Tempo medio de cotacao | < 60 segundos |
| Conversao simulador -> cotacao | > 15% |
| Conversao cotacao -> contratacao | > 8% |
| NPS de corretores | > 60 |
| Unit economics | LTV > 3x CAC |

### KPIs Monitorados

- **GMV** (Gross Merchandise Value) ê¢â¬â Volume total de premios vendidos
- **Take Rate** ê¢â¬â % retida pela plataforma
- **CAC** ê¢â¬â Custo de aquisicao por cliente
- **LTV** ê¢â¬â Valor do cliente ao longo do tempo
- **Churn Rate** ê¢â¬â Taxa de cancelamento mensal
- **Corretores Ativos** ê¢â¬â Com pelo menos 1 venda/mes

---

## Arquitetura Tecnica

### Visao Geral

```
                    ê¢âÅê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢âÂ
                    ê¢ââ   Consumidor    ê¢ââ
                    ê¢ââ    Browser      ê¢ââ
                    ê¢ââê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢âÂ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢âË
                             ê¢ââ
                    ê¢âÅê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢âÂ¼ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢âÂ
                    ê¢ââ  Next.js 14     ê¢ââ  ê¢â Â Vercel (SSR/SSG/CSR)
                    ê¢ââ  App Router     ê¢ââ
                    ê¢ââ  Tailwind CSS   ê¢ââ
                    ê¢ââ  Zustand        ê¢ââ
                    ê¢ââê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢âÂ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢âË
                             ê¢ââ REST API
                    ê¢âÅê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢âÂ¼ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢âÂ
                    ê¢ââ  NestJS 10      ê¢ââ  ê¢â Â AWS ECS / Railway
                    ê¢ââ  10 Modulos     ê¢ââ
                    ê¢ââ  JWT + Guards   ê¢ââ
                    ê¢ââê¢ââ¬ê¢ââ¬ê¢âÂ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢âÂ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢âÂ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢âË
                       ê¢ââ     ê¢ââ    ê¢ââ
              ê¢âÅê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢âÂ¼ê¢âÂ ê¢âÅê¢ââ¬ê¢ââ¬ê¢âÂ¼ê¢ââ¬ê¢ââ¬ê¢âÂ ê¢âÅê¢âÂ¼ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢âÂ
              ê¢ââPostgreSQLê¢ââ ê¢ââRedisê¢ââ ê¢ââ APIs     ê¢ââ
              ê¢ââ  Prisma  ê¢ââ ê¢ââCacheê¢ââ ê¢ââ Externas ê¢ââ
              ê¢ââ 11 modelsê¢ââ ê¢ââ     ê¢ââ ê¢ââ          ê¢ââ
              ê¢ââê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢âË ê¢ââê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢âË ê¢ââê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢âË
                                    ê¢âÅê¢ââ¬ ViaCEP
                                    ê¢âÅê¢ââ¬ Insurtechs
                                    ê¢ââê¢ââ¬ Payment Gateway
```

### Padroes Arquiteturais

| Padrao | Aplicacao |
|--------|-----------|
| **Monolito Modular** | Backend NestJS com 10 modulos por dominio |
| **Adapter Pattern** | Interface `InsurtechProvider` com MockAdapter (swap para providers reais) |
| **Guard-Based RBAC** | JwtAuthGuard + RolesGuard + ThrottlerGuard com @Public() bypass |
| **API Client Layer** | Frontend acessa backend via camada de services (nunca fetch direto) |
| **SSR/SSG + CSR** | Paginas publicas em SSG (SEO), dashboards em CSR (auth) |
| **Global Module** | EmailModule disponivel em todos os modulos |

---

## Tech Stack

| Camada | Tecnologia | Versao |
|--------|-----------|--------|
| **Frontend** | Next.js (App Router) | 14+ |
| **Estilos** | Tailwind CSS | 3.4+ |
| **Estado** | Zustand | 5.x |
| **Formularios** | react-hook-form + Zod | 7.x / 3.x |
| **Backend** | NestJS | 10+ |
| **ORM** | Prisma | 5+ |
| **Banco** | PostgreSQL | 16 |
| **Cache** | Redis | 7 |
| **Auth** | JWT (Passport) + bcrypt | - |
| **HTTP Client** | Axios | 1.x |
| **Linguagem** | TypeScript | 5.4+ |
| **Testes** | Jest + Supertest | 29.x |
| **Infra Dev** | Docker Compose | 2.x |
| **CI/CD** | GitHub Actions | - |

---

## Estrutura do Projeto

```
seg360/
ê¢âÅê¢ââ¬ê¢ââ¬ apps/
ê¢ââ   ê¢âÅê¢ââ¬ê¢ââ¬ web/                        # Frontend Next.js 14 (porta 3000)
ê¢ââ   ê¢ââ   ê¢âÅê¢ââ¬ê¢ââ¬ src/
ê¢ââ   ê¢ââ   ê¢ââ   ê¢âÅê¢ââ¬ê¢ââ¬ app/                # App Router ê¢â¬â 15 rotas
ê¢ââ   ê¢ââ   ê¢ââ   ê¢ââ   ê¢âÅê¢ââ¬ê¢ââ¬ page.tsx        # Landing page (SSR)
ê¢ââ   ê¢ââ   ê¢ââ   ê¢ââ   ê¢âÅê¢ââ¬ê¢ââ¬ simulador/      # Simulador de risco por CEP
ê¢ââ   ê¢ââ   ê¢ââ   ê¢ââ   ê¢âÅê¢ââ¬ê¢ââ¬ risco/          # Paginas SEO regionais (SSG)
ê¢ââ   ê¢ââ   ê¢ââ   ê¢ââ   ê¢âÅê¢ââ¬ê¢ââ¬ cotacao/        # Wizard + comparador
ê¢ââ   ê¢ââ   ê¢ââ   ê¢ââ   ê¢âÅê¢ââ¬ê¢ââ¬ checkout/       # Pagamento (Pix/Cartao)
ê¢ââ   ê¢ââ   ê¢ââ   ê¢ââ   ê¢âÅê¢ââ¬ê¢ââ¬ confirmacao/    # Confirmacao de apolice
ê¢ââ   ê¢ââ   ê¢ââ   ê¢ââ   ê¢âÅê¢ââ¬ê¢ââ¬ painel/         # Dashboard consumidor
ê¢ââ   ê¢ââ   ê¢ââ   ê¢ââ   ê¢âÅê¢ââ¬ê¢ââ¬ corretor/       # Dashboard corretor
ê¢ââ   ê¢ââ   ê¢ââ   ê¢ââ   ê¢âÅê¢ââ¬ê¢ââ¬ admin/          # Painel administrativo
ê¢ââ   ê¢ââ   ê¢ââ   ê¢ââ   ê¢âÅê¢ââ¬ê¢ââ¬ login/          # Login
ê¢ââ   ê¢ââ   ê¢ââ   ê¢ââ   ê¢âÅê¢ââ¬ê¢ââ¬ cadastro/       # Registro
ê¢ââ   ê¢ââ   ê¢ââ   ê¢ââ   ê¢ââê¢ââ¬ê¢ââ¬ perfil/         # Perfil do usuario
ê¢ââ   ê¢ââ   ê¢ââ   ê¢âÅê¢ââ¬ê¢ââ¬ components/         # Componentes React
ê¢ââ   ê¢ââ   ê¢ââ   ê¢âÅê¢ââ¬ê¢ââ¬ services/           # API client layer (axios)
ê¢ââ   ê¢ââ   ê¢ââ   ê¢âÅê¢ââ¬ê¢ââ¬ stores/             # Zustand (auth, quote)
ê¢ââ   ê¢ââ   ê¢ââ   ê¢ââê¢ââ¬ê¢ââ¬ lib/                # Utilitarios
ê¢ââ   ê¢ââ   ê¢âÅê¢ââ¬ê¢ââ¬ tailwind.config.ts
ê¢ââ   ê¢ââ   ê¢ââê¢ââ¬ê¢ââ¬ package.json
ê¢ââ   ê¢ââ
ê¢ââ   ê¢ââê¢ââ¬ê¢ââ¬ api/                        # Backend NestJS 10 (porta 3001)
ê¢ââ       ê¢âÅê¢ââ¬ê¢ââ¬ src/
ê¢ââ       ê¢ââ   ê¢âÅê¢ââ¬ê¢ââ¬ common/             # Guards, decorators, filters
ê¢ââ       ê¢ââ   ê¢ââ   ê¢âÅê¢ââ¬ê¢ââ¬ guards/         # JwtAuthGuard, RolesGuard
ê¢ââ       ê¢ââ   ê¢ââ   ê¢ââê¢ââ¬ê¢ââ¬ decorators/     # @Public(), @Roles(), @CurrentUser()
ê¢ââ       ê¢ââ   ê¢âÅê¢ââ¬ê¢ââ¬ modules/            # 10 modulos de negocio
ê¢ââ       ê¢ââ   ê¢ââ   ê¢âÅê¢ââ¬ê¢ââ¬ health/         # GET /api/health
ê¢ââ       ê¢ââ   ê¢ââ   ê¢âÅê¢ââ¬ê¢ââ¬ auth/           # Register, login, refresh
ê¢ââ       ê¢ââ   ê¢ââ   ê¢âÅê¢ââ¬ê¢ââ¬ user/           # Perfil do usuario
ê¢ââ       ê¢ââ   ê¢ââ   ê¢âÅê¢ââ¬ê¢ââ¬ risk/           # Simulador de risco por CEP
ê¢ââ       ê¢ââ   ê¢ââ   ê¢âÅê¢ââ¬ê¢ââ¬ quotation/      # Motor de cotacao
ê¢ââ       ê¢ââ   ê¢ââ   ê¢âÅê¢ââ¬ê¢ââ¬ payment/        # Pagamentos (Pix/Cartao)
ê¢ââ       ê¢ââ   ê¢ââ   ê¢âÅê¢ââ¬ê¢ââ¬ policy/         # Emissao de apolices
ê¢ââ       ê¢ââ   ê¢ââ   ê¢âÅê¢ââ¬ê¢ââ¬ broker/         # Plataforma do corretor
ê¢ââ       ê¢ââ   ê¢ââ   ê¢âÅê¢ââ¬ê¢ââ¬ admin/          # Painel administrativo
ê¢ââ       ê¢ââ   ê¢ââ   ê¢ââê¢ââ¬ê¢ââ¬ email/          # Notificacoes (6 templates)
ê¢ââ       ê¢ââ   ê¢ââê¢ââ¬ê¢ââ¬ prisma/             # PrismaService
ê¢ââ       ê¢âÅê¢ââ¬ê¢ââ¬ prisma/
ê¢ââ       ê¢ââ   ê¢âÅê¢ââ¬ê¢ââ¬ schema.prisma       # 11 modelos
ê¢ââ       ê¢ââ   ê¢âÅê¢ââ¬ê¢ââ¬ migrations/         # 6 migrations
ê¢ââ       ê¢ââ   ê¢ââê¢ââ¬ê¢ââ¬ seed.ts             # Seed de dados de risco + admin
ê¢ââ       ê¢ââê¢ââ¬ê¢ââ¬ package.json
ê¢ââ
ê¢âÅê¢ââ¬ê¢ââ¬ packages/
ê¢ââ   ê¢ââê¢ââ¬ê¢ââ¬ shared/                     # Tipos e constantes compartilhados
ê¢ââ       ê¢ââê¢ââ¬ê¢ââ¬ src/
ê¢ââ           ê¢âÅê¢ââ¬ê¢ââ¬ types/              # Interfaces TypeScript
ê¢ââ           ê¢ââê¢ââ¬ê¢ââ¬ constants/          # Constantes do dominio
ê¢ââ
ê¢âÅê¢ââ¬ê¢ââ¬ docs/                           # Documentacao completa
ê¢ââ   ê¢âÅê¢ââ¬ê¢ââ¬ project-brief.md            # Brief do projeto
ê¢ââ   ê¢âÅê¢ââ¬ê¢ââ¬ prd.md                      # PRD (14 FRs, 12 NFRs, 6 Epics)
ê¢ââ   ê¢âÅê¢ââ¬ê¢ââ¬ architecture.md             # Arquitetura full-stack
ê¢ââ   ê¢âÅê¢ââ¬ê¢ââ¬ front-end-spec.md           # Spec de UI/UX
ê¢ââ   ê¢âÅê¢ââ¬ê¢ââ¬ stories/                    # 18 story files
ê¢ââ   ê¢ââê¢ââ¬ê¢ââ¬ relatorio-execucao-final.md # Relatorio final
ê¢ââ
ê¢âÅê¢ââ¬ê¢ââ¬ docker-compose.yml              # PostgreSQL 16 + Redis 7
ê¢âÅê¢ââ¬ê¢ââ¬ .env.example                    # Template de variaveis de ambiente
ê¢âÅê¢ââ¬ê¢ââ¬ package.json                    # Root ê¢â¬â npm workspaces
ê¢ââê¢ââ¬ê¢ââ¬ todo.md                         # Progresso de execucao
```

---

## Modelos de Dados

O banco PostgreSQL possui **11 modelos** gerenciados pelo Prisma ORM:

```
ê¢âÅê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢âÂ     ê¢âÅê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢âÂ     ê¢âÅê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢âÂ
ê¢ââ   User   ê¢ââê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬>ê¢ââ BrokerProfileê¢ââê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬>ê¢ââ   Lead   ê¢ââ
ê¢ââ          ê¢ââ     ê¢ââ              ê¢ââê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬>ê¢ââ Referral  ê¢ââ
ê¢ââ          ê¢ââ     ê¢ââ              ê¢ââê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬>ê¢ââCommission ê¢ââ
ê¢ââ          ê¢ââ     ê¢ââê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢âË     ê¢ââê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢âË
ê¢ââ          ê¢ââ
ê¢ââ          ê¢ââê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬>ê¢âÅê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢âÂê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬>ê¢âÅê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢âÂ
ê¢ââ          ê¢ââ     ê¢ââ  Quote   ê¢ââ     ê¢ââ  Policy  ê¢ââê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬>ê¢âÅê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢âÂ
ê¢ââ          ê¢ââê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬>ê¢ââ          ê¢ââ     ê¢ââ          ê¢ââ     ê¢ââ Payment  ê¢ââ
ê¢ââ          ê¢ââ     ê¢ââê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢âË     ê¢ââê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢âË     ê¢ââê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢âË
ê¢ââ          ê¢ââ
ê¢ââ          ê¢ââê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬>ê¢âÅê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢âÂ
ê¢ââ          ê¢ââ     ê¢ââ EmailLog ê¢ââ
ê¢ââê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢âË     ê¢ââê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢âË

ê¢âÅê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢âÂ
ê¢ââ RiskData ê¢ââ  (dados de risco por CEP ê¢â¬â independente)
ê¢ââê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢âË
```

| Modelo | Descricao | Campos-chave |
|--------|-----------|-------------|
| **User** | Usuario (consumidor/corretor/admin) | email, role, passwordHash |
| **BrokerProfile** | Perfil profissional do corretor | susepRegistration, status (PENDING/ACTIVE) |
| **RiskData** | Risco de calamidade por CEP | cep, riskLevel, riskTypes, avgDamage |
| **Quote** | Cotacao de seguro | providerName, monthlyPremium, coverageDetails (JSON) |
| **Payment** | Pagamento (unico ou recorrente) | method (PIX/CARD), status, gatewayId |
| **Policy** | Apolice emitida | policyNumber (SEG360-YYYYMMDD-XXXXX), status |
| **Lead** | Lead atribuido a corretor | consumerName, cep, status (NEW/CONTACTED/CONVERTED/LOST) |
| **Referral** | Link de referencia do corretor | code, clicks, quotesGenerated, salesCompleted |
| **Commission** | Comissao por venda | amount, percentage, status (PENDING/PAID) |
| **EmailLog** | Auditoria de emails enviados | templateId, status (SENT/FAILED) |
| **InsurancePartner** | Seguradora parceira (schema) | apiEndpoint, commissionRate |

---

## API ê¢â¬â Endpoints

Base URL: `http://localhost:3001/api`

### Autenticacao

| Metodo | Endpoint | Auth | Descricao |
|--------|----------|------|-----------|
| POST | `/auth/register` | Publico | Registro (email, password, name, role) |
| POST | `/auth/login` | Publico | Login ê¢â¬â retorna accessToken + refreshToken |
| POST | `/auth/refresh` | Publico | Renovacao de token |

### Usuario

| Metodo | Endpoint | Auth | Descricao |
|--------|----------|------|-----------|
| GET | `/users/me` | JWT | Perfil do usuario logado |
| PATCH | `/users/me` | JWT | Atualizar perfil |

### Simulador de Risco

| Metodo | Endpoint | Auth | Descricao |
|--------|----------|------|-----------|
| GET | `/risk/:cep` | Publico | Consultar risco por CEP (ViaCEP + fallback) |

### Cotacao

| Metodo | Endpoint | Auth | Descricao |
|--------|----------|------|-----------|
| POST | `/quotes` | Publico | Gerar cotacoes (cep, propertyType, propertyValue) |
| GET | `/quotes/:id` | JWT | Detalhes de uma cotacao |

### Pagamento

| Metodo | Endpoint | Auth | Descricao |
|--------|----------|------|-----------|
| POST | `/payments` | JWT | Criar pagamento (Pix ou cartao) |
| POST | `/payments/:id/confirm` | JWT | Confirmar pagamento |
| GET | `/payments` | JWT | Listar pagamentos do usuario |

### Apolice

| Metodo | Endpoint | Auth | Descricao |
|--------|----------|------|-----------|
| GET | `/policies` | JWT | Listar apolices do usuario |
| GET | `/policies/:id` | JWT | Detalhes da apolice |
| POST | `/policies/:id/cancel` | JWT | Cancelar apolice |

### Corretor

| Metodo | Endpoint | Auth | Descricao |
|--------|----------|------|-----------|
| POST | `/brokers/onboard` | JWT (Broker) | Onboarding com registro SUSEP |
| GET | `/brokers/dashboard` | JWT (Broker) | Metricas do dashboard |
| GET | `/brokers/leads` | JWT (Broker) | Listar leads |
| PATCH | `/brokers/leads/:id` | JWT (Broker) | Atualizar status do lead |
| POST | `/brokers/referral` | JWT (Broker) | Gerar link de referencia |
| GET | `/brokers/referrals` | JWT (Broker) | Listar referrals |
| GET | `/brokers/commissions` | JWT (Broker) | Listar comissoes |

### Admin

| Metodo | Endpoint | Auth | Descricao |
|--------|----------|------|-----------|
| GET | `/admin/metrics` | JWT (Admin) | Metricas da plataforma |
| GET | `/admin/brokers` | JWT (Admin) | Listar corretores |
| PATCH | `/admin/brokers/:id/verify` | JWT (Admin) | Verificar/aprovar corretor |

### Health

| Metodo | Endpoint | Auth | Descricao |
|--------|----------|------|-----------|
| GET | `/health` | Publico | Status da API |

---

## Setup Local

### Pre-requisitos

- **Node.js** >= 20.x
- **npm** >= 10.x
- **Docker** >= 24.x e **Docker Compose** >= 2.x

### Passo a passo

```bash
# 1. Clone o repositorio
git clone https://github.com/inematds/seg360.git
cd seg360

# 2. Instale as dependencias
npm install

# 3. Configure variaveis de ambiente
cp .env.example .env

# 4. Suba PostgreSQL e Redis
docker compose up -d

# 5. Gere o Prisma Client e rode as migrations
cd apps/api
DATABASE_URL=postgresql://seg360:seg360@localhost:5432/seg360 npx prisma generate
DATABASE_URL=postgresql://seg360:seg360@localhost:5432/seg360 npx prisma migrate dev

# 6. Popule o banco com dados iniciais (risco + admin)
DATABASE_URL=postgresql://seg360:seg360@localhost:5432/seg360 npx ts-node prisma/seed.ts

# 7. Volte para a raiz e inicie os servicos
cd ../..
```

### Iniciar o desenvolvimento

```bash
# Terminal 1 ê¢â¬â Backend (porta 3001)
cd apps/api && npm run dev

# Terminal 2 ê¢â¬â Frontend (porta 3000)
cd apps/web && npm run dev
```

### Acessar

| Servico | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| API | http://localhost:3001/api |
| Health Check | http://localhost:3001/api/health |
| Prisma Studio | `cd apps/api && npx prisma studio` |

### Usuario admin padrao (seed)

| Campo | Valor |
|-------|-------|
| Email | `admin@seg360.com.br` |
| Senha | `Admin123!` |
| Role | ADMIN |

---

## Scripts Disponiveis

### Root (monorepo)

| Script | Descricao |
|--------|-----------|
| `npm install` | Instala dependencias de todos os workspaces |

### Backend (`apps/api/`)

| Script | Descricao |
|--------|-----------|
| `npm run dev` | Inicia API com hot-reload (watch mode) |
| `npm run build` | Build de producao |
| `npm run start:prod` | Inicia build de producao |
| `npm test` | Roda todos os testes unitarios |
| `npm run test:watch` | Testes em watch mode |
| `npm run test:cov` | Testes com cobertura |
| `npm run prisma:migrate` | Criar/rodar migrations |
| `npm run prisma:generate` | Gerar Prisma Client |
| `npm run prisma:studio` | Abrir Prisma Studio (GUI do banco) |
| `npm run prisma:seed` | Popular banco com dados iniciais |

### Frontend (`apps/web/`)

| Script | Descricao |
|--------|-----------|
| `npm run dev` | Inicia Next.js com hot-reload (porta 3000) |
| `npm run build` | Build de producao |
| `npm run start` | Inicia build de producao |
| `npm run lint` | Lint com ESLint |

---

## Testes

O projeto possui **39 testes unitarios** distribuidos em **9 suites**:

| Suite | Testes | Cobertura |
|-------|--------|-----------|
| HealthController | 1 | Health check endpoint |
| AuthService | 5 | Register, login, refresh, duplicata, senha invalida |
| RolesGuard | 6 | Permissoes CONSUMER, BROKER, ADMIN, @Public() |
| RiskService | 4 | CEP valido, fallback cidade, CEP invalido, ViaCEP |
| QuotationService | 2 | Geracao de cotacoes, mock adapter |
| PaymentService | 4 | Pix, cartao, cotacao expirada, confirmacao |
| PolicyService | 4 | Emissao, cancelamento, ownership, status |
| BrokerService | 5 | Onboarding, SUSEP, duplicata, referral, dashboard |
| EmailService | 4 | Templates, retry, logging, falha |

### Rodar os testes

```bash
# Todos os testes do backend
cd apps/api && npm test

# Com watch mode
cd apps/api && npm run test:watch

# Com cobertura
cd apps/api && npm run test:cov

# Teste especifico
cd apps/api && npx jest --testPathPattern=auth
```

---

## Deploy

### Arquitetura recomendada de producao

```
Vercel (free tier)     ê¢â â apps/web (Next.js ê¢â¬â SSR/SSG)
Railway (free tier)    ê¢â â apps/api (NestJS ê¢â¬â container)
Neon (free tier)       ê¢â â PostgreSQL 16
Upstash (free tier)    ê¢â â Redis 7
```

### Alternativa AWS (producao em escala)

```
Vercel                 ê¢â â Frontend (CDN + Edge)
AWS ECS Fargate        ê¢â â Backend (container)
AWS RDS                ê¢â â PostgreSQL 16
AWS ElastiCache        ê¢â â Redis 7
AWS SES                ê¢â â Emails transacionais
AWS S3                 ê¢â â PDFs de apolice
```

### Variaveis de ambiente para deploy

O frontend precisa apenas de:
- `NEXT_PUBLIC_API_URL` ê¢â¬â URL da API em producao

O backend precisa de:
- `DATABASE_URL` ê¢â¬â Connection string do PostgreSQL
- `REDIS_URL` ê¢â¬â Connection string do Redis
- `JWT_SECRET` / `JWT_REFRESH_SECRET` ê¢â¬â Segredos para tokens (min 32 chars)

---

## Variaveis de Ambiente

Copie `.env.example` para `.env` e ajuste conforme necessario:

```bash
# Database
DATABASE_URL=postgresql://seg360:seg360@localhost:5432/seg360

# Redis
REDIS_URL=redis://localhost:6379

# JWT (trocar em producao!)
JWT_SECRET=dev-jwt-secret-min-32-characters-long-here
JWT_REFRESH_SECRET=dev-refresh-secret-min-32-characters-long

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ViaCEP
VIACEP_BASE_URL=https://viacep.com.br/ws

# AWS SES (opcional em dev ê¢â¬â emails sao logados no console)
# AWS_SES_REGION=sa-east-1
# AWS_ACCESS_KEY_ID=your-key
# AWS_SECRET_ACCESS_KEY=your-secret

# Payment Gateway (opcional em dev ê¢â¬â mock ativo)
# ASAAS_API_KEY=your-asaas-api-key
# ASAAS_WEBHOOK_SECRET=your-webhook-secret
```

---

## Roadmap

### MVP Atual (Completo)

- [x] Autenticacao JWT com refresh tokens
- [x] Perfis com RBAC (Consumer, Broker, Admin)
- [x] Landing page com SEO
- [x] Simulador de risco por CEP
- [x] Paginas SEO regionais (SSG)
- [x] Motor de cotacao (mock adapter)
- [x] Comparador de coberturas
- [x] Wizard de cotacao (3 passos)
- [x] Checkout com Pix e cartao (mock)
- [x] Emissao de apolice (SEG360-YYYYMMDD-XXXXX)
- [x] Gestao de assinatura e cancelamento
- [x] Onboarding de corretor (SUSEP)
- [x] Dashboard do corretor com leads e comissoes
- [x] Links de referencia com rastreamento
- [x] Dashboard do consumidor
- [x] Painel administrativo
- [x] Sistema de email (6 templates)
- [x] 39 testes unitarios

### Proximos Passos

- [ ] **Integracao real de pagamento** ê¢â¬â Substituir mock por Asaas/Stripe/Mercado Pago
- [ ] **Integracao real de insurtechs** ê¢â¬â Substituir MockAdapter por APIs reais (Simple2u, 88i)
- [ ] **Envio real de emails** ê¢â¬â Integrar AWS SES ou SendGrid
- [ ] **Testes E2E** ê¢â¬â Cypress ou Playwright para fluxos criticos
- [ ] **Deploy** ê¢â¬â Vercel (frontend) + Railway (backend) + Neon (PostgreSQL)
- [ ] **Cache Redis** ê¢â¬â Implementar cache de cotacoes e dados de risco
- [ ] **ESLint + Prettier** ê¢â¬â Configurar regras compartilhadas no monorepo
- [ ] **Monitoramento** ê¢â¬â Sentry para error tracking

### Visao de Longo Prazo (Fase 2+)

- Motor de alertas climaticos integrado (Cemaden/INMET)
- App mobile nativo (iOS + Android)
- Acionamento de sinistro digital
- White-label para assessorias de seguros
- Gamificacao para corretores
- Sandbox SUSEP para produtos proprios
- Embedded Insurance (bancos, imobiliarias, construtoras)
- Expansao para America Latina

---

## Contribuicao

Este e um projeto proprietario. Para contribuir:

1. Faca um fork do repositorio
2. Crie uma branch para sua feature (`git checkout -b feature/minha-feature`)
3. Commit suas mudancas (`git commit -m 'feat: adiciona minha feature'`)
4. Push para a branch (`git push origin feature/minha-feature`)
5. Abra um Pull Request

### Convencoes

- **Codigo**: Ingles
- **Documentos de negocio**: Portugues (pt-BR)
- **URLs de paginas**: Portugues (`/painel`, `/corretor`, `/cotacao`)
- **Commits**: Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`)
- **Testes**: Arquivos `.spec.ts` (backend) e `.test.tsx` (frontend)

---

<p align="center">
  <strong>Seg360</strong> ê¢â¬â Protecao contra calamidades ao alcance de todos.
  <br/>
  Feito com TypeScript, cafe e a convicao de que todo brasileiro merece estar protegido.
</p>

---

Projeto  - ARCKHÉe