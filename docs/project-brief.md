# Project Brief: Seg360

## Executive Summary

Seg360 e um marketplace vertical de seguros contra calamidades naturais (enchente, deslizamento, vendaval, granizo) para o mercado brasileiro. A plataforma conecta seguradoras, corretores e consumidores finais, com foco em educacao sobre risco, cotacao instantanea e contratacao 100% digital. Resolve o gap critico de cobertura: menos de 0,14% dos lares brasileiros estao protegidos contra enchentes, enquanto prejuizos por desastres superam R$28 bilhoes/ano.

## Problem Statement

### Estado Atual

O Brasil enfrenta uma crise crescente de desastres naturais com protecao de seguro quase inexistente:

- **R$ 732 bilhoes** em prejuizos por desastres entre 2013-2024
- **R$ 28,5 bilhoes** em prejuizos so em 2025 (ate abril), afetando 5,9 milhoes de pessoas
- **3.620 alertas** do Cemaden em 2024 — recorde historico
- Apenas **20%** das residencias tem seguro residencial, e dessas, menos de 1% cobre enchente
- Resultado: **menos de 0,14%** dos lares brasileiros protegidos contra enchentes (~126 mil de ~90 milhoes)

### Por que Solucoes Atuais Falham

1. **Cobertura de enchente nao vem no plano basico** — precisa ser contratada a parte e a maioria desconhece
2. **Vieses cognitivos** impedem a compra: otimismo ("nao vai acontecer comigo"), aversao a perda, inercia
3. **Processo burocratico**: contratacao complexa, linguagem tecnica, dependencia de corretor presencial
4. **Percepcao errada de preco**: consumidores acham que custa igual ao seguro de carro, quando custa R$15-50/mes
5. **Nenhum player focado** especificamente em seguros contra calamidades/desastres naturais

### Urgencia

Desastres climaticos estao em tendencia crescente. O governo brasileiro iniciou debate sobre seguro catastrofe (Portaria Susep 8.432/2025). COP30 no Brasil coloca o tema em evidencia. O timing e excelente.

## Proposed Solution

Marketplace vertical especializado em seguros contra calamidades, que se diferencia por:

1. **Simulador de Risco por CEP**: ferramenta viral que usa dados publicos (Cemaden, IBGE, Defesa Civil) para mostrar risco real de desastre na regiao do usuario
2. **Comparador de Coberturas**: mostra claramente o que cada apolice cobre e o que NAO cobre
3. **Cotacao em 60 segundos**: processo 100% digital, sem burocracia
4. **Motor de Alertas Integrado**: conecta com Cemaden/INMET para notificar clientes em areas de risco, gerando urgencia e conversao natural
5. **Modelo B2B+B2C**: atrai corretores com leads quentes e nicho lucrativo (comissao 30-40%), enquanto educa e converte consumidores finais
6. **Micro-seguros acessiveis**: planos a partir de R$9,90/mes via Pix, modelo assinatura sem fidelidade

## Target Users

### Primary User Segment: Proprietarios de Imoveis em Areas de Risco

- **Perfil**: Proprietarios ou inquilinos de imoveis residenciais em regioes com historico de enchente, deslizamento ou vendavais (RS, litoral SP/RJ, BA, MG, SC)
- **Comportamento atual**: Nao possuem seguro contra calamidades (99,86% dos lares). Muitos nem sabem que a cobertura de enchente e separada
- **Dores**: Medo de perder patrimonio, desconhecimento de opcoes acessiveis, burocracia de contratacao
- **Objetivo**: Proteger patrimonio e familia contra desastres de forma simples e acessivel

### Secondary User Segment: Corretores de Seguros

- **Perfil**: Corretores registrados na SUSEP, especialmente os menores/independentes que buscam diversificar carteira
- **Comportamento atual**: 70% da receita vem de auto (comissao baixa 10-25%). Prospeccao dificil, operacao manual, sem ferramentas digitais acessiveis
- **Dores**: Falta de leads, dependencia de indicacao, ferramentas caras, carteira concentrada em auto
- **Objetivo**: Acessar nicho lucrativo (comissao 30-40%), leads quentes, ferramentas digitais e autoridade no mercado de calamidades

### Tertiary User Segment: Seguradoras e Assessorias

- **Perfil**: Seguradoras que oferecem produtos de seguro residencial/calamidade, assessorias como Lojacorr e Rede Agger
- **Objetivo**: Novos canais de distribuicao digital para produtos de calamidade, acesso a base de clientes educada sobre risco

## Goals & Success Metrics

### Business Objectives

- Atingir 1.000 apolices vendidas nos primeiros 6 meses do MVP
- Onboardar 50 corretores fundadores no programa "Founding Brokers"
- Integrar com pelo menos 2 seguradoras/insurtechs parceiras no lancamento
- Atingir 50.000 simulacoes de risco por CEP no primeiro ano (mecanismo de aquisicao viral)

### User Success Metrics

- Tempo medio de cotacao < 60 segundos
- Taxa de conversao simulador → cotacao > 15%
- Taxa de conversao cotacao → contratacao > 8%
- NPS de corretores > 60

### Key Performance Indicators (KPIs)

- **GMV (Gross Merchandise Value)**: Volume total de premios vendidos pela plataforma
- **Take Rate**: % de comissao retida pela plataforma sobre cada venda
- **CAC (Customer Acquisition Cost)**: Custo por cliente adquirido (B2C e B2B separados)
- **LTV (Lifetime Value)**: Valor medio do cliente ao longo do tempo (renovacoes)
- **Churn Rate**: Taxa de cancelamento mensal de apolices
- **Corretores Ativos**: Numero de corretores com pelo menos 1 venda/mes

## MVP Scope

### Core Features (Must Have)

- **Simulador de Risco por CEP**: Consulta dados publicos e mostra nivel de risco + historico de desastres na regiao. Feature de entrada e viralidade
- **Motor de Cotacao**: Integracao com 2-3 seguradoras/insurtechs via API para cotacao instantanea de seguros contra calamidades
- **Comparador de Coberturas**: Exibicao clara do que cada plano cobre vs nao cobre, com linguagem simples
- **Contratacao Digital**: Fluxo completo de contratacao online — dados, pagamento (Pix/cartao), assinatura digital, emissao de apolice
- **Painel do Corretor**: Dashboard basico para corretores gerenciarem leads, cotacoes e vendas
- **Landing Pages Educativas**: Conteudo sobre risco de calamidades por regiao, usando dados reais para educar e converter
- **Auth e Perfil**: Cadastro/login para consumidores e corretores

### Out of Scope for MVP

- App mobile nativo (usar web responsivo no MVP)
- Motor de alertas climaticos integrado (Fase 2)
- White-label para assessorias (Fase 2)
- Acionamento de sinistro digital (Fase 2)
- Gamificacao e ranking de corretores (Fase 2)
- Integracao Open Insurance completa (depende de maturidade da API)
- Modelo de seguradora propria via Sandbox SUSEP (Fase 3)

### MVP Success Criteria

O MVP sera considerado bem-sucedido se, em 6 meses apos lancamento: (1) pelo menos 1.000 apolices vendidas, (2) 50 corretores ativos na plataforma, (3) simulador de risco com 50.000 consultas, (4) unit economics positivos (LTV > 3x CAC).

## Post-MVP Vision

### Phase 2 Features (meses 6-18)

- Motor de alertas climaticos integrado (Cemaden/INMET) com push/WhatsApp/SMS
- App mobile nativo (iOS + Android)
- Acionamento de sinistro digital com upload de fotos
- Registro como corretora na SUSEP para operacao propria
- White-label para assessorias de seguros
- Gamificacao para corretores (ranking, certificacao "Especialista Seg360")
- Programa "Corretor indica Corretor" com bonus

### Long-term Vision (ano 2+)

- Entrada no Sandbox SUSEP para criar produtos proprios de seguro catastrofe
- Embedded Insurance: distribuir seguro dentro de apps de bancos, imobiliarias, construtoras
- Expansao para outros tipos de seguro residencial (incendio, roubo, responsabilidade civil)
- Inteligencia artificial para precificacao baseada em dados climaticos em tempo real
- Expansao para outros paises da America Latina com riscos climaticos similares

### Expansion Opportunities

- Parcerias com prefeituras e Defesa Civil para distribuicao de micro-seguros em areas de risco
- Integracao com programas governamentais de habitacao (Minha Casa Minha Vida)
- Dados anonimizados de risco como produto B2B para seguradoras e resseguradoras
- Consultoria de risco climatico para empresas e governo

## Technical Considerations

### Platform Requirements

- **Target Platforms:** Web responsivo (mobile-first) no MVP; apps nativos na Fase 2
- **Browser Support:** Chrome, Safari, Firefox, Edge (ultimas 2 versoes)
- **Performance:** Simulador de risco com resposta < 2s; cotacao < 5s; paginas com LCP < 2.5s

### Technology Preferences

- **Frontend:** React/Next.js (SSR para SEO das landing pages educativas)
- **Backend:** Node.js/NestJS ou Python/FastAPI
- **Database:** PostgreSQL (dados relacionais) + Redis (cache de cotacoes/risco)
- **Hosting/Infrastructure:** Cloud (AWS ou GCP), containerizado

### Architecture Considerations

- **Repository Structure:** Monorepo com apps separados (web, api, shared)
- **Service Architecture:** API REST para MVP, considerar microservicos na Fase 2
- **Integration Requirements:** APIs de seguradoras/insurtechs (Simple2u, 88i), APIs publicas (Cemaden, IBGE, ViaCEP), gateway de pagamento (Pix)
- **Security/Compliance:** LGPD (dados pessoais e financeiros), criptografia de dados sensiveis, auditoria de acessos, conformidade SUSEP

## Constraints & Assumptions

### Constraints

- **Budget:** MVP com investimento estimado de R$50-100k (modelo Embedded Insurance via API)
- **Timeline:** MVP em 4-6 meses
- **Resources:** Equipe enxuta (1-2 devs full-stack, 1 designer, 1 business/ops)
- **Technical:** Dependencia de APIs de seguradoras parceiras; dados publicos do Cemaden podem ter limitacoes de granularidade

### Key Assumptions

- Seguradoras/insurtechs como Simple2u ou 88i estarao dispostas a integrar via API
- Dados publicos do Cemaden/IBGE sao suficientes para calcular risco por CEP com credibilidade
- Corretores adotarao a plataforma se receberem leads quentes e ferramentas gratuitas
- O modelo de micro-seguro (a partir de R$9,90/mes) e viavel atuarialmente para as seguradoras parceiras
- Consumidores em areas recentemente afetadas por desastres terao maior propensao a compra

## Risks & Open Questions

### Key Risks

- **Restricao de cobertura por seguradoras**: Seguradoras podem restringir cobertura em areas de alto risco (ja ocorreu no RS pos-enchente), limitando a oferta
- **Dependencia regulatoria**: Mudancas na SUSEP podem afetar o modelo de operacao
- **Educacao do consumidor**: Convencer pessoas a pagar por "algo que talvez nunca aconteca" e o maior desafio de vendas
- **Integracao tecnica**: Cada seguradora tem sistemas diferentes; Open Insurance ainda esta em implementacao
- **Concentracao de parceiros**: No MVP, depender de 2-3 insurtechs cria risco de fornecedor unico

### Open Questions

- Qual insurtech parceira priorizar para integracao inicial (Simple2u vs 88i vs outra)?
- Qual a granularidade real dos dados do Cemaden para o simulador de risco por CEP?
- Qual o preco minimo viavel de micro-seguro que seguradoras aceitariam oferecer?
- Como sera o modelo de split de comissao entre plataforma, corretor e seguradora?
- Necessidade de registro na SUSEP como correspondente de seguros para o MVP?

### Areas Needing Further Research

- Entrevistas com corretores para validar proposta de valor B2B
- Analise tecnica das APIs do Cemaden/INMET para viabilidade do simulador
- Mapeamento detalhado de insurtechs com API white-label disponivel
- Estudo atuarial sobre viabilidade de micro-seguros contra calamidades
- Benchmark de plataformas internacionais (Lemonade, Hippo, Kin Insurance)

## Appendices

### A. Research Summary

A pesquisa de mercado completa esta em `docs/pesquisa-mercado-seguros-calamidades.md` e inclui:

- Validacao do problema com dados quantitativos (R$732 bi em prejuizos, 0,14% de cobertura)
- Tamanho de mercado (~89,8 milhoes de lares sem cobertura)
- Analise competitiva (ProtectMe, SUTHUB, Thinkseg, MAG, Segfy — nenhum focado em calamidades)
- Cenario regulatorio favoravel (Open Insurance, Sandbox SUSEP, COP30)
- Estrategias de venda baseadas em economia comportamental
- Modelos juridicos para operacao (5 caminhos legais analisados)
- Estrategia de atracao de corretores (B2B) em 3 fases
- Caso de referencia: Lemonade Insurance

### C. References

- Pesquisa de mercado: `docs/pesquisa-mercado-seguros-calamidades.md`
- CNM (dados de prejuizos por desastres)
- Cemaden (alertas e dados climaticos)
- SUSEP (regulacao, Open Insurance, Sandbox)
- Fenacor (dados de cobertura de seguros)
- InfoMoney (mercado de seguros residenciais)
- CNseg (crescimento do setor segurador)
- Lemonade Insurance (caso de referencia global)

## Next Steps

### Immediate Actions

1. Validar este Project Brief com stakeholders
2. Criar PRD (Product Requirements Document) detalhado a partir deste brief
3. Definir especificacao de UI/UX (front-end spec)
4. Criar documento de arquitetura tecnica
5. Iniciar contato com insurtechs parceiras (Simple2u, 88i)

### PM Handoff

This Project Brief provides the full context for Seg360. Please start in 'PRD Generation Mode', review the brief thoroughly to work with the user to create the PRD section by section as the template indicates, asking for any necessary clarification or suggesting improvements.
