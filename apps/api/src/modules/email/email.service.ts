import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export type EmailTemplate =
  | 'registration-confirmation'
  | 'broker-welcome'
  | 'policy-confirmation'
  | 'renewal-reminder'
  | 'cancellation-confirmation'
  | 'new-lead-notification';

interface EmailPayload {
  to: string;
  userId?: string;
  template: EmailTemplate;
  data: Record<string, string | number>;
}

const EMAIL_SUBJECTS: Record<EmailTemplate, string> = {
  'registration-confirmation': 'Bem-vindo ao Seg360!',
  'broker-welcome': 'Bem-vindo ao Seg360 - Portal do Corretor',
  'policy-confirmation': 'Sua apolice foi emitida - Seg360',
  'renewal-reminder': 'Lembrete de renovacao - Seg360',
  'cancellation-confirmation': 'Confirmacao de cancelamento - Seg360',
  'new-lead-notification': 'Novo lead recebido - Seg360',
};

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly maxRetries = 3;

  constructor(private readonly prisma: PrismaService) {}

  async sendEmail(payload: EmailPayload): Promise<boolean> {
    const subject = EMAIL_SUBJECTS[payload.template];

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        // In production, integrate with SendGrid/AWS SES here
        // For MVP, we log the email and mark as sent
        const html = this.renderTemplate(payload.template, payload.data);

        this.logger.log(
          `Email sent: template=${payload.template} to=${payload.to} subject="${subject}"`,
        );
        this.logger.debug(`Email body preview: ${html.slice(0, 200)}...`);

        await this.prisma.emailLog.create({
          data: {
            userId: payload.userId || null,
            templateId: payload.template,
            toEmail: payload.to,
            subject,
            status: 'SENT',
            attempts: attempt,
            sentAt: new Date(),
          },
        });

        return true;
      } catch (error) {
        this.logger.warn(
          `Email attempt ${attempt}/${this.maxRetries} failed: ${error instanceof Error ? error.message : 'Unknown'}`,
        );

        if (attempt === this.maxRetries) {
          await this.prisma.emailLog.create({
            data: {
              userId: payload.userId || null,
              templateId: payload.template,
              toEmail: payload.to,
              subject,
              status: 'FAILED',
              attempts: attempt,
            },
          });
          return false;
        }
      }
    }

    return false;
  }

  async sendRegistrationConfirmation(userId: string, email: string, name: string) {
    return this.sendEmail({
      to: email,
      userId,
      template: 'registration-confirmation',
      data: { name },
    });
  }

  async sendBrokerWelcome(userId: string, email: string, name: string) {
    return this.sendEmail({
      to: email,
      userId,
      template: 'broker-welcome',
      data: { name },
    });
  }

  async sendPolicyConfirmation(
    userId: string,
    email: string,
    data: { name: string; policyNumber: string; planName: string; monthlyPremium: string },
  ) {
    return this.sendEmail({
      to: email,
      userId,
      template: 'policy-confirmation',
      data,
    });
  }

  async sendRenewalReminder(
    userId: string,
    email: string,
    data: { name: string; policyNumber: string; dueDate: string },
  ) {
    return this.sendEmail({
      to: email,
      userId,
      template: 'renewal-reminder',
      data,
    });
  }

  async sendCancellationConfirmation(
    userId: string,
    email: string,
    data: { name: string; policyNumber: string; effectiveDate: string },
  ) {
    return this.sendEmail({
      to: email,
      userId,
      template: 'cancellation-confirmation',
      data,
    });
  }

  async sendNewLeadNotification(
    brokerId: string,
    email: string,
    data: { brokerName: string; consumerName: string; cep: string; riskLevel: string },
  ) {
    return this.sendEmail({
      to: email,
      userId: brokerId,
      template: 'new-lead-notification',
      data,
    });
  }

  private renderTemplate(
    template: EmailTemplate,
    data: Record<string, string | number>,
  ): string {
    const header = `
      <div style="background-color: #1E40AF; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0; font-family: Arial, sans-serif;">Seg360</h1>
        <p style="color: #93C5FD; margin: 5px 0 0; font-size: 14px;">Protecao contra calamidades</p>
      </div>
    `;

    const footer = `
      <div style="background-color: #F3F4F6; padding: 20px; text-align: center; font-size: 12px; color: #6B7280;">
        <p>Seg360 - Marketplace de Seguros contra Calamidades</p>
        <p><a href="#" style="color: #1E40AF;">Cancelar inscricao</a></p>
      </div>
    `;

    const templates: Record<EmailTemplate, string> = {
      'registration-confirmation': `
        ${header}
        <div style="padding: 30px; font-family: Arial, sans-serif;">
          <h2>Ola, ${data.name}!</h2>
          <p>Seu cadastro no Seg360 foi realizado com sucesso.</p>
          <p>Agora voce pode simular o risco na sua regiao e contratar protecao para seu patrimonio.</p>
          <a href="#" style="display: inline-block; background: #1E40AF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 16px;">Acessar plataforma</a>
        </div>
        ${footer}
      `,
      'broker-welcome': `
        ${header}
        <div style="padding: 30px; font-family: Arial, sans-serif;">
          <h2>Bem-vindo, ${data.name}!</h2>
          <p>Sua conta de corretor foi criada no Seg360.</p>
          <p>Seu perfil esta em analise e sera verificado em breve. Enquanto isso, explore a plataforma.</p>
          <a href="#" style="display: inline-block; background: #1E40AF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 16px;">Acessar painel do corretor</a>
        </div>
        ${footer}
      `,
      'policy-confirmation': `
        ${header}
        <div style="padding: 30px; font-family: Arial, sans-serif;">
          <h2>Parabens, ${data.name}!</h2>
          <p>Sua apolice <strong>${data.policyNumber}</strong> foi emitida com sucesso.</p>
          <p>Plano: ${data.planName} | Valor: R$ ${data.monthlyPremium}/mes</p>
          <p>Voce ja esta protegido contra calamidades naturais.</p>
          <a href="#" style="display: inline-block; background: #16A34A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 16px;">Ver minha apolice</a>
        </div>
        ${footer}
      `,
      'renewal-reminder': `
        ${header}
        <div style="padding: 30px; font-family: Arial, sans-serif;">
          <h2>Ola, ${data.name}</h2>
          <p>Sua apolice <strong>${data.policyNumber}</strong> vence em ${data.dueDate}.</p>
          <p>Mantenha sua protecao ativa renovando antes do vencimento.</p>
          <a href="#" style="display: inline-block; background: #D97706; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 16px;">Renovar apolice</a>
        </div>
        ${footer}
      `,
      'cancellation-confirmation': `
        ${header}
        <div style="padding: 30px; font-family: Arial, sans-serif;">
          <h2>Cancelamento confirmado</h2>
          <p>Ola ${data.name}, sua apolice <strong>${data.policyNumber}</strong> foi cancelada.</p>
          <p>Data efetiva do cancelamento: ${data.effectiveDate}</p>
          <p>Voce pode contratar um novo plano a qualquer momento.</p>
        </div>
        ${footer}
      `,
      'new-lead-notification': `
        ${header}
        <div style="padding: 30px; font-family: Arial, sans-serif;">
          <h2>Novo lead, ${data.brokerName}!</h2>
          <p>Um novo consumidor gerou uma cotacao na sua regiao:</p>
          <ul>
            <li>Nome: ${data.consumerName}</li>
            <li>CEP: ${data.cep}</li>
            <li>Nivel de risco: ${data.riskLevel}</li>
          </ul>
          <a href="#" style="display: inline-block; background: #1E40AF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 16px;">Ver lead</a>
        </div>
        ${footer}
      `,
    };

    return templates[template] || '';
  }
}
