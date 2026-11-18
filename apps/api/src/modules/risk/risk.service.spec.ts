import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RiskService } from './risk.service';
import { PrismaService } from '../../prisma/prisma.service';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('RiskService', () => {
  let service: RiskService;

  const mockPrisma = {
    riskData: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
    },
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('https://viacep.com.br/ws'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RiskService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<RiskService>(RiskService);
    jest.clearAllMocks();
  });

  it('should throw BadRequestException for invalid CEP', async () => {
    await expect(service.getRiskByCep('123')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should return exact match when CEP has data', async () => {
    mockPrisma.riskData.findUnique.mockResolvedValue({
      cep: '90010000',
      city: 'Porto Alegre',
      state: 'RS',
      neighborhood: 'Centro Historico',
      riskLevel: 'HIGH',
      riskTypes: ['flood', 'landslide'],
      avgDamage: 85000,
      incidentCount12m: 12,
      isApproximate: false,
    });

    const result = await service.getRiskByCep('90010-000');

    expect(result.riskLevel).toBe('HIGH');
    expect(result.city).toBe('Porto Alegre');
    expect(result.isApproximate).toBe(false);
  });

  it('should fallback to city data when CEP has no exact match', async () => {
    mockPrisma.riskData.findUnique.mockResolvedValue(null);
    mockedAxios.get.mockResolvedValue({
      data: {
        cep: '90050-000',
        bairro: 'Bom Fim',
        localidade: 'Porto Alegre',
        uf: 'RS',
      },
    });
    mockPrisma.riskData.findFirst.mockResolvedValue({
      cep: '90000000',
      city: 'Porto Alegre',
      state: 'RS',
      neighborhood: null,
      riskLevel: 'HIGH',
      riskTypes: ['flood'],
      avgDamage: 75000,
      incidentCount12m: 8,
      isApproximate: true,
    });

    const result = await service.getRiskByCep('90050000');

    expect(result.riskLevel).toBe('HIGH');
    expect(result.isApproximate).toBe(true);
  });

  it('should throw NotFoundException for non-existent CEP', async () => {
    mockPrisma.riskData.findUnique.mockResolvedValue(null);
    mockedAxios.get.mockResolvedValue({ data: { erro: true } });

    await expect(service.getRiskByCep('00000000')).rejects.toThrow(
      NotFoundException,
    );
  });
});
