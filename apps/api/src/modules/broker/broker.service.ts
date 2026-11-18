import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BrokerService {
  private readonly logger = new Logger(BrokerService.name);

  constructor(private readonly prisma: PrismaService) {}

  // Story 5.1: Broker Onboarding
  async createProfile(
    userId: string,
    data: {
      susepRegistration: string;
      companyName?: string;
      cnpj?: string;
      region?: string;
    },
  ) {
    const existing = await this.prisma.brokerProfile.findUnique({
      where: { userId },
    });
    if (existing) {
      throw new ConflictException('Perfil de corretor ja existe');
    }

    // Basic SUSEP format validation (15 digits)
    if (!/^\d{15}$/.test(data.susepRegistration.replace(/\D/g, ''))) {
      throw new BadRequestException(
        'Registro SUSEP invalido. Deve conter 15 digitos.',
      );
    }

    const profile = await this.prisma.brokerProfile.create({
      data: {
        userId,
        susepRegistration: data.susepRegistration,
        companyName: data.companyName || null,
        cnpj: data.cnpj || null,
        region: data.region || null,
      },
    });

    this.logger.log(`Broker profile created: ${userId}`);

    return profile;
  }

  async getProfile(userId: string) {
    const profile = await this.prisma.brokerProfile.findUnique({
      where: { userId },
      include: { user: { select: { name: true, email: true, phone: true } } },
    });

    if (!profile) {
      throw new NotFoundException('Perfil de corretor nao encontrado');
    }

    return profile;
  }

  async verifyBroker(brokerId: string) {
    const profile = await this.prisma.brokerProfile.findUnique({
      where: { id: brokerId },
    });

    if (!profile) {
      throw new NotFoundException('Corretor nao encontrado');
    }

    return this.prisma.brokerProfile.update({
      where: { id: brokerId },
      data: { status: 'ACTIVE', verifiedAt: new Date() },
    });
  }

  // Story 5.2: Dashboard & Leads
  async getDashboardMetrics(userId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [leadsCount, quotesCount, salesCount, commissionTotal] =
      await Promise.all([
        this.prisma.lead.count({
          where: { brokerId: userId, createdAt: { gte: startOfMonth } },
        }),
        this.prisma.referral.aggregate({
          where: { brokerId: userId },
          _sum: { quotesGenerated: true },
        }),
        this.prisma.referral.aggregate({
          where: { brokerId: userId },
          _sum: { salesCompleted: true },
        }),
        this.prisma.commission.aggregate({
          where: {
            brokerId: userId,
            createdAt: { gte: startOfMonth },
          },
          _sum: { amount: true },
        }),
      ]);

    return {
      leadsThisMonth: leadsCount,
      totalQuotes: quotesCount._sum.quotesGenerated || 0,
      totalSales: salesCount._sum.salesCompleted || 0,
      commissionThisMonth: Number(commissionTotal._sum.amount || 0),
    };
  }

  async getLeads(
    userId: string,
    filters?: { status?: string; cep?: string },
  ) {
    return this.prisma.lead.findMany({
      where: {
        brokerId: userId,
        ...(filters?.status
          ? { status: filters.status as 'NEW' | 'CONTACTED' | 'CONVERTED' | 'LOST' }
          : {}),
        ...(filters?.cep ? { cep: { startsWith: filters.cep } } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateLeadStatus(
    leadId: string,
    userId: string,
    status: 'NEW' | 'CONTACTED' | 'CONVERTED' | 'LOST',
    notes?: string,
  ) {
    const lead = await this.prisma.lead.findUnique({
      where: { id: leadId },
    });

    if (!lead) throw new NotFoundException('Lead nao encontrado');
    if (lead.brokerId !== userId)
      throw new BadRequestException('Acesso nao autorizado');

    return this.prisma.lead.update({
      where: { id: leadId },
      data: { status, ...(notes !== undefined ? { notes } : {}) },
    });
  }

  // Story 5.3: Referral Links & Commissions
  async createReferralLink(userId: string) {
    const existing = await this.prisma.referral.findFirst({
      where: { brokerId: userId },
    });
    if (existing) return existing;

    const code = this.generateReferralCode();

    return this.prisma.referral.create({
      data: { brokerId: userId, code },
    });
  }

  async getReferralStats(userId: string) {
    return this.prisma.referral.findMany({
      where: { brokerId: userId },
    });
  }

  async getCommissions(userId: string) {
    return this.prisma.commission.findMany({
      where: { brokerId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCommissionSummary(userId: string) {
    const [pending, paid] = await Promise.all([
      this.prisma.commission.aggregate({
        where: { brokerId: userId, status: 'PENDING' },
        _sum: { amount: true },
        _count: true,
      }),
      this.prisma.commission.aggregate({
        where: { brokerId: userId, status: 'PAID' },
        _sum: { amount: true },
        _count: true,
      }),
    ]);

    return {
      pendingAmount: Number(pending._sum.amount || 0),
      pendingCount: pending._count,
      paidAmount: Number(paid._sum.amount || 0),
      paidCount: paid._count,
    };
  }

  private generateReferralCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'SEG';
    for (let i = 0; i < 5; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  }
}
