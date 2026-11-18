import api from './api';

export interface QuoteResult {
  id: string;
  providerName: string;
  planName: string;
  monthlyPremium: number;
  coverageAmount: number;
  coverageDetails: CoverageDetailItem[];
  validUntil: string;
}

export interface CoverageDetailItem {
  type: string;
  label: string;
  covered: boolean;
}

export interface GenerateQuotesParams {
  cep: string;
  propertyType: 'HOUSE' | 'APARTMENT';
  propertyValue: number;
  riskLevel: string;
  riskTypes: string[];
  userId?: string;
  referralCode?: string;
}

export async function generateQuotes(
  params: GenerateQuotesParams,
): Promise<QuoteResult[]> {
  const { data } = await api.post<QuoteResult[]>('/quotes', params);
  return data;
}

export async function getQuoteById(id: string): Promise<QuoteResult> {
  const { data } = await api.get<QuoteResult>(`/quotes/${id}`);
  return data;
}

export async function getUserQuotes(): Promise<QuoteResult[]> {
  const { data } = await api.get<QuoteResult[]>('/quotes');
  return data;
}
