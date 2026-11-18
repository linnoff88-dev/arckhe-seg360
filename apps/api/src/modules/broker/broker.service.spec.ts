import { Test, TestingModule } from '@nestjs/testing';
import { BrokerService } from './broker.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ConflictException, BadRequestException } from '@nestjs/common';

describe('BrokerService', () => {
  let service: BrokerService;

  const mockPrisma = {
    brokerProfile: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    lead: {
      count: jest.fn().mockResolvedValue(5),
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    referral: {
      findFirst: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn().mockResolvedValue([]),
      aggregate: jest.fn().mockResolvedValue({ _sum: { quotesGenerated: 0, salesCompleted: 0 } }),
    },
    commission: {
      findMany: jest.fn().mockResolvedValue([]),
      aggregate: jest.fn().mockResolvedValue({ _sum: { amount: 0 }, _count: 0 }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BrokerService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<BrokerService>(BrokerService);
    jest.clearAllMocks();
  });

  it('should create broker profile', async () => {
    mockPrisma.brokerProfile.findUnique.mockResolvedValue(null);
    mockPrisma.brokerProfile.create.mockImplementation((data) => ({
      id: 'bp-1',
      ...data.data,
      status: 'PENDING',
      createdAt: new Date(),
    }));

    const result = await service.createProfile('user-1', {
      susepRegistration: '123456789012345',
      companyName: 'Seguro Corp',
      region: 'RS',
    });

    expect(result.status).toBe('PENDING');
    expect(result.susepRegistration).toBe('123456789012345');
  });

  it('should throw on duplicate profile', async () => {
    mockPrisma.brokerProfile.findUnique.mockResolvedValue({ id: 'bp-1' });

    await expect(
      service.createProfile('user-1', {
        susepRegistration: '123456789012345',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should throw on invalid SUSEP number', async () => {
    mockPrisma.brokerProfile.findUnique.mockResolvedValue(null);

    await expect(
      service.createProfile('user-1', { susepRegistration: '123' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should generate referral link', async () => {
    mockPrisma.referral.findFirst.mockResolvedValue(null);
    mockPrisma.referral.create.mockImplementation((data) => ({
      id: 'ref-1',
      ...data.data,
      clicks: 0,
      quotesGenerated: 0,
      salesCompleted: 0,
      createdAt: new Date(),
    }));

    const result = await service.createReferralLink('user-1');
    expect(result.code).toMatch(/^SEG[A-Z0-9]{5}$/);
  });

  it('should return dashboard metrics', async () => {
    const result = await service.getDashboardMetrics('user-1');
    expect(result).toHaveProperty('leadsThisMonth');
    expect(result).toHaveProperty('totalQuotes');
    expect(result).toHaveProperty('totalSales');
    expect(result).toHaveProperty('commissionThisMonth');
  });
});
