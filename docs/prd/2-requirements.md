# 2. Requirements

### Functional

- **FR1**: O sistema deve permitir que consumidores consultem o nivel de risco de calamidade por CEP, exibindo historico de desastres, tipo de risco predominante e nivel de severidade
- **FR2**: O sistema deve integrar com APIs de insurtechs parceiras (ex: Simple2u, 88i) para gerar cotacoes instantaneas de seguros contra calamidades
- **FR3**: O sistema deve exibir um comparador de coberturas mostrando claramente o que cada plano cobre e o que NAO cobre, com linguagem acessivel
- **FR4**: O sistema deve permitir contratacao 100% digital — preenchimento de dados, escolha de plano, pagamento (Pix e cartao) e emissao de apolice
- **FR5**: O sistema deve prover cadastro e autenticacao para dois perfis: consumidor final e corretor de seguros
- **FR6**: O sistema deve oferecer um painel do corretor com visao de leads, cotacoes realizadas, vendas concluidas e comissoes
- **FR7**: O sistema deve gerar landing pages educativas por regiao/tipo de risco, otimizadas para SEO, com dados reais de desastres
- **FR8**: O sistema deve permitir que corretores compartilhem links personalizados do simulador de risco com rastreamento de conversao
- **FR9**: O sistema deve calcular e exibir a comparacao "prejuizo medio por desastre vs custo mensal do seguro" para ancoragem de valor
- **FR10**: O sistema deve permitir que o consumidor visualize e gerencie sua(s) apolice(s) ativa(s) no painel do cliente
- **FR11**: O sistema deve enviar notificacoes por email para eventos criticos: confirmacao de contratacao, lembrete de renovacao, vencimento de apolice
- **FR12**: O sistema deve prover um painel administrativo para gestao de seguradoras parceiras, corretores, apolices e metricas da plataforma
- **FR13**: O sistema deve implementar fluxo de onboarding do corretor com verificacao de registro SUSEP
- **FR14**: O sistema deve permitir micro-seguros com planos a partir de R$9,90/mes em modelo de assinatura mensal sem fidelidade

### Non Functional

- **NFR1**: Tempo de resposta do simulador de risco por CEP deve ser < 2 segundos
- **NFR2**: Tempo de geracao de cotacao deve ser < 5 segundos
- **NFR3**: Largest Contentful Paint (LCP) das paginas deve ser < 2.5 segundos
- **NFR4**: A plataforma deve estar em conformidade com a LGPD para tratamento de dados pessoais e financeiros
- **NFR5**: Dados sensiveis (CPF, dados de pagamento) devem ser criptografados em transito (TLS 1.2+) e em repouso (AES-256)
- **NFR6**: O sistema deve suportar pelo menos 1.000 usuarios simultaneos no MVP
- **NFR7**: Disponibilidade minima de 99.5% (uptime)
- **NFR8**: O sistema deve ser web responsivo (mobile-first), funcionando corretamente em Chrome, Safari, Firefox e Edge (ultimas 2 versoes)
- **NFR9**: Todas as APIs devem retornar erros padronizados com codigos HTTP apropriados e mensagens em portugues
- **NFR10**: O sistema deve ter logging estruturado para auditoria de acoes criticas (contratacao, pagamento, acesso admin)
- **NFR11**: O sistema deve implementar rate limiting nas APIs publicas para prevenir abuso
- **NFR12**: Testes automatizados devem cobrir ao menos 80% das funcionalidades criticas (cotacao, pagamento, emissao de apolice)

---
