'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getQuoteById, QuoteResult } from '@/services/quote.service';
import {
  createPayment,
  confirmPayment,
  createPolicyFromPayment,
  PaymentResult,
} from '@/services/payment.service';

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-gray-500">Carregando...</p>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const quoteId = searchParams.get('quote');

  const [quote, setQuote] = useState<QuoteResult | null>(null);
  const [payment, setPayment] = useState<PaymentResult | null>(null);
  const [method, setMethod] = useState<'PIX' | 'CARD'>('PIX');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!quoteId) {
      setError('Cotacao nao especificada');
      setLoading(false);
      return;
    }
    getQuoteById(quoteId)
      .then(setQuote)
      .catch(() => setError('Erro ao carregar cotacao'))
      .finally(() => setLoading(false));
  }, [quoteId]);

  const handlePayment = async () => {
    if (!quoteId) return;
    setProcessing(true);
    setError('');

    try {
      const paymentResult = await createPayment(quoteId, method);
      setPayment(paymentResult);

      if (method === 'PIX') {
        // For PIX, show QR code and wait for confirmation
        // In production, this would be a webhook. For MVP, simulate auto-confirm after 5s
        setTimeout(async () => {
          try {
            await confirmPayment(paymentResult.id);
            const policy = await createPolicyFromPayment(paymentResult.id);
            router.push(`/confirmacao?policy=${policy.id}`);
          } catch {
            setError('Erro ao confirmar pagamento');
          }
        }, 5000);
      } else {
        // Card: simulate immediate payment
        await confirmPayment(paymentResult.id);
        const policy = await createPolicyFromPayment(paymentResult.id);
        router.push(`/confirmacao?policy=${policy.id}`);
      }
    } catch {
      setError('Erro ao processar pagamento. Tente novamente.');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/2 rounded bg-gray-200" />
          <div className="h-40 rounded bg-gray-200" />
          <div className="h-12 rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  if (error && !quote) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <p className="mb-4 text-red-600">{error}</p>
        <button
          onClick={() => router.push('/cotacao')}
          className="rounded-lg bg-primary-600 px-6 py-2 text-white hover:bg-primary-700"
        >
          Gerar nova cotacao
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Checkout</h1>

      {/* Plan Summary */}
      {quote && (
        <div className="mb-8 rounded-lg border border-gray-200 p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Resumo do Plano
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Plano</span>
              <span className="font-medium">{quote.planName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Seguradora</span>
              <span className="font-medium">{quote.providerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Cobertura</span>
              <span className="font-medium">
                R${' '}
                {quote.coverageAmount.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <hr className="my-3" />
            <div className="flex justify-between text-lg">
              <span className="font-semibold text-gray-900">Valor mensal</span>
              <span className="font-bold text-primary-600">
                R$ {quote.monthlyPremium.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>

          {/* Coverages */}
          <div className="mt-4 border-t pt-4">
            <p className="mb-2 text-sm font-medium text-gray-700">Coberturas:</p>
            <ul className="space-y-1">
              {quote.coverageDetails.map((item) => (
                <li key={item.type} className="flex items-center gap-2 text-sm">
                  {item.covered ? (
                    <span className="text-green-500">&#10003;</span>
                  ) : (
                    <span className="text-red-400">&#10007;</span>
                  )}
                  <span className={item.covered ? 'text-gray-700' : 'text-gray-400'}>
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Payment Method Selection */}
      {!payment && (
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Forma de Pagamento
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setMethod('PIX')}
              className={`rounded-lg border-2 p-4 text-center transition ${
                method === 'PIX'
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-2xl">&#9889;</span>
              <p className="mt-1 font-medium">Pix</p>
              <p className="text-xs text-gray-500">Aprovacao instantanea</p>
            </button>
            <button
              onClick={() => setMethod('CARD')}
              className={`rounded-lg border-2 p-4 text-center transition ${
                method === 'CARD'
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-2xl">&#128179;</span>
              <p className="mt-1 font-medium">Cartao</p>
              <p className="text-xs text-gray-500">Credito ou debito</p>
            </button>
          </div>
        </div>
      )}

      {/* PIX QR Code */}
      {payment && payment.method === 'PIX' && payment.status === 'PENDING' && (
        <div className="mb-8 rounded-lg border border-gray-200 p-6 text-center">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Escaneie o QR Code
          </h2>
          {payment.pixQrCode && (
            <img
              src={payment.pixQrCode}
              alt="QR Code Pix"
              className="mx-auto mb-4 h-48 w-48"
            />
          )}
          {payment.pixCode && (
            <div className="mb-4">
              <p className="mb-1 text-sm text-gray-500">Pix Copia e Cola:</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={payment.pixCode}
                  readOnly
                  className="flex-1 rounded border bg-gray-50 px-3 py-2 text-xs"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(payment.pixCode!)}
                  className="rounded bg-gray-200 px-3 py-2 text-xs hover:bg-gray-300"
                >
                  Copiar
                </button>
              </div>
            </div>
          )}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-primary-600" />
            Aguardando confirmacao do pagamento...
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-center text-red-700">
          {error}
        </div>
      )}

      {/* Pay Button */}
      {!payment && (
        <button
          onClick={handlePayment}
          disabled={processing}
          className="w-full rounded-lg bg-primary-600 px-6 py-4 text-lg font-semibold text-white transition hover:bg-primary-700 disabled:opacity-50"
        >
          {processing ? 'Processando...' : `Pagar com ${method === 'PIX' ? 'Pix' : 'Cartao'}`}
        </button>
      )}
    </div>
  );
}
