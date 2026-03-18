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
