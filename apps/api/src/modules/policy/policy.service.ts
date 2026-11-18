import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PolicyService {
  private readonly logger = new Logger(PolicyService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createPolicyFromPayment(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: { quote: true },
    });

    if (!payment) {
      throw new NotFoundException('Pagamento nao encontrado');
    }

    if (payment.status !== 'PAID') {
      throw new BadRequestException('Pagamento nao confirmado');
    }

    // Check if policy already exists
    const existing = await this.prisma.policy.findUnique({
      where: { paymentId },
    });
    if (existing) {
      return this.formatPolicy(existing);
    }

    const policyNumber = this.generatePolicyNumber();
    const startDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1); // 1 year policy

    const policy = await this.prisma.policy.create({
      data: {
        userId: payment.userId,
        quoteId: payment.quoteId,
        paymentId: payment.id,
        policyNumber,
        status: 'ACTIVE',
        startDate,
        endDate,
        coverageDetails: payment.quote.coverageDetails as unknown as Prisma.InputJsonValue,
        monthlyPremium: payment.quote.monthlyPremium,
      },
    });

    this.logger.log(
      `Policy created: ${policyNumber} for user ${payment.userId}`,
    );

    return this.formatPolicy(policy);
  }

  async getPolicyById(id: string) {
    const policy = await this.prisma.policy.findUnique({
      where: { id },
      include: { quote: true, payment: true },
    });

    if (!policy) {
      throw new NotFoundException('Apolice nao encontrada');
    }

    return {
      ...this.formatPolicy(policy),
      quote: {
        planName: policy.quote.planName,
        providerName: policy.quote.providerName,
        propertyType: policy.quote.propertyType,
        coverageAmount: Number(policy.quote.coverageAmount),
      },
      payments: [
        {
          id: policy.payment.id,
          amount: Number(policy.payment.amount),
          status: policy.payment.status,
          method: policy.payment.method,
          paidAt: policy.payment.paidAt,
        },
      ],
    };
  }

  async getUserPolicies(userId: string) {
    const policies = await this.prisma.policy.findMany({
      where: { userId },
      include: { quote: true },
      orderBy: { createdAt: 'desc' },
    });

    return policies.map((p) => ({
      ...this.formatPolicy(p),
      planName: p.quote.planName,
      providerName: p.quote.providerName,
      coverageAmount: Number(p.quote.coverageAmount),
    }));
  }

  async cancelPolicy(id: string, userId: string) {
    const policy = await this.prisma.policy.findUnique({
      where: { id },
    });

    if (!policy) {
      throw new NotFoundException('Apolice nao encontrada');
    }

    if (policy.userId !== userId) {
      throw new BadRequestException('Acesso nao autorizado');
    }

    if (policy.status !== 'ACTIVE') {
      throw new BadRequestException('Apolice nao esta ativa');
    }

    const updated = await this.prisma.policy.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    this.logger.log(`Policy cancelled: ${policy.policyNumber}`);

    return this.formatPolicy(updated);
  }

  private generatePolicyNumber(): string {
    const now = new Date();
    const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomPart = Math.random()
      .toString(36)
      .slice(2, 7)
      .toUpperCase();
    return `SEG360-${datePart}-${randomPart}`;
  }

  private formatPolicy(policy: {
    id: string;
    policyNumber: string;
    status: string;
    startDate: Date;
    endDate: Date;
    coverageDetails: unknown;
    monthlyPremium: Prisma.Decimal;
    createdAt: Date;
  }) {
    return {
      id: policy.id,
      policyNumber: policy.policyNumber,
      status: policy.status,
      startDate: policy.startDate,
      endDate: policy.endDate,
      coverageDetails: policy.coverageDetails,
      monthlyPremium: Number(policy.monthlyPremium),
      createdAt: policy.createdAt,
    };
  }
}
