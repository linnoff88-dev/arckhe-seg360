import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Seg360 — Protecao contra Calamidades Naturais',
  description:
    'Simule o risco de desastres na sua regiao, compare seguros contra enchentes, deslizamentos e vendavais, e contrate online em minutos.',
  openGraph: {
    title: 'Seg360 — Protecao contra Calamidades Naturais',
    description:
      'Simule o risco de desastres na sua regiao e contrate seguro online.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Seg360',
  },
};

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 px-4 py-16 text-white md:py-24">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="mb-4 text-3xl font-bold leading-tight md:text-5xl">
            Proteja seu patrimonio contra calamidades naturais
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-100 md:text-xl">
            Descubra o nivel de risco da sua regiao, compare planos de seguro e
            contrate online em minutos. Simples, transparente e 100% digital.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/simulador"
              className="rounded-lg bg-secondary-500 px-8 py-3 text-lg font-semibold text-white shadow-lg transition hover:bg-secondary-600"
            >
              Simular Risco Gratis
            </Link>
            <Link
              href="#como-funciona"
              className="rounded-lg border-2 border-white/30 px-8 py-3 text-lg font-semibold text-white transition hover:bg-white/10"
            >
              Como Funciona
            </Link>
          </div>
        </div>
      </section>

      {/* Stats / Social Proof */}
      <section className="border-b border-gray-100 bg-gray-50 px-4 py-12">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary-600">R$ 14.4 bi</p>
            <p className="mt-1 text-sm text-gray-600">
              em prejuizos por desastres naturais no Brasil (2023)
            </p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary-600">85%</p>
            <p className="mt-1 text-sm text-gray-600">
              dos imoveis em areas de risco nao tem seguro
            </p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary-600">4.3 milhoes</p>
            <p className="mt-1 text-sm text-gray-600">
              de familias afetadas por desastres por ano
            </p>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" className="px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-2xl font-bold text-gray-900 md:text-3xl">
            Como Funciona
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {[
              {
                step: '1',
                title: 'Simule o Risco',
                desc: 'Digite seu CEP e descubra o nivel de risco da sua regiao — enchentes, deslizamentos, vendavais.',
              },
              {
                step: '2',
                title: 'Compare Planos',
                desc: 'Veja cotacoes de diferentes seguradoras, compare coberturas lado a lado e entenda o que cada plano oferece.',
              },
              {
                step: '3',
                title: 'Contrate Online',
                desc: 'Escolha o plano ideal e contrate 100% digital com pagamento via Pix ou cartao de credito.',
              },
              {
                step: '4',
                title: 'Fique Protegido',
                desc: 'Receba sua apolice imediatamente e acompanhe tudo pelo painel. Simples assim.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-lg font-bold text-white">
                  {item.step}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA intermediario */}
      <section className="bg-secondary-50 px-4 py-12">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Descubra o risco na sua regiao
          </h2>
          <p className="mb-6 text-gray-600">
            A simulacao e gratuita e leva menos de 30 segundos. Sem
            compromisso.
          </p>
          <Link
            href="/simulador"
            className="inline-block rounded-lg bg-secondary-500 px-8 py-3 text-lg font-semibold text-white shadow transition hover:bg-secondary-600"
          >
            Simular Risco Agora
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900 md:text-3xl">
            Perguntas Frequentes
          </h2>
          <div className="space-y-4">
            {[
              {
                q: 'O que e seguro contra calamidades?',
                a: 'E um seguro que protege seu imovel contra danos causados por desastres naturais como enchentes, deslizamentos de terra, vendavais e granizo. Cobre reparos, moradia temporaria e outros prejuizos.',
              },
              {
                q: 'Quanto custa um seguro contra calamidades?',
                a: 'O valor depende da regiao, tipo de imovel e cobertura desejada. No Seg360, voce pode simular o risco do seu CEP e receber cotacoes personalizadas a partir de R$ 30/mes.',
              },
              {
                q: 'Como funciona a simulacao de risco?',
                a: 'Ao digitar seu CEP, analisamos dados publicos de ocorrencias de desastres naturais na sua regiao (enchentes, deslizamentos, vendavais) para calcular um nivel de risco: Baixo, Medio, Alto ou Muito Alto.',
              },
              {
                q: 'Posso contratar 100% online?',
                a: 'Sim! Todo o processo e digital — da simulacao de risco ate a emissao da apolice. Pagamento via Pix ou cartao de credito, sem papelada.',
              },
              {
                q: 'Sou corretor. Como posso participar?',
                a: 'Corretores registrados na SUSEP podem se cadastrar na plataforma, receber leads qualificados da sua regiao e ganhar comissoes de 30-40% sobre cada venda.',
              },
            ].map((item, i) => (
              <details
                key={i}
                className="rounded-lg border border-gray-200 p-4"
              >
                <summary className="cursor-pointer font-medium text-gray-900">
                  {item.q}
                </summary>
                <p className="mt-2 text-sm text-gray-600">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
