import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { QuotationService } from './quotation.service';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('quotes')
@Controller('quotes')
export class QuotationController {
  constructor(private readonly quotationService: QuotationService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Gerar cotacoes' })
  async generateQuotes(
    @Body()
    body: {
      cep: string;
      propertyType: 'HOUSE' | 'APARTMENT';
      propertyValue: number;
      riskLevel: string;
      riskTypes: string[];
      userId?: string;
      referralCode?: string;
    },
  ) {
    return this.quotationService.generateQuotes(body);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Detalhes de uma cotacao' })
  async getQuote(@Param('id') id: string) {
    return this.quotationService.getQuoteById(id);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar cotacoes do usuario' })
  async getUserQuotes(@CurrentUser('id') userId: string) {
    return this.quotationService.getUserQuotes(userId);
  }
}
