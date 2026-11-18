import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BrokerService } from './broker.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('brokers')
@Controller('brokers')
@ApiBearerAuth()
export class BrokerController {
  constructor(private readonly brokerService: BrokerService) {}

  // Story 5.1: Onboarding
  @Post('profile')
  @Roles('BROKER')
  @ApiOperation({ summary: 'Criar perfil de corretor (onboarding)' })
  async createProfile(
    @CurrentUser('id') userId: string,
    @Body()
    body: {
      susepRegistration: string;
      companyName?: string;
      cnpj?: string;
      region?: string;
    },
  ) {
    return this.brokerService.createProfile(userId, body);
  }

  @Get('me')
  @Roles('BROKER')
  @ApiOperation({ summary: 'Perfil do corretor logado' })
  async getProfile(@CurrentUser('id') userId: string) {
    return this.brokerService.getProfile(userId);
  }

  // Story 5.2: Dashboard & Leads
  @Get('dashboard')
  @Roles('BROKER')
  @ApiOperation({ summary: 'Metricas do dashboard do corretor' })
  async getDashboard(@CurrentUser('id') userId: string) {
    return this.brokerService.getDashboardMetrics(userId);
  }

  @Get('leads')
  @Roles('BROKER')
  @ApiOperation({ summary: 'Listar leads do corretor' })
  async getLeads(
    @CurrentUser('id') userId: string,
    @Query('status') status?: string,
    @Query('cep') cep?: string,
  ) {
    return this.brokerService.getLeads(userId, { status, cep });
  }

  @Patch('leads/:id')
  @Roles('BROKER')
  @ApiOperation({ summary: 'Atualizar status do lead' })
  async updateLead(
    @CurrentUser('id') userId: string,
    @Param('id') leadId: string,
    @Body() body: { status: 'NEW' | 'CONTACTED' | 'CONVERTED' | 'LOST'; notes?: string },
  ) {
    return this.brokerService.updateLeadStatus(leadId, userId, body.status, body.notes);
  }

  // Story 5.3: Referral Links & Commissions
  @Post('referral-link')
  @Roles('BROKER')
  @ApiOperation({ summary: 'Gerar link de referencia personalizado' })
  async createReferralLink(@CurrentUser('id') userId: string) {
    return this.brokerService.createReferralLink(userId);
  }

  @Get('referrals')
  @Roles('BROKER')
  @ApiOperation({ summary: 'Estatisticas de referral' })
  async getReferrals(@CurrentUser('id') userId: string) {
    return this.brokerService.getReferralStats(userId);
  }

  @Get('commissions')
  @Roles('BROKER')
  @ApiOperation({ summary: 'Listar comissoes' })
  async getCommissions(@CurrentUser('id') userId: string) {
    return this.brokerService.getCommissions(userId);
  }

  @Get('commissions/summary')
  @Roles('BROKER')
  @ApiOperation({ summary: 'Resumo de comissoes' })
  async getCommissionSummary(@CurrentUser('id') userId: string) {
    return this.brokerService.getCommissionSummary(userId);
  }
}
