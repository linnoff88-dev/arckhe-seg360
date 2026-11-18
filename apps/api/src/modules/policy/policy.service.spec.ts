import { Test, TestingModule } from '@nestjs/testing';
import { PolicyService } from './policy.service';
import { PrismaService } from '../../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('PolicyService', () => {
  let service: PolicyService;

  const mockPayment = {
    id: 'payment-1',
    userId: 'user-1',
    quoteId: 'quote-1',
    status: 'PAID',
    quote: {
      id: 'quote-1',
      monthlyPremium: 150.0,
      coverageAmount: 240000,
      coverageDetails: [{ type: 'flood', label: 'Enchente', covered: true }],
      planName: 'Completo',
      providerName: 'SeguroFacil',
      propertyType: 'HOUSE',
    },
  };

  const mockPrisma = {
    payment: {
      findUnique: jest.fn(),
    },
    policy: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PolicyService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<PolicyService>(PolicyService);
    jest.clearAllMocks();
  });

  it('should create policy from paid payment', async () => {
    mockPrisma.payment.findUnique.mockResolvedValue(mockPayment);
    mockPrisma.policy.findUnique.mockResolvedValue(null);
    mockPrisma.policy.create.mockImplementation((data) => ({
      id: 'policy-1',
      ...data.data,
      createdAt: new Date(),
    }));

    const result = await service.createPolicyFromPayment('payment-1');

    expect(result.policyNumber).toMatch(/^SEG360-\d{8}-[A-Z0-9]+$/);
    expect(result.status).toBe('ACTIVE');
    expect(mockPrisma.policy.create).toHaveBeenCalledTimes(1);
  });

  it('should throw on unpaid payment', async () => {
    mockPrisma.payment.findUnique.mockResolvedValue({
      ...mockPayment,
      status: 'PENDING',
    });

    await expect(
      service.createPolicyFromPayment('payment-1'),
    ).rejects.toThrow(BadRequestException);
  });

  it('should cancel active policy', async () => {
    mockPrisma.policy.findUnique.mockResolvedValue({
      id: 'policy-1',
      userId: 'user-1',
      status: 'ACTIVE',
      policyNumber: 'SEG360-20260214-ABC12',
    });
    mockPrisma.policy.update.mockResolvedValue({
      id: 'policy-1',
      policyNumber: 'SEG360-20260214-ABC12',
      status: 'CANCELLED',
      startDate: new Date(),
      endDate: new Date(),
      coverageDetails: [],
      monthlyPremium: 150.0,
      createdAt: new Date(),
    });

    const result = await service.cancelPolicy('policy-1', 'user-1');
    expect(result.status).toBe('CANCELLED');
  });

  it('should throw on cancel by wrong user', async () => {
    mockPrisma.policy.findUnique.mockResolvedValue({
      id: 'policy-1',
      userId: 'user-1',
      status: 'ACTIVE',
    });

    await expect(
      service.cancelPolicy('policy-1', 'user-other'),
    ).rejects.toThrow(BadRequestException);
  });
});
