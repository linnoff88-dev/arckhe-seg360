import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createPayment(params: {
    userId: string;
    quoteId: string;
    method: 'PIX' | 'CARD';
  }) {
    const quote = await this.prisma.quote.findUnique({
      where: { id: params.quoteId },
    });

    if (!quote) {
      throw new NotFoundException('Cotacao nao encontrada');
    }

    // Check if quote is still valid
    if (new Date() > quote.validUntil) {
      throw new BadRequestException('Cotacao expirada. Gere uma nova cotacao.');
    }

    // Check for existing payment
    const existing = await this.prisma.payment.findUnique({
      where: { quoteId: params.quoteId },
    });
    if (existing && existing.status === 'PAID') {
      throw new BadRequestException('Esta cotacao ja foi paga.');
    }

    // Mock gateway integration
    const gatewayId = `gw_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const pixCode =
      params.method === 'PIX'
        ? `00020126580014BR.GOV.BCB.PIX0136${gatewayId}520400005303986540${Number(quote.monthlyPremium).toFixed(2)}5802BR`
        : null;

    this.logger.log(
      `Payment created: method=${params.method} amount=${quote.monthlyPremium} gateway=${gatewayId}`,
    );

    const payment = await this.prisma.payment.create({
      data: {
        userId: params.userId,
        quoteId: params.quoteId,
        method: params.method,
        amount: quote.monthlyPremium,
        gatewayId,
        pixCode,
        pixQrCode: pixCode ? `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(pixCode)}&size=300x300` : null,
      },
    });

    return {
      id: payment.id,
      method: payment.method,
      amount: Number(payment.amount),
      status: payment.status,
      pixCode: payment.pixCode,
      pixQrCode: payment.pixQrCode,
      gatewayId: payment.gatewayId,
      createdAt: payment.createdAt,
    };
  }

  async confirmPayment(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new NotFoundException('Pagamento nao encontrado');
    }

    if (payment.status === 'PAID') {
      throw new BadRequestException('Pagamento ja confirmado');
    }

    const updated = await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: 'PAID',
        paidAt: new Date(),
      },
    });

    this.logger.log(`Payment confirmed: ${paymentId}`);

    return {
      id: updated.id,
      status: updated.status,
      paidAt: updated.paidAt,
    };
  }

  async getPayment(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: { quote: true },
    });

    if (!payment) {
      throw new NotFoundException('Pagamento nao encontrado');
    }

    return {
      id: payment.id,
      method: payment.method,
      amount: Number(payment.amount),
      status: payment.status,
      pixCode: payment.pixCode,
      pixQrCode: payment.pixQrCode,
      gatewayId: payment.gatewayId,
      paidAt: payment.paidAt,
      createdAt: payment.createdAt,
      quote: {
        id: payment.quote.id,
        planName: payment.quote.planName,
        providerName: payment.quote.providerName,
        monthlyPremium: Number(payment.quote.monthlyPremium),
        coverageAmount: Number(payment.quote.coverageAmount),
        coverageDetails: payment.quote.coverageDetails,
      },
    };
  }

  async getUserPayments(userId: string) {
    const payments = await this.prisma.payment.findMany({
      where: { userId },
      include: { quote: true },
      orderBy: { createdAt: 'desc' },
    });

    return payments.map((p) => ({
      id: p.id,
      method: p.method,
      amount: Number(p.amount),
      status: p.status,
      paidAt: p.paidAt,
      createdAt: p.createdAt,
      planName: p.quote.planName,
    }));
  }
}
