import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('payments')
@Controller('payments')
@ApiBearerAuth()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @ApiOperation({ summary: 'Criar pagamento para uma cotacao' })
  async createPayment(
    @CurrentUser('id') userId: string,
    @Body() body: { quoteId: string; method: 'PIX' | 'CARD' },
  ) {
    return this.paymentService.createPayment({
      userId,
      quoteId: body.quoteId,
      method: body.method,
    });
  }

  @Post(':id/confirm')
  @ApiOperation({ summary: 'Confirmar pagamento (mock webhook)' })
  async confirmPayment(@Param('id') id: string) {
    return this.paymentService.confirmPayment(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhes do pagamento' })
  async getPayment(@Param('id') id: string) {
    return this.paymentService.getPayment(id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar pagamentos do usuario' })
  async getUserPayments(@CurrentUser('id') userId: string) {
    return this.paymentService.getUserPayments(userId);
  }
}
