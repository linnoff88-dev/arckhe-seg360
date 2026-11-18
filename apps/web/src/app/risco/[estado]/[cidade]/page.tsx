import Link from 'next/link';
import type { Metadata } from 'next';

interface PageProps {
  params: { estado: string; cidade: string };
}

// Mock data — in production, fetch from API
const cityRiskData: Record<
  string,
  {
    city: string;
    state: string;
    riskLevel: string;
    riskTypes: string[];
    avgDamage: number;
    incidentCount12m: number;
  }
> = {
  'rs/porto-alegre': {
    city: 'Porto Alegre',
    state: 'RS',
    riskLevel: 'VERY_HIGH',
    riskTypes: ['flood', 'landslide'],
    avgDamage: 120000,
    incidentCount12m: 23,
  },
  'rj/petropolis': {
    city: 'Petropolis',
    state: 'RJ',
    riskLevel: 'VERY_HIGH',
    riskTypes: ['landslide', 'flood'],
    avgDamage: 150000,
    incidentCount12m: 18,
  },
  'sp/santos': {
    city: 'Santos',
    state: 'SP',
    riskLevel: 'HIGH',
    riskTypes: ['flood', 'windstorm'],
    avgDamage: 70000,
    incidentCount12m: 10,
  },
  'sp/sao-sebastiao': {
    city: 'Sao Sebastiao',
    state: 'SP',
    riskLevel: 'VERY_HIGH',
    riskTypes: ['landslide', 'flood'],
    avgDamage: 130000,
    incidentCount12m: 16,
  },
  'sc/blumenau': {
    city: 'Blumenau',
    state: 'SC',
    riskLevel: 'HIGH',
    riskTypes: ['flood'],
    avgDamage: 90000,
    incidentCount12m: 13,
  },
  'ba/salvador': {
    city: 'Salvador',
    state: 'BA',
    riskLevel: 'MEDIUM',
    riskTypes: ['flood', 'landslide'],
    avgDamage: 50000,
    incidentCount12m: 7,
  },
  'sp/sao-paulo': {
    city: 'Sao Paulo',
    state: 'SP',
    riskLevel: 'MEDIUM',
    riskTypes: ['flood'],
    avgDamage: 40000,
    incidentCount12m: 5,
  },
  'rj/rio-de-janeiro': {
    city: 'Rio de Janeiro',
    state: 'RJ',
    riskLevel: 'MEDIUM',
    riskTypes: ['flood', 'landslide'],
    avgDamage: 55000,
    incidentCount12m: 9,
  },
  'rs/sao-leopoldo': {
    city: 'Sao Leopoldo',
    state: 'RS',
    riskLevel: 'HIGH',
    riskTypes: ['flood'],
    avgDamage: 78000,
    incidentCount12m: 11,
  },
  'rs/caxias-do-sul': {
    city: 'Caxias do Sul',
    state: 'RS',
    riskLevel: 'MEDIUM',
    riskTypes: ['hail', 'windstorm'],
    avgDamage: 35000,
    incidentCount12m: 6,
  },
};

const riskLevelLabels: Record<string, string> = {
  LOW: 'Baixo',
  MEDIUM: 'Medio',
  HIGH: 'Alto',
  VERY_HIGH: 'Muito Alto',
};

const riskTypeLabels: Record<string, string> = {
  flood: 'enchentes',
  landslide: 'deslizamentos',
  windstorm: 'vendavais',
  hail: 'granizo',
};

const stateNames: Record<string, string> = {
  RS: 'Rio Grande do Sul',
  RJ: 'Rio de Janeiro',
  SP: 'Sao Paulo',
  SC: 'Santa Catarina',
  BA: 'Bahia',
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const key = `${params.estado}/${params.cidade}`;
  const data = cityRiskData[key];

  if (!data) {
    return { title: 'Risco por Regiao — Seg360' };
  }

  const riskLabel = riskLevelLabels[data.riskLevel];
  const types = data.riskTypes.map((t) => riskTypeLabels[t] || t).join(', ');

  return {
    title: `Risco de desastres em ${data.city}, ${data.state} — Seg360`,
    description: `${data.city} tem risco ${riskLabel} de desastres naturais (${types}). Foram ${data.incidentCount12m} ocorrencias nos ultimos 12 meses. Simule seu risco e proteja seu patrimonio.`,
    openGraph: {
      title: `Risco ${riskLabel} em ${data.city}, ${data.state}`,
      description: `${data.incidentCount12m} ocorrencias de ${types} no ultimo ano. Prejuizo medio: R$ ${data.avgDamage.toLocaleString('pt-BR')}`,
      type: 'article',
      locale: 'pt_BR',
      siteName: 'Seg360',
    },
  };
}

export function generateStaticParams() {
  return Object.keys(cityRiskData).map((key) => {
    const [estado, cidade] = key.split('/');
    return { estado, cidade };
  });
}

export default function RiskRegionPage({ params }: PageProps) {
  const key = `${params.estado}/${params.cidade}`;
  const data = cityRiskData[key];

  if (!data) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-gray-500">Regiao nao encontrada</p>
      </div>
    );
  }

  const riskLabel = riskLevelLabels[data.riskLevel];
  const types = data.riskTypes.map((t) => riskTypeLabels[t] || t);
  const stateName = stateNames[data.state] || data.state;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-primary-600">
          Home
        </Link>
        {' > '}
        <Link href="/risco" className="hover:text-primary-600">
          Risco
        </Link>
        {' > '}
        <span>{stateName}</span>
        {' > '}
        <span className="text-gray-900">{data.city}</span>
      </nav>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: `Risco de desastres naturais em ${data.city}, ${data.state}`,
            description: `Nivel de risco ${riskLabel} — ${data.incidentCount12m} ocorrencias nos ultimos 12 meses`,
            author: { '@type': 'Organization', name: 'Seg360' },
          }),
        }}
      />

      <h1 className="mb-4 text-3xl font-bold text-gray-900">
        Risco de desastres naturais em {data.city}, {data.state}
      </h1>

      <div className="mb-6 rounded-lg bg-gray-50 p-6">
        <div className="mb-4 flex items-center gap-3">
          <span className="text-lg font-semibold text-gray-700">
            Nivel de risco:
          </span>
          <span
            className={`rounded-full px-4 py-1 text-sm font-bold ${
              data.riskLevel === 'VERY_HIGH'
                ? 'bg-red-100 text-red-700'
                : data.riskLevel === 'HIGH'
                  ? 'bg-orange-100 text-orange-700'
                  : data.riskLevel === 'MEDIUM'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-green-100 text-green-700'
            }`}
          >
            {riskLabel}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {data.incidentCount12m}
            </p>
            <p className="text-sm text-gray-500">ocorrencias (12 meses)</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              R$ {data.avgDamage.toLocaleString('pt-BR')}
            </p>
            <p className="text-sm text-gray-500">prejuizo medio</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Tipos de risco:</p>
            <p className="text-sm text-gray-600">{types.join(', ')}</p>
          </div>
        </div>
      </div>

      <div className="prose prose-sm mb-8 max-w-none text-gray-600">
        <p>
          A cidade de <strong>{data.city}</strong> em{' '}
          <strong>{stateName}</strong> apresenta nivel de risco{' '}
          <strong>{riskLabel}</strong> para desastres naturais, com{' '}
          <strong>{data.incidentCount12m} ocorrencias</strong> registradas nos
          ultimos 12 meses.
        </p>
        <p>
          Os principais riscos incluem <strong>{types.join(' e ')}</strong>, com
          prejuizo medio de{' '}
          <strong>R$ {data.avgDamage.toLocaleString('pt-BR')}</strong> por
          ocorrencia. Proteger seu patrimonio com seguro contra calamidades e
          essencial nesta regiao.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/simulador"
          className="flex-1 rounded-lg bg-secondary-500 px-6 py-3 text-center text-lg font-semibold text-white transition hover:bg-secondary-600"
        >
          Simular Risco do Meu CEP
        </Link>
        <Link
          href="/cotacao"
          className="flex-1 rounded-lg border border-primary-600 px-6 py-3 text-center text-lg font-semibold text-primary-600 transition hover:bg-primary-50"
        >
          Ver Cotacoes
        </Link>
      </div>
    </div>
  );
}
