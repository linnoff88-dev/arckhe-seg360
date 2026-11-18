import {
  InsurtechProvider,
  QuoteRequest,
  QuoteResponse,
} from '@seg360/shared';

export class MockInsurtechAdapter implements InsurtechProvider {
  readonly name = 'SeguroFacil';

  async getQuotes(params: QuoteRequest): Promise<QuoteResponse[]> {
    const basePremium = this.calculateBasePremium(params);

    return [
      {
        providerName: this.name,
        planName: 'Basico',
        monthlyPremium: Math.round(basePremium * 100) / 100,
        coverageAmount: params.propertyValue * 0.5,
        coverageDetails: [
          { type: 'flood', label: 'Enchente', covered: true },
          { type: 'landslide', label: 'Deslizamento', covered: true },
          { type: 'windstorm', label: 'Vendaval', covered: false },
          { type: 'hail', label: 'Granizo', covered: false },
          { type: 'electrical', label: 'Danos eletricos', covered: false },
          { type: 'temporary_housing', label: 'Moradia temporaria', covered: false },
          { type: 'salvage', label: 'Salvados', covered: false },
        ],
      },
      {
        providerName: this.name,
        planName: 'Completo',
        monthlyPremium: Math.round(basePremium * 1.8 * 100) / 100,
        coverageAmount: params.propertyValue * 0.8,
        coverageDetails: [
          { type: 'flood', label: 'Enchente', covered: true },
          { type: 'landslide', label: 'Deslizamento', covered: true },
          { type: 'windstorm', label: 'Vendaval', covered: true },
          { type: 'hail', label: 'Granizo', covered: true },
          { type: 'electrical', label: 'Danos eletricos', covered: true },
          { type: 'temporary_housing', label: 'Moradia temporaria', covered: false },
          { type: 'salvage', label: 'Salvados', covered: false },
        ],
      },
      {
        providerName: this.name,
        planName: 'Premium',
        monthlyPremium: Math.round(basePremium * 2.5 * 100) / 100,
        coverageAmount: params.propertyValue,
        coverageDetails: [
          { type: 'flood', label: 'Enchente', covered: true },
          { type: 'landslide', label: 'Deslizamento', covered: true },
          { type: 'windstorm', label: 'Vendaval', covered: true },
          { type: 'hail', label: 'Granizo', covered: true },
          { type: 'electrical', label: 'Danos eletricos', covered: true },
          { type: 'temporary_housing', label: 'Moradia temporaria', covered: true },
          { type: 'salvage', label: 'Salvados', covered: true },
        ],
      },
    ];
  }

  private calculateBasePremium(params: QuoteRequest): number {
    const riskMultiplier: Record<string, number> = {
      LOW: 0.003,
      MEDIUM: 0.005,
      HIGH: 0.008,
      VERY_HIGH: 0.012,
    };

    const typeMultiplier = params.propertyType === 'HOUSE' ? 1.0 : 0.85;
    const multiplier = riskMultiplier[params.riskLevel] || 0.005;

    return (params.propertyValue * multiplier * typeMultiplier) / 12;
  }
}
