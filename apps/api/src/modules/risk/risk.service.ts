import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { PrismaService } from '../../prisma/prisma.service';

interface ViaCepResponse {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

@Injectable()
export class RiskService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async getRiskByCep(cep: string) {
    const cleanCep = cep.replace(/\D/g, '');

    if (cleanCep.length !== 8) {
      throw new BadRequestException('CEP deve ter 8 digitos');
    }

    // Check for exact match first
    const exactMatch = await this.prisma.riskData.findUnique({
      where: { cep: cleanCep },
    });

    if (exactMatch) {
      return this.formatResponse(exactMatch);
    }

    // Resolve CEP via ViaCEP to get city/state
    const address = await this.resolveAddress(cleanCep);

    if (!address) {
      throw new NotFoundException('CEP nao encontrado');
    }

    // Try fallback: city-level data
    const cityMatch = await this.prisma.riskData.findFirst({
      where: {
        city: address.localidade,
        state: address.uf,
        isApproximate: true,
      },
    });

    if (cityMatch) {
      return this.formatResponse({
        ...cityMatch,
        cep: cleanCep,
        neighborhood: address.bairro || null,
        isApproximate: true,
      });
    }

    // No data at all — return LOW risk default
    return {
      cep: cleanCep,
      city: address.localidade,
      state: address.uf,
      neighborhood: address.bairro || null,
      riskLevel: 'LOW',
      riskTypes: [],
      avgDamage: 0,
      incidentCount12m: 0,
      isApproximate: true,
      message: 'Dados aproximados — sem historico especifico para esta regiao',
    };
  }

  private async resolveAddress(cep: string): Promise<ViaCepResponse | null> {
    try {
      const baseUrl =
        this.configService.get<string>('VIACEP_BASE_URL') ||
        'https://viacep.com.br/ws';
      const { data } = await axios.get<ViaCepResponse>(
        `${baseUrl}/${cep}/json`,
        { timeout: 3000 },
      );
      if (data.erro) return null;
      return data;
    } catch {
      return null;
    }
  }

  private formatResponse(data: {
    cep: string;
    city: string;
    state: string;
    neighborhood: string | null;
    riskLevel: string;
    riskTypes: string[];
    avgDamage: unknown;
    incidentCount12m: number;
    isApproximate: boolean;
  }) {
    return {
      cep: data.cep,
      city: data.city,
      state: data.state,
      neighborhood: data.neighborhood,
      riskLevel: data.riskLevel,
      riskTypes: data.riskTypes,
      avgDamage: Number(data.avgDamage),
      incidentCount12m: data.incidentCount12m,
      isApproximate: data.isApproximate,
    };
  }
}
