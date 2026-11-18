'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getUserPolicies, PolicyResult } from '@/services/payment.service';
import { getUserQuotes, QuoteResult } from '@/services/quote.service';

const policyStatusConfig: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  ACTIVE: { label: 'Ativa', color: 'text-green-700', bg: 'bg-green-100' },
  CANCELLED: { label: 'Cancelada', color: 'text-red-700', bg: 'bg-red-100' },
  EXPIRED: { label: 'Expirada', color: 'text-gray-700', bg: 'bg-gray-100' },
  SUSPENDED: { label: 'Suspensa', color: 'text-yellow-700', bg: 'bg-yellow-100' },
};

export default function PainelPage() {
  const [policies, setPolicies] = useState<PolicyResult[]>([]);
  const [quotes, setQuotes] = useState<QuoteResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [p, q] = await Promise.all([
          getUserPolicies(),
          getUserQuotes(),
        ]);
        setPolicies(p);
        setQuotes(q);
      } catch {
        // User might not have data yet
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const activePolicies = policies.filter((p) => p.status === 'ACTIVE');
  const hasProtection = activePolicies.length > 0;

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-1/3 rounded bg-gray-200" />
          <div className="h-24 rounded-lg bg-gray-200" />
          <div className="h-48 rounded-lg bg-gray-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Meu Painel</h1>

      {/* Protection Status */}
      <div
        className={`mb-8 rounded-lg p-6 ${
          hasProtection
            ? 'border-2 border-green-200 bg-green-50'
            : 'border-2 border-red-200 bg-red-50'
        }`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full ${
              hasProtection ? 'bg-green-200' : 'bg-red-200'
            }`}
          >
            {hasProtection ? (
              <svg className="h-6 w-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            ) : (
              <svg className="h-6 w-6 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            )}
          </div>
          <div>
            <h2 className={`text-lg font-bold ${hasProtection ? 'text-green-700' : 'text-red-700'}`}>
              {hasProtection
                ? 'Voce esta protegido!'
                : 'Voce NAO esta protegido'}
            </h2>
            <p className={`text-sm ${hasProtection ? 'text-green-600' : 'text-red-600'}`}>
              {hasProtection
                ? `${activePolicies.length} apolice(s) ativa(s)`
                : 'Simule o risco e contrate um seguro para proteger seu patrimonio.'}
            </p>
          </div>
          {!hasProtection && (
            <Link
              href="/simulador"
              className="ml-auto rounded-lg bg-primary-600 px-4 py-2 text-sm text-white hover:bg-primary-700"
            >
              Simular Risco
            </Link>
          )}
        </div>
      </div>

      {/* Active Policies */}
      {policies.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Minhas Apolices
          </h2>
          <div className="space-y-4">
            {policies.map((policy) => {
              const config = policyStatusConfig[policy.status] || policyStatusConfig.ACTIVE;
              return (
                <div
                  key={policy.id}
                  className="rounded-lg border border-gray-200 p-5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">
                          {policy.planName || 'Plano de Seguro'}
                        </h3>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${config.bg} ${config.color}`}
                        >
                          {config.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {policy.providerName} | N. {policy.policyNumber}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-primary-600">
                      R$ {policy.monthlyPremium.toFixed(2).replace('.', ',')}/mes
                    </p>
                  </div>
                  <div className="mt-3 flex items-center gap-6 text-sm text-gray-500">
                    {policy.coverageAmount && (
                      <span>
                        Cobertura: R${' '}
                        {policy.coverageAmount.toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    )}
                    <span>
                      Vigencia: {new Date(policy.startDate).toLocaleDateString('pt-BR')} -{' '}
                      {new Date(policy.endDate).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Simulations */}
      {quotes.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Simulacoes Recentes
          </h2>
          <div className="space-y-3">
            {quotes.slice(0, 5).map((quote) => (
              <div
                key={quote.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {quote.planName} - {quote.providerName}
                  </p>
                  <p className="text-sm text-gray-500">
                    R$ {quote.monthlyPremium.toFixed(2).replace('.', ',')}/mes |
                    Cobertura R${' '}
                    {quote.coverageAmount.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <Link
                  href={`/checkout?quote=${quote.id}`}
                  className="text-sm text-primary-600 hover:underline"
                >
                  Contratar
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {policies.length === 0 && quotes.length === 0 && (
        <div className="rounded-lg border border-gray-200 p-8 text-center">
          <p className="mb-4 text-gray-600">
            Voce ainda nao tem apolices ou simulacoes.
          </p>
          <Link
            href="/simulador"
            className="inline-block rounded-lg bg-primary-600 px-6 py-2 text-white hover:bg-primary-700"
          >
            Simular Risco
          </Link>
        </div>
      )}
    </div>
  );
}
