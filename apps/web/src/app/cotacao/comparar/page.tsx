'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useQuoteStore } from '@/stores/quote.store';
import { getQuoteById, QuoteResult } from '@/services/quote.service';
import { CoverageCard } from '@/components/quotation/coverage-card';

type SortOption = 'price-asc' | 'coverage-desc' | 'cost-benefit';
type CoverageFilter = string | null;

export default function CompararPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-gray-500">Carregando...</p>
        </div>
      }
    >
      <CompararContent />
    </Suspense>
  );
}

function CompararContent() {
  const searchParams = useSearchParams();
  const storeQuotes = useQuoteStore((s) => s.quotes);
  const setStoreQuotes = useQuoteStore((s) => s.setQuotes);
  const [quotes, setQuotes] = useState<QuoteResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('price-asc');
  const [coverageFilter, setCoverageFilter] = useState<CoverageFilter>(null);

  // Load quotes from URL params or store
  useEffect(() => {
    async function loadQuotes() {
      setLoading(true);
      setError('');

      const quoteIds = searchParams.get('quotes');

      if (quoteIds) {
        // Load from API by IDs
        try {
          const ids = quoteIds.split(',');
          const results = await Promise.all(ids.map((id) => getQuoteById(id)));
          setQuotes(results);
          setStoreQuotes(results);
        } catch {
          setError('Erro ao carregar cotacoes. Tente novamente.');
        }
      } else if (storeQuotes.length > 0) {
        // Use quotes from store
        setQuotes(storeQuotes);
      } else {
        setError('Nenhuma cotacao encontrada. Faca uma simulacao primeiro.');
      }

      setLoading(false);
    }

    loadQuotes();
  }, [searchParams, storeQuotes, setStoreQuotes]);

  // Get all unique coverage types
  const coverageTypes = useMemo(() => {
    const types = new Map<string, string>();
    quotes.forEach((q) =>
      q.coverageDetails.forEach((d) => types.set(d.type, d.label)),
    );
    return Array.from(types.entries());
  }, [quotes]);

  // Filter and sort quotes
  const displayQuotes = useMemo(() => {
    let filtered = [...quotes];

    // Filter by coverage type
    if (coverageFilter) {
      filtered = filtered.filter((q) =>
        q.coverageDetails.some(
          (d) => d.type === coverageFilter && d.covered,
        ),
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.monthlyPremium - b.monthlyPremium);
        break;
      case 'coverage-desc':
        filtered.sort((a, b) => b.coverageAmount - a.coverageAmount);
        break;
      case 'cost-benefit':
        filtered.sort(
          (a, b) =>
            b.coverageAmount / b.monthlyPremium -
            a.coverageAmount / a.monthlyPremium,
        );
        break;
    }

    return filtered;
  }, [quotes, sortBy, coverageFilter]);

  // Determine badges
  const badges = useMemo(() => {
    if (displayQuotes.length === 0) return new Map<string, 'popular' | 'best-value'>();
    const map = new Map<string, 'popular' | 'best-value'>();

    // "Mais Popular" = middle plan (Completo)
    const sorted = [...displayQuotes].sort(
      (a, b) => a.monthlyPremium - b.monthlyPremium,
    );
    if (sorted.length >= 2) {
      const mid = Math.floor(sorted.length / 2);
      map.set(sorted[mid].id, 'popular');
    }

    // "Melhor Custo-Beneficio" = best coverage/price ratio
    const bestRatio = [...displayQuotes].sort(
      (a, b) =>
        b.coverageAmount / b.monthlyPremium -
        a.coverageAmount / a.monthlyPremium,
    )[0];
    if (bestRatio && !map.has(bestRatio.id)) {
      map.set(bestRatio.id, 'best-value');
    }

    return map;
  }, [displayQuotes]);

  const handleSelect = (quote: QuoteResult) => {
    // Placeholder: will redirect to checkout in Epic 4
    alert(
      `Plano "${quote.planName}" selecionado! Funcionalidade de contratacao sera implementada em breve.`,
    );
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Compare os Planos
        </h1>
        <p className="text-gray-600">
          Veja as coberturas lado a lado e escolha o plano ideal para voce.
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-8 rounded-lg bg-red-50 p-6 text-center">
          <p className="mb-4 text-red-700">{error}</p>
          <Link
            href="/simulador"
            className="inline-block rounded-lg bg-primary-600 px-6 py-2 text-white transition hover:bg-primary-700"
          >
            Ir para o Simulador
          </Link>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl border border-gray-200 p-6"
            >
              <div className="mb-4 h-6 w-2/3 rounded bg-gray-200" />
              <div className="mb-2 h-4 w-1/2 rounded bg-gray-200" />
              <div className="mb-6 h-10 w-1/2 rounded bg-gray-200" />
              <div className="mb-4 h-16 rounded bg-gray-200" />
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((j) => (
                  <div key={j} className="h-4 rounded bg-gray-200" />
                ))}
              </div>
              <div className="mt-6 h-12 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      )}

      {/* Controls */}
      {!loading && quotes.length > 0 && (
        <>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Sort */}
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm font-medium text-gray-700">
                Ordenar por:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
              >
                <option value="price-asc">Menor preco</option>
                <option value="coverage-desc">Maior cobertura</option>
                <option value="cost-benefit">Melhor custo-beneficio</option>
              </select>
            </div>

            {/* Coverage Filter */}
            <div className="flex items-center gap-2">
              <label htmlFor="filter" className="text-sm font-medium text-gray-700">
                Filtrar cobertura:
              </label>
              <select
                id="filter"
                value={coverageFilter || ''}
                onChange={(e) =>
                  setCoverageFilter(e.target.value || null)
                }
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
              >
                <option value="">Todos os planos</option>
                {coverageTypes.map(([type, label]) => (
                  <option key={type} value={type}>
                    Com {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Empty after filter */}
          {displayQuotes.length === 0 && (
            <div className="rounded-lg border border-gray-200 p-8 text-center">
              <p className="mb-2 text-gray-600">
                Nenhum plano encontrado com esse filtro.
              </p>
              <button
                onClick={() => setCoverageFilter(null)}
                className="text-sm text-primary-600 hover:underline"
              >
                Limpar filtro
              </button>
            </div>
          )}

          {/* Cards Grid - Desktop: side by side, Mobile: horizontal scroll */}
          {displayQuotes.length > 0 && (
            <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-3 md:overflow-visible">
              {displayQuotes.map((quote) => (
                <div key={quote.id} className="snap-center flex-shrink-0 w-[85vw] max-w-[340px] md:w-auto md:max-w-none">
                  <CoverageCard
                    quote={quote}
                    badge={badges.get(quote.id) || null}
                    onSelect={handleSelect}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Back link */}
          <div className="mt-8 text-center">
            <Link
              href="/simulador"
              className="text-sm text-primary-600 hover:underline"
            >
              Refazer simulacao de risco
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
