# 3. User Interface Design Goals

### Overall UX Vision

Interface limpa, confiavel e educativa. O design deve transmitir seguranca e profissionalismo, ao mesmo tempo que e acessivel para pessoas sem familiaridade com seguros. A jornada principal do consumidor deve ser: entender o risco → comparar opcoes → contratar em minutos. Linguagem simples, sem jargao tecnico de seguros.

### Key Interaction Paradigms

- **Simulador de Risco**: Experiencia interativa tipo "quiz" — digita CEP, ve resultado visual com mapa e indicadores
- **Comparador de Coberturas**: Cards lado a lado com checkmarks verdes (cobre) e X vermelhos (nao cobre)
- **Cotacao/Contratacao**: Wizard passo a passo (dados → plano → pagamento → confirmacao)
- **Painel do Corretor**: Dashboard com metricas, lista de leads e acoes rapidas
- **Conteudo Educativo**: Artigos/paginas com dados visuais, infograficos e CTAs contextuais

### Core Screens and Views

1. **Home/Landing Page**: Hero com simulador de risco, proposicao de valor, prova social
2. **Resultado do Simulador de Risco**: Mapa de risco, historico de desastres, CTA para cotacao
3. **Comparador de Coberturas**: Tabela comparativa de planos com filtros
4. **Wizard de Cotacao**: Formulario step-by-step com preview do plano
5. **Checkout/Pagamento**: Resumo + pagamento (Pix/cartao) + assinatura digital
6. **Painel do Consumidor**: Apolices ativas, status, documentos
7. **Painel do Corretor**: Dashboard com leads, vendas, comissoes, links personalizados
8. **Painel Administrativo**: Gestao de seguradoras, corretores, metricas
9. **Paginas Educativas/SEO**: Conteudo por regiao e tipo de risco
10. **Auth**: Login, cadastro, recuperacao de senha (consumidor e corretor)

### Accessibility: WCAG AA

O publico-alvo inclui pessoas de diversas faixas etarias e niveis de letramento digital. WCAG AA garante acessibilidade adequada — contraste suficiente, navegacao por teclado, textos alternativos, formularios acessiveis.

### Branding

- Cores: Tons de azul (confianca/seguranca) com acentos em verde (protecao/natureza)
- Tipografia: Sans-serif moderna e legivel (ex: Inter, Nunito)
- Tom de voz: Acolhedor, direto, educativo — nunca alarmista ou burocrático
- Logo e identidade visual: A definir (nao bloqueia o MVP)

### Target Device and Platforms: Web Responsive (Mobile-First)

Prioridade mobile-first considerando que grande parte do publico acessa via smartphone. Web responsivo no MVP. Apps nativos planejados para Fase 2.

---
