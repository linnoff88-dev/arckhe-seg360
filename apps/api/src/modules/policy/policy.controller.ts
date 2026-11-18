import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PolicyService } from './policy.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('policies')
@Controller('policies')
@ApiBearerAuth()
export class PolicyController {
  constructor(private readonly policyService: PolicyService) {}

  @Post('from-payment/:paymentId')
  @ApiOperation({ summary: 'Criar apolice a partir de pagamento confirmado' })
  async createFromPayment(@Param('paymentId') paymentId: string) {
    return this.policyService.createPolicyFromPayment(paymentId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhes de uma apolice' })
  async getPolicy(@Param('id') id: string) {
    return this.policyService.getPolicyById(id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar apolices do usuario' })
  async getUserPolicies(@CurrentUser('id') userId: string) {
    return this.policyService.getUserPolicies(userId);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancelar apolice' })
  async cancelPolicy(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.policyService.cancelPolicy(id, userId);
  }
}
