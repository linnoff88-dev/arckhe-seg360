'use client';

import { QuoteResult } from '@/services/quote.service';

const coverageTooltips: Record<string, string> = {
  flood: 'Cobre danos causados por enchentes, alagamentos e transbordamento de rios.',
  landslide: 'Cobre danos causados por deslizamentos de terra e desmoronamentos.',
  windstorm: 'Cobre danos causados por ventos fortes, tempestades e vendavais.',
  hail: 'Cobre danos causados por chuva de granizo em telhados e estruturas.',
  electrical: 'Cobre danos em equipamentos eletricos por surtos de energia.',
  temporary_housing: 'Cobre custos de moradia temporaria caso o imovel fique inabitavel.',
  salvage: 'Cobre custos de remocao de entulhos e salvamento de bens.',
};

interface CoverageCardProps {
  quote: QuoteResult;
  badge?: 'popular' | 'best-value' | null;
  onSelect: (quote: QuoteResult) => void;
}

export function CoverageCard({ quote, badge, onSelect }: CoverageCardProps) {
  const isHighlighted = badge != null;

  return (
    <div
      className={`flex min-w-[280px] flex-col rounded-xl border-2 p-6 transition-shadow hover:shadow-lg ${
        isHighlighted
          ? 'border-primary-600 shadow-md'
          : 'border-gray-200'
      }`}
    >
      {/* Badge */}
      {badge && (
        <div className="mb-3 -mt-3 flex justify-center">
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              badge === 'popular'
                ? 'bg-primary-100 text-primary-700'
                : 'bg-secondary-100 text-secondary-700'
            }`}
          >
            {badge === 'popular' ? 'Mais Popular' : 'Melhor Custo-Beneficio'}
          </span>
        </div>
      )}

      {/* Plan Name & Provider */}
      <h3 className="text-xl font-bold text-gray-900">{quote.planName}</h3>
      <p className="mb-4 text-sm text-gray-500">{quote.providerName}</p>

      {/* Price */}
      <div className="mb-4">
        <span className="text-3xl font-bold text-primary-600">
          R$ {quote.monthlyPremium.toFixed(2).replace('.', ',')}
        </span>
        <span className="text-gray-500">/mes</span>
      </div>

      {/* Coverage Amount */}
      <div className="mb-6 rounded-lg bg-gray-50 p-3">
        <p className="text-sm text-gray-500">Cobertura ate</p>
        <p className="text-lg font-semibold text-gray-900">
          R$ {quote.coverageAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </p>
      </div>

      {/* Coverage Details */}
      <ul className="mb-6 flex-1 space-y-3">
        {quote.coverageDetails.map((item) => (
          <li key={item.type} className="flex items-start gap-2">
            {item.covered ? (
              <svg
                className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500"
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
            ) : (
              <svg
                className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
            <span
              className={`text-sm ${item.covered ? 'text-gray-700' : 'text-gray-400'}`}
            >
              {item.label}
            </span>
            {coverageTooltips[item.type] && (
              <span className="group relative">
                <svg
                  className="h-4 w-4 cursor-help text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden w-48 -translate-x-1/2 rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-lg group-hover:block">
                  {coverageTooltips[item.type]}
                </span>
              </span>
            )}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        onClick={() => onSelect(quote)}
        className={`w-full rounded-lg px-6 py-3 font-semibold transition ${
          isHighlighted
            ? 'bg-primary-600 text-white hover:bg-primary-700'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Contratar este plano
      </button>
    </div>
  );
}
