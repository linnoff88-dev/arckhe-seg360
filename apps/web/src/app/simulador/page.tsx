'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/services/api';

interface RiskResult {
  cep: string;
  city: string;
  state: string;
  neighborhood: string | null;
  riskLevel: string;
  riskTypes: string[];
  avgDamage: number;
  incidentCount12m: number;
  isApproximate: boolean;
  message?: string;
}

const riskLevelConfig: Record<
  string,
  { label: string; color: string; bg: string; message: string }
> = {
  LOW: {
    label: 'Baixo',
    color: 'text-green-700',
    bg: 'bg-green-100',
    message: 'Sua regiao tem baixo historico de desastres naturais.',
  },
  MEDIUM: {
    label: 'Medio',
    color: 'text-yellow-700',
    bg: 'bg-yellow-100',
    message: 'Sua regiao tem ocorrencias moderadas de desastres naturais.',
  },
  HIGH: {
    label: 'Alto',
    color: 'text-orange-700',
    bg: 'bg-orange-100',
    message:
      'Sua regiao tem historico significativo de desastres. Protecao e recomendada.',
  },
  VERY_HIGH: {
    label: 'Muito Alto',
    color: 'text-red-700',
    bg: 'bg-red-100',
    message:
      'Sua regiao e altamente vulneravel a desastres. Protecao e urgente!',
  },
};

const riskTypeLabels: Record<string, string> = {
  flood: 'Enchente',
  landslide: 'Deslizamento',
  windstorm: 'Vendaval',
  hail: 'Granizo',
};

export default function SimuladorPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[50vh] items-center justify-center"><p className="text-gray-500">Carregando...</p></div>}>
      <SimuladorContent />
    </Suspense>
  );
}

function SimuladorContent() {
  const searchParams = useSearchParams();
  const [cep, setCep] = useState(searchParams.get('cep') || '');
  const [result, setResult] = useState<RiskResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatCep = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 8);
    if (digits.length > 5) {
      return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    }
    return digits;
  };

  const handleSearch = async () => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) {
      setError('Digite um CEP valido com 8 digitos');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const { data } = await api.get<RiskResult>(`/risk/${cleanCep}`);
      setResult(data);
      // Update URL for shareability
      window.history.replaceState(null, '', `/simulador?cep=${cleanCep}`);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Erro ao consultar risco. Tente novamente.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    const cleanCep = cep.replace(/\D/g, '');
    const url = `${window.location.origin}/simulador?cep=${cleanCep}`;
    navigator.clipboard.writeText(url);
  };

  const config = result ? riskLevelConfig[result.riskLevel] : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-2 text-center text-3xl font-bold text-gray-900">
        Simulador de Risco
      </h1>
      <p className="mb-8 text-center text-gray-600">
        Digite seu CEP e descubra o nivel de risco de desastres naturais na sua
        regiao.
      </p>

      {/* CEP Input */}
      <div className="mb-8 flex gap-3">
        <input
          type="text"
          value={cep}
          onChange={(e) => setCep(formatCep(e.target.value))}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="00000-000"
          className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
          maxLength={9}
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="rounded-lg bg-primary-600 px-6 py-3 text-lg font-medium text-white transition hover:bg-primary-700 disabled:opacity-50"
        >
          {loading ? 'Buscando...' : 'Consultar'}
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-center text-red-700">
          {error}
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="animate-pulse space-y-4 rounded-lg border border-gray-200 p-6">
          <div className="h-8 w-1/3 rounded bg-gray-200" />
          <div className="h-4 w-2/3 rounded bg-gray-200" />
          <div className="h-4 w-1/2 rounded bg-gray-200" />
          <div className="h-20 rounded bg-gray-200" />
        </div>
      )}

      {/* Result */}
      {result && config && !loading && (
        <div className="space-y-6">
          {/* Risk Badge */}
          <div className="rounded-lg border border-gray-200 p-6 text-center">
            <p className="mb-2 text-sm text-gray-500">
              {result.city}, {result.state}
              {result.neighborhood && ` — ${result.neighborhood}`}
            </p>
            <div
              className={`mx-auto mb-3 inline-block rounded-full px-6 py-2 text-lg font-bold ${config.bg} ${config.color}`}
            >
              Risco {config.label}
            </div>
            <p className="text-gray-600">{config.message}</p>
            {result.isApproximate && (
              <p className="mt-2 text-xs text-gray-400">
                * Dados aproximados para esta regiao
              </p>
            )}
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">
                {result.incidentCount12m}
              </p>
              <p className="text-sm text-gray-500">
                ocorrencias nos ultimos 12 meses
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">
                R$ {result.avgDamage.toLocaleString('pt-BR')}
              </p>
              <p className="text-sm text-gray-500">prejuizo medio por ocorrencia</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4 text-center">
              <div className="flex flex-wrap justify-center gap-1">
                {result.riskTypes.map((type) => (
                  <span
                    key={type}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                  >
                    {riskTypeLabels[type] || type}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-500">tipos de risco</p>
            </div>
          </div>

          {/* Comparison */}
          <div className="rounded-lg bg-primary-50 p-6 text-center">
            <p className="mb-1 text-sm text-primary-700">
              Prejuizo medio:{' '}
              <strong>R$ {result.avgDamage.toLocaleString('pt-BR')}</strong>
            </p>
            <p className="text-sm text-primary-700">
              Protecao a partir de: <strong>R$ 30/mes</strong>
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/cotacao"
              className="flex-1 rounded-lg bg-secondary-500 px-6 py-3 text-center text-lg font-semibold text-white transition hover:bg-secondary-600"
            >
              Quero me proteger
            </Link>
            <button
              onClick={copyLink}
              className="rounded-lg border border-gray-300 px-6 py-3 text-sm text-gray-600 transition hover:bg-gray-50"
            >
              Copiar link do resultado
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
