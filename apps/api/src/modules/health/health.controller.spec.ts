import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('HealthController', () => {
  let controller: HealthController;
  let service: HealthService;

  const mockPrismaService = {
    $queryRaw: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        HealthService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    service = module.get<HealthService>(HealthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return ok status when database is connected', async () => {
    mockPrismaService.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);

    const result = await controller.check();

    expect(result.status).toBe('ok');
    expect(result.database).toBe('connected');
    expect(result.version).toBeDefined();
    expect(result.timestamp).toBeDefined();
  });

  it('should return error status when database is disconnected', async () => {
    mockPrismaService.$queryRaw.mockRejectedValue(
      new Error('Connection refused'),
    );

    const result = await controller.check();

    expect(result.status).toBe('error');
    expect(result.database).toBe('disconnected');
  });
});
