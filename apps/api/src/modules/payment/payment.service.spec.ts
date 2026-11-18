import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('PaymentService', () => {
  let service: PaymentService;

  const mockQuote = {
    id: 'quote-1',
    monthlyPremium: 150.0,
    validUntil: new Date(Date.now() + 30 * 60 * 1000),
    planName: 'Completo',
    providerName: 'SeguroFacil',
    coverageAmount: 240000,
    coverageDetails: [],
  };

  const mockPrisma = {
    quote: {
      findUnique: jest.fn(),
    },
    payment: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    jest.clearAllMocks();
  });

  it('should create a PIX payment', async () => {
    mockPrisma.quote.findUnique.mockResolvedValue(mockQuote);
    mockPrisma.payment.findUnique.mockResolvedValue(null);
    mockPrisma.payment.create.mockImplementation((data) => ({
      id: 'payment-1',
      ...data.data,
      status: 'PENDING',
      createdAt: new Date(),
    }));

    const result = await service.createPayment({
      userId: 'user-1',
      quoteId: 'quote-1',
      method: 'PIX',
    });

    expect(result.method).toBe('PIX');
    expect(result.pixCode).toBeTruthy();
    expect(result.status).toBe('PENDING');
  });

  it('should throw on expired quote', async () => {
    mockPrisma.quote.findUnique.mockResolvedValue({
      ...mockQuote,
      validUntil: new Date(Date.now() - 1000),
    });

    await expect(
      service.createPayment({
        userId: 'user-1',
        quoteId: 'quote-1',
        method: 'PIX',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw on non-existent quote', async () => {
    mockPrisma.quote.findUnique.mockResolvedValue(null);

    await expect(
      service.createPayment({
        userId: 'user-1',
        quoteId: 'nonexistent',
        method: 'PIX',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should confirm payment', async () => {
    mockPrisma.payment.findUnique.mockResolvedValue({
      id: 'payment-1',
      status: 'PENDING',
    });
    mockPrisma.payment.update.mockResolvedValue({
      id: 'payment-1',
      status: 'PAID',
      paidAt: new Date(),
    });

    const result = await service.confirmPayment('payment-1');
    expect(result.status).toBe('PAID');
    expect(result.paidAt).toBeTruthy();
  });
});
