'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getPolicyById, PolicyResult } from '@/services/payment.service';

export default function ConfirmacaoPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-gray-500">Carregando...</p>
        </div>
      }
    >
      <ConfirmacaoContent />
    </Suspense>
  );
}

function ConfirmacaoContent() {
  const searchParams = useSearchParams();
  const policyId = searchParams.get('policy');

  const [policy, setPolicy] = useState<PolicyResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!policyId) {
      setLoading(false);
      return;
    }
    getPolicyById(policyId)
      .then(setPolicy)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [policyId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/2 rounded bg-gray-200" />
          <div className="h-40 rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 text-center">
      {/* Success Icon */}
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
        <svg
          className="h-10 w-10 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h1 className="mb-2 text-3xl font-bold text-gray-900">
        Parabens! Voce esta protegido!
      </h1>
      <p className="mb-8 text-gray-600">
        Sua apolice foi emitida com sucesso. Voce recebera um email com os detalhes.
      </p>

      {/* Policy Details */}
      {policy && (
        <div className="mb-8 rounded-lg border border-gray-200 p-6 text-left">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Dados da Apolice
          </h2>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-gray-500">Numero da apolice</dt>
              <dd className="font-mono font-medium">{policy.policyNumber}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Status</dt>
              <dd>
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                  Ativa
                </span>
              </dd>
            </div>
            {policy.planName && (
              <div className="flex justify-between">
                <dt className="text-gray-500">Plano</dt>
                <dd className="font-medium">{policy.planName}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-gray-500">Valor mensal</dt>
              <dd className="font-medium text-primary-600">
                R$ {policy.monthlyPremium.toFixed(2).replace('.', ',')}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Vigencia</dt>
              <dd className="font-medium">
                {new Date(policy.startDate).toLocaleDateString('pt-BR')} a{' '}
                {new Date(policy.endDate).toLocaleDateString('pt-BR')}
              </dd>
            </div>
          </dl>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/painel"
          className="rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition hover:bg-primary-700"
        >
          Ir para Meu Painel
        </Link>
        <Link
          href="/"
          className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-600 transition hover:bg-gray-50"
        >
          Voltar ao inicio
        </Link>
      </div>
    </div>
  );
}
