import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

export interface SendEmailDto {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async send(dto: SendEmailDto): Promise<boolean> {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      this.logger.warn('SMTP não configurado — email não enviado');
      return false;
    }
    try {
      await this.transporter.sendMail({
        from: `"${process.env.SMTP_FROM_NAME || 'AgencyHub'}" <${process.env.SMTP_USER}>`,
        to: Array.isArray(dto.to) ? dto.to.join(',') : dto.to,
        subject: dto.subject,
        html: dto.html,
        text: dto.text,
      });
      this.logger.log(`Email enviado para: ${dto.to}`);
      return true;
    } catch (err) {
      this.logger.error(`Erro ao enviar email: ${err.message}`);
      return false;
    }
  }

  // Templates prontos
  async sendWelcome(to: string, name: string, role: string) {
    const portalUrl = process.env.FRONTEND_URL || 'https://agencyhub-ruddy.vercel.app';
    const loginPath = role === 'agency_owner' ? '/login/agency' : '/login/client';
    return this.send({
      to,
      subject: 'Bem-vindo ao AgencyHub!',
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px">
          <h2 style="color:#7c3aed">Bem-vindo ao AgencyHub, ${name}!</h2>
          <p>Sua conta foi criada com sucesso.</p>
          <p>Acesse sua conta pelo link abaixo:</p>
          <a href="${portalUrl}${loginPath}" style="display:inline-block;background:#7c3aed;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;margin:16px 0">
            Acessar Portal
          </a>
          <p style="color:#666;font-size:12px;margin-top:24px">AgencyHub — Plataforma de gestão para agências</p>
        </div>
      `,
    });
  }

  async sendReportReady(to: string, clientName: string, reportUrl: string) {
    return this.send({
      to,
      subject: 'Novo relatório disponível',
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px">
          <h2 style="color:#7c3aed">Novo relatório disponível</h2>
          <p>Olá ${clientName},</p>
          <p>Um novo relatório foi gerado e está pronto para sua revisão.</p>
          <a href="${reportUrl}" style="display:inline-block;background:#7c3aed;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;margin:16px 0">
            Ver Relatório
          </a>
          <p style="color:#666;font-size:12px;margin-top:24px">AgencyHub — Plataforma de gestão para agências</p>
        </div>
      `,
    });
  }

  async sendInvoiceReminder(to: string, clientName: string, amount: number, dueDate: string) {
    const formatted = amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    return this.send({
      to,
      subject: `Lembrete: fatura de ${formatted} vence em breve`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px">
          <h2 style="color:#7c3aed">Lembrete de fatura</h2>
          <p>Olá ${clientName},</p>
          <p>Sua fatura de <strong>${formatted}</strong> vence em <strong>${dueDate}</strong>.</p>
          <p>Acesse seu portal para mais detalhes:</p>
          <a href="${process.env.FRONTEND_URL || 'https://agencyhub-ruddy.vercel.app'}/login/client" style="display:inline-block;background:#7c3aed;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;margin:16px 0">
            Ver Fatura
          </a>
          <p style="color:#666;font-size:12px;margin-top:24px">AgencyHub — Plataforma de gestão para agências</p>
        </div>
      `,
    });
  }

  async sendAgencyWelcome(to: string, ownerName: string, agencyName: string, plan: string) {
    const portalUrl = process.env.FRONTEND_URL || 'https://agencyhub-ruddy.vercel.app';
    const planLabel = plan === 'basic' ? 'Básico' : plan === 'pro' ? 'Pro' : 'Enterprise';
    const planFeatures: Record<string, string[]> = {
      basic: ['Até 5 clientes', 'Campanhas ilimitadas', 'Relatórios mensais', 'Suporte por email'],
      pro: ['Clientes ilimitados', 'CRM completo', 'Kanban e Projetos', 'Relatórios avançados', 'Suporte prioritário'],
      enterprise: ['Tudo do Pro', 'Multi-usuário', 'API dedicada', 'SLA garantido', 'Gerente de conta'],
    };
    const features = planFeatures[plan] || planFeatures['basic'];

    return this.send({
      to,
      subject: `🚀 Bem-vindo ao AgencyHub, ${ownerName}! Sua agência está pronta`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;background:#ffffff">
          <!-- Header -->
          <div style="background:linear-gradient(135deg,#7c3aed,#4f46e5);padding:40px 32px;border-radius:12px 12px 0 0;text-align:center">
            <h1 style="color:white;margin:0;font-size:28px;font-weight:700">AgencyHub</h1>
            <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:15px">Plataforma de gestão para agências</p>
          </div>

          <!-- Body -->
          <div style="padding:40px 32px">
            <h2 style="color:#1e1b4b;margin:0 0 8px;font-size:22px">Olá, ${ownerName}! 👋</h2>
            <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 24px">
              Sua agência <strong>${agencyName}</strong> foi criada com sucesso no plano <strong>${planLabel}</strong>.
              Você já pode acessar seu painel e começar a gerenciar clientes, campanhas e muito mais.
            </p>

            <!-- Plan badge -->
            <div style="background:#f5f3ff;border:1px solid #ddd6fe;border-radius:8px;padding:20px 24px;margin-bottom:28px">
              <p style="margin:0 0 12px;font-weight:600;color:#7c3aed;font-size:14px;text-transform:uppercase;letter-spacing:0.05em">
                ✦ Plano ${planLabel} ativado
              </p>
              <ul style="margin:0;padding:0;list-style:none">
                ${features.map(f => `<li style="padding:4px 0;color:#374151;font-size:14px">✓ ${f}</li>`).join('')}
              </ul>
            </div>

            <!-- CTA -->
            <div style="text-align:center;margin:32px 0">
              <a href="${portalUrl}/login/agency"
                 style="display:inline-block;background:#7c3aed;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:16px">
                Acessar meu painel →
              </a>
            </div>

            <!-- Quick start -->
            <div style="border-top:1px solid #e5e7eb;padding-top:28px">
              <p style="color:#6b7280;font-size:14px;font-weight:600;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.05em">
                Próximos passos sugeridos
              </p>
              <ol style="margin:0;padding-left:20px;color:#374151;font-size:14px;line-height:2">
                <li>Complete o perfil da sua agência em <strong>Configurações</strong></li>
                <li>Cadastre seu primeiro cliente em <strong>Clientes</strong></li>
                <li>Crie uma campanha e acompanhe as métricas</li>
                <li>Explore o CRM para gerenciar seus leads</li>
              </ol>
            </div>
          </div>

          <!-- Footer -->
          <div style="background:#f9fafb;padding:20px 32px;border-radius:0 0 12px 12px;border-top:1px solid #e5e7eb;text-align:center">
            <p style="color:#9ca3af;font-size:12px;margin:0">
              AgencyHub — O sistema nervoso central da sua agência<br>
              Dúvidas? Responda este email que nossa equipe te ajuda.
            </p>
          </div>
        </div>
      `,
    });
  }

  async sendPasswordReset(to: string, name: string, resetUrl: string) {
    return this.send({
      to,
      subject: 'Redefinição de senha',
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px">
          <h2 style="color:#7c3aed">Redefinição de senha</h2>
          <p>Olá ${name},</p>
          <p>Recebemos uma solicitação para redefinir sua senha.</p>
          <a href="${resetUrl}" style="display:inline-block;background:#7c3aed;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;margin:16px 0">
            Redefinir Senha
          </a>
          <p style="color:#999;font-size:12px">Se você não solicitou isso, ignore este email.</p>
        </div>
      `,
    });
  }
}
