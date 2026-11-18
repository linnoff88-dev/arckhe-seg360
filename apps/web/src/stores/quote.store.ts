import { create } from 'zustand';
import { QuoteResult } from '@/services/quote.service';

interface QuoteStore {
  quotes: QuoteResult[];
  setQuotes: (quotes: QuoteResult[]) => void;
  clearQuotes: () => void;
}

export const useQuoteStore = create<QuoteStore>((set) => ({
  quotes: [],
  setQuotes: (quotes) => set({ quotes }),
  clearQuotes: () => set({ quotes: [] }),
}));
