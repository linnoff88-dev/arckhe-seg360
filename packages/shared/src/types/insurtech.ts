export interface QuoteRequest {
  cep: string;
  propertyType: 'HOUSE' | 'APARTMENT';
  propertyValue: number;
  riskLevel: string;
  riskTypes: string[];
}

export interface CoverageDetail {
  type: string;
  label: string;
  covered: boolean;
}

export interface QuoteResponse {
  providerName: string;
  planName: string;
  monthlyPremium: number;
  coverageAmount: number;
  coverageDetails: CoverageDetail[];
}

export interface InsurtechProvider {
  readonly name: string;
  getQuotes(params: QuoteRequest): Promise<QuoteResponse[]>;
}
