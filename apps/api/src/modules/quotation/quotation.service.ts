import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { InsurtechProvider, QuoteRequest, QuoteResponse } from '@seg360/shared';
import { MockInsurtechAdapter } from './providers/mock.adapter';

@Injectable()
export class QuotationService {
  private readonly logger = new Logger(QuotationService.name);
  private readonly providers: InsurtechProvider[];

  constructor(private readonly prisma: PrismaService) {
    this.providers = [new MockInsurtechAdapter()];
  }

  async generateQuotes(
    params: QuoteRequest & { userId?: string; referralCode?: string },
  ) {
    const allQuotes: QuoteResponse[] = [];

    for (const provider of this.providers) {
      try {
        const quotes = await Promise.race([
          provider.getQuotes(params),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Provider timeout')), 5000),
          ),
        ]);
        allQuotes.push(...quotes);
      } catch (error) {
        this.logger.warn(
          `Provider ${provider.name} failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
      }
    }

    // Save quotes to database
    const savedQuotes = await Promise.all(
      allQuotes.map((quote) =>
        this.prisma.quote.create({
          data: {
            userId: params.userId || null,
            cep: params.cep,
            riskLevel: params.riskLevel as 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH',
            providerName: quote.providerName,
            planName: quote.planName,
            monthlyPremium: quote.monthlyPremium,
            coverageAmount: quote.coverageAmount,
            coverageDetails: quote.coverageDetails as unknown as Prisma.InputJsonValue,
            propertyType: params.propertyType,
            propertyValue: params.propertyValue,
            validUntil: new Date(Date.now() + 30 * 60 * 1000), // 30 min
            referralCode: params.referralCode || null,
          },
        }),
      ),
    );

    return savedQuotes.map((q) => ({
      id: q.id,
      providerName: q.providerName,
      planName: q.planName,
      monthlyPremium: Number(q.monthlyPremium),
      coverageAmount: Number(q.coverageAmount),
      coverageDetails: q.coverageDetails,
      validUntil: q.validUntil,
    }));
  }

  async getQuoteById(id: string) {
    return this.prisma.quote.findUnique({ where: { id } });
  }

  async getUserQuotes(userId: string) {
    return this.prisma.quote.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
