import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('EmailService', () => {
  let service: EmailService;

  const mockPrisma = {
    emailLog: {
      create: jest.fn().mockResolvedValue({ id: 'log-1' }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
    jest.clearAllMocks();
  });

  it('should send registration confirmation', async () => {
    const result = await service.sendRegistrationConfirmation(
      'user-1',
      'test@example.com',
      'Maria',
    );
    expect(result).toBe(true);
    expect(mockPrisma.emailLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          templateId: 'registration-confirmation',
          toEmail: 'test@example.com',
          status: 'SENT',
        }),
      }),
    );
  });

  it('should send policy confirmation', async () => {
    const result = await service.sendPolicyConfirmation('user-1', 'test@example.com', {
      name: 'Maria',
      policyNumber: 'SEG360-20260214-ABC12',
      planName: 'Completo',
      monthlyPremium: '150,00',
    });
    expect(result).toBe(true);
    expect(mockPrisma.emailLog.create).toHaveBeenCalledTimes(1);
  });

  it('should send new lead notification', async () => {
    const result = await service.sendNewLeadNotification(
      'broker-1',
      'broker@example.com',
      {
        brokerName: 'Carlos',
        consumerName: 'Maria',
        cep: '90010000',
        riskLevel: 'HIGH',
      },
    );
    expect(result).toBe(true);
  });

  it('should send renewal reminder', async () => {
    const result = await service.sendRenewalReminder('user-1', 'test@example.com', {
      name: 'Maria',
      policyNumber: 'SEG360-20260214-ABC12',
      dueDate: '21/02/2026',
    });
    expect(result).toBe(true);
  });
});
