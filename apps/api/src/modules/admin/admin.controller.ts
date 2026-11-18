import { Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { BrokerService } from '../broker/broker.service';
import { PrismaService } from '../../prisma/prisma.service';

@ApiTags('admin')
@Controller('admin')
@ApiBearerAuth()
export class AdminController {
  constructor(
    private readonly brokerService: BrokerService,
    private readonly prisma: PrismaService,
  ) {}

  @Patch('brokers/:id/verify')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Verificar corretor' })
  async verifyBroker(@Param('id') id: string) {
    return this.brokerService.verifyBroker(id);
  }

  @Get('brokers')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Listar todos os corretores' })
  async listBrokers() {
    return this.prisma.brokerProfile.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get('metrics')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Metricas da plataforma' })
  async getMetrics() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      activePolicies,
      totalQuotes,
      activeBrokers,
      monthlyPayments,
    ] = await Promise.all([
      this.prisma.policy.count({ where: { status: 'ACTIVE' } }),
      this.prisma.quote.count(),
      this.prisma.brokerProfile.count({ where: { status: 'ACTIVE' } }),
      this.prisma.payment.aggregate({
        where: { status: 'PAID', createdAt: { gte: startOfMonth } },
        _sum: { amount: true },
        _count: true,
      }),
    ]);

    return {
      activePolicies,
      totalQuotes,
      activeBrokers,
      monthlyGMV: Number(monthlyPayments._sum.amount || 0),
      monthlySales: monthlyPayments._count,
      conversionRate:
        totalQuotes > 0
          ? ((monthlyPayments._count / totalQuotes) * 100).toFixed(1)
          : '0',
    };
  }
}
