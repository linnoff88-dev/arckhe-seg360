import { Test, TestingModule } from '@nestjs/testing';
import { QuotationService } from './quotation.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('QuotationService', () => {
  let service: QuotationService;

  const mockPrisma = {
    quote: {
      create: jest.fn().mockImplementation((data) => ({
        id: 'quote-1',
        ...data.data,
        monthlyPremium: data.data.monthlyPremium,
        coverageAmount: data.data.coverageAmount,
      })),
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuotationService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<QuotationService>(QuotationService);
    jest.clearAllMocks();
  });

  it('should generate quotes from mock provider', async () => {
    const result = await service.generateQuotes({
      cep: '90010000',
      propertyType: 'HOUSE',
      propertyValue: 300000,
      riskLevel: 'HIGH',
      riskTypes: ['flood'],
    });

    expect(result.length).toBe(3); // Basico, Completo, Premium
    expect(mockPrisma.quote.create).toHaveBeenCalledTimes(3);
  });

  it('should return quotes with increasing premiums', async () => {
    const result = await service.generateQuotes({
      cep: '90010000',
      propertyType: 'APARTMENT',
      propertyValue: 200000,
      riskLevel: 'MEDIUM',
      riskTypes: ['flood'],
    });

    expect(result[0].monthlyPremium).toBeLessThan(result[1].monthlyPremium);
    expect(result[1].monthlyPremium).toBeLessThan(result[2].monthlyPremium);
  });
});
