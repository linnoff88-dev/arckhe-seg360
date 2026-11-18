import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { RiskService } from './risk.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('risk')
@Controller('risk')
export class RiskController {
  constructor(private readonly riskService: RiskService) {}

  @Get(':cep')
  @Public()
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @ApiOperation({ summary: 'Consultar risco por CEP' })
  @ApiParam({ name: 'cep', description: 'CEP (8 digitos)', example: '90010000' })
  async getRiskByCep(@Param('cep') cep: string) {
    return this.riskService.getRiskByCep(cep);
  }
}
