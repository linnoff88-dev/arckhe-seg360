# Pesquisa de Mercado: Plataforma de Venda de Seguros contra Sinistros/Calamidades

**Data:** 2026-02-13
**Projeto:** Seg360 - Plataforma de Seguros contra Calamidades

---

## 1. O PROBLEMA (e por que a ideia tem fundamento)

Os numeros sao alarmantes e validam a tese:

- **R$ 732 bilhoes** em prejuizos por desastres no Brasil entre 2013 e 2024 ([CNM](https://cnm.org.br/comunicacao/noticias/brasil-registra-mais-de-r-732-bilhoes-em-prejuizos-por-conta-de-desastres-entre-2013-e-2024))
- **US$ 12 bilhoes** de prejuizo so em 2024, com destaque para o RS (US$ 5 bi) e secas (US$ 6 bi) ([Brasil 61](https://brasil61.com/n/desastres-naturais-causam-r-32-bi-em-prejuizos-em-2024-bras2411736))
- **3.620 alertas** do Cemaden em 2024 — recorde historico ([Agencia Gov](https://agenciagov.ebc.com.br/noticias/202501/cemaden-registra-recorde-de-alertas-e-mais-de-1-6-mil-ocorrencias-de-desastre-no-brasil-em-2024))
- Em 2025, ja sao **R$ 28,5 bilhoes** em prejuizos ate abril, afetando 5,9 milhoes de pessoas ([CNM](https://cnm.org.br/comunicacao/noticias/desastres-em-2025-ja-afetam-milhoes-e-expoem-urgencia-de-apoio-aos-municipios-alerta-cnm))

**O gap de cobertura e enorme:**
- Apenas **20%** das residencias brasileiras tem seguro residencial ([Fenacor](https://www.fenacor.org.br/noticias/cobertura-de-alagamento-tem-valores-reduzidos))
- Dessas, **menos de 1%** tem cobertura para alagamento/enchente
- Ou seja: **menos de 0,14%** dos lares brasileiros estao protegidos contra enchentes ([InfoMoney](https://www.infomoney.com.br/minhas-financas/seguro-residencial-tem-que-cobrir-alagamentos-e-inundacoes-veja-mitos-e-verdades/))
- A cobertura de enchente **nao vem no plano basico** — precisa ser contratada a parte, e a maioria das pessoas nem sabe disso

---

## 2. TAMANHO DO MERCADO

| Indicador | Dado |
|---|---|
| Residencias no Brasil | ~90 milhoes |
| Com seguro residencial | ~18 milhoes (20%) |
| Com cobertura de enchente | ~126 mil (0,14%) |
| Mercado potencial nao coberto | **~89,8 milhoes de lares** |
| Crescimento do setor segurador | 8-10% ao ano ([CNseg](https://cnseg.org.br/noticias/setor-segurador-crescera-acima-de-10-em-2025)) |
| Perdas globais com catastrofes (seguradas) | US$ 137-145 bi/ano ([CNseg](https://noticiasdoseguro.org.br/noticias/perdas-seguradas-com-catastrofes-naturais-atingem-us-137-bilhoes-em-2024-projecao-e-ainda-maior-para-2025)) |

O governo brasileiro iniciou um debate (considerado **tardio**) sobre seguro de catastrofe com a Portaria Susep 8.432/2025 ([SEGS](https://www.segs.com.br/seguros/437326-seguro-de-catastrofe-brasil-inicia-debate-considerado-tardio)), o que indica que regulamentacao favoravel esta a caminho.

---

## 3. CONCORRENTES E PLAYERS EXISTENTES

| Player | Modelo | Diferencial |
|---|---|---|
| **ProtectMe** | Plataforma para corretores virarem e-commerce | Cotacao self-service ([site](https://protectme.com.br/corretores.portal)) |
| **SUTHUB (ZeroCode)** | White-label para seguradoras/corretores | Canal de vendas em <10 min ([CQCS](https://cqcs.com.br/noticia/suthub-inova-no-cqcs-insurtech-inovacao-2024-com-solucao-que-agiliza-a-venda-de-seguros/)) |
| **Thinkseg** | Marketplace hub de seguros | Pay-per-use, integrador |
| **MAG Venda Digital** | Plataforma propria da seguradora | 90% das vendas sao digitais |
| **Segfy, Lojacorr** | SaaS para gestao de corretoras | Multicalculo, CRM |

**Nenhum deles tem foco especifico em seguros contra calamidades/desastres naturais.** Este e o diferencial competitivo.

---

## 4. CENARIO REGULATORIO — FAVORAVEL

- **Autorregulacao de corretores**: A SUSEP eliminou a necessidade de habilitacao direta, facilitando a entrada de novos corretores ([SUSEP FAQ](http://www.susep.gov.br/menu/autorregulacao-do-mercado-de-corretores-perguntas-e-respostas))
- **Sandbox Regulatorio**: A SUSEP permite que insurtechs testem modelos inovadores em ambiente controlado ([Insurtech.com](https://www.insurtech.com.br/guia/o-que-e-sandbox-regulatorio-da-susep/))
- **Open Insurance**: APIs padronizadas permitirao compartilhar dados entre seguradoras, bancos e insurtechs — isso viabiliza a plataforma multi-seguradoras ([SUSEP Open Insurance](https://www.gov.br/susep/pt-br/assuntos/open-insurance))
- **COP30 no Brasil**: O mercado de seguros ganha protagonismo na agenda climatica ([SEGS](https://www.segs.com.br/seguros/436973-com-a-cop30-mercado-de-seguros-ganha-protagonismo-na-agenda-climatica-e-acelera-inovacao-no-brasil))

---

## 5. MODELO DE NEGOCIO SUGERIDO

### Estrutura: Marketplace vertical de seguros contra calamidades

```
+---------------------------------------------------+
|              PLATAFORMA SEG360                     |
|                                                    |
|  +------------+  +------------+  +------------+   |
|  | Seguradoras|  | Corretores |  |  Clientes  |   |
|  |  parceiras |  |  afiliados |  |   finais   |   |
|  +-----+------+  +-----+------+  +-----+------+   |
|        |               |               |           |
|        +---------------+---------------+           |
|                        v                           |
|         Motor de Cotacao + Educacao                |
|         + Simulacao de Risco por CEP               |
|         + Comparador de coberturas                 |
+---------------------------------------------------+
```

### Fontes de Receita

| Fonte | Descricao |
|---|---|
| **Comissao por venda** | % sobre cada apolice vendida (padrao mercado: 15-30%) |
| **SaaS para corretores** | Mensalidade para corretores usarem a plataforma |
| **Lead qualificado** | Venda de leads para corretores ([modelo Mercado Lead](https://www.textecnologia.com.br/blog/marketplace-de-seguros)) |
| **White-label** | Licenciamento da plataforma para corretoras |

---

## 6. DIFERENCIAIS COMPETITIVOS SUGERIDOS

1. **Educacao sobre risco**: Simulador visual que mostra o risco de calamidade **por CEP** (usando dados publicos do Cemaden/IBGE)
2. **Comparador de coberturas**: Mostrar claramente o que cada apolice cobre e **o que NAO cobre** (resolver o problema identificado)
3. **Foco vertical**: Especializar em seguros contra calamidade (enchente, deslizamento, vendaval, granizo) — ninguem faz isso hoje
4. **Onboarding de corretores**: Facilitar que corretores tradicionais vendam digitalmente atraves da plataforma
5. **Alertas integrados**: Conectar com dados do Cemaden para notificar clientes em areas de risco (gera urgencia e conversao)

---

## 7. VIABILIDADE — AVALIACAO

| Criterio | Avaliacao | Justificativa |
|---|---|---|
| **Demanda** | Alta | 89M de lares sem cobertura + desastres crescentes |
| **Regulacao** | Favoravel | Open Insurance + Sandbox + desregulacao de corretores |
| **Concorrencia direta** | Baixa | Nenhum player focado neste nicho |
| **Timing** | Excelente | Pos-tragedia RS, COP30, debate de seguro catastrofe |
| **Barreira tecnica** | Media | Integracoes com seguradoras + APIs Open Insurance |
| **Investimento inicial** | Medio | MVP pode comecar com 2-3 seguradoras parceiras |
| **Escalabilidade** | Alta | Marketplace escala com mais corretores e seguradoras |

---

## 8. RISCOS PRINCIPAIS

1. **Seguradoras podem restringir cobertura** em areas de alto risco (ja aconteceu no RS pos-enchente — [Fenacor](https://www.fenacor.org.br/noticias/seguradoras-estao-assustadas-com-a-calamidade))
2. **Dependencia regulatoria** — mudancas na SUSEP podem afetar o modelo
3. **Educacao do consumidor** — convencer pessoas a pagar por algo "que talvez nunca aconteca" e o maior desafio de vendas
4. **Integracao com seguradoras** — cada uma tem sistemas diferentes; o Open Insurance vai ajudar, mas ainda esta em implementacao
