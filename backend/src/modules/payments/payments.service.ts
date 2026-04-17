import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agency } from '../../database/entities/agency.entity';
import { SubscriptionStatus } from '../../common/enums';
import { CreateCheckoutDto, ChangePlanDto, StripePlanId, PlanInfo } from './dto/payments.dto';

// Stripe 22.x usa export funcional — compatível com CJS do NestJS
// eslint-disable-next-line @typescript-eslint/no-require-imports
const stripeLib = require('stripe');

const PLANS: Record<StripePlanId, PlanInfo> = {
  [StripePlanId.STARTER]: {
    id: StripePlanId.STARTER,
    name: 'Starter',
    priceInCents: 19700,
    priceLabel: 'R$ 197/mês',
    stripePriceId: process.env.STRIPE_PRICE_STARTER || 'price_starter',
    features: ['Até 5 clientes', 'Campanhas ilimitadas', 'Relatórios básicos', 'Suporte por email'],
  },
  [StripePlanId.PRO]: {
    id: StripePlanId.PRO,
    name: 'Pro',
    priceInCents: 39700,
    priceLabel: 'R$ 397/mês',
    stripePriceId: process.env.STRIPE_PRICE_PRO || 'price_pro',
    features: ['Até 20 clientes', 'Campanhas ilimitadas', 'Relatórios avançados', 'CRM completo', 'Suporte prioritário'],
  },
  [StripePlanId.SCALE]: {
    id: StripePlanId.SCALE,
    name: 'Scale',
    priceInCents: 79700,
    priceLabel: 'R$ 797/mês',
    stripePriceId: process.env.STRIPE_PRICE_SCALE || 'price_scale',
    features: ['Clientes ilimitados', 'Multi-usuário', 'API de integração', 'Relatórios white-label', 'Gerente de conta dedicado'],
  },
};

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly stripe: any;

  constructor(
    @InjectRepository(Agency)
    private agencyRepository: Repository<Agency>,
  ) {
    this.stripe = stripeLib(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
      apiVersion: '2026-03-25.dahlia',
    });
  }

  getPlans(): PlanInfo[] {
    return Object.values(PLANS);
  }

  async createCheckoutSession(agencyId: string, dto: CreateCheckoutDto): Promise<{ url: string }> {
    const agency = await this.agencyRepository.findOne({ where: { id: agencyId } });
    if (!agency) throw new NotFoundException('Agência não encontrada');

    const plan = PLANS[dto.plan];
    if (!plan) throw new BadRequestException('Plano inválido');

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const successUrl = `${frontendUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${frontendUrl}/checkout/cancel`;

    // Cria ou reutiliza customer no Stripe
    let customerId = agency.stripeCustomerId;
    if (!customerId) {
      const customer = await this.stripe.customers.create({
        metadata: { agencyId: agency.id },
      });
      customerId = customer.id;
      await this.agencyRepository.update(agency.id, { stripeCustomerId: customerId });
    }

    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      payment_method_collection: 'always',
      line_items: [{ price: plan.stripePriceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { agencyId: agency.id, plan: dto.plan },
      subscription_data: {
        trial_period_days: 14,
        metadata: { agencyId: agency.id, plan: dto.plan },
      },
    });

    if (!session.url) throw new BadRequestException('Erro ao gerar URL de checkout');

    return { url: session.url };
  }

  async changePlan(agencyId: string, dto: ChangePlanDto): Promise<{ subscriptionId: string }> {
    const agency = await this.agencyRepository.findOne({ where: { id: agencyId } });
    if (!agency) throw new NotFoundException('Agência não encontrada');
    if (!agency.stripeSubscriptionId) throw new BadRequestException('Nenhuma assinatura ativa encontrada');

    const plan = PLANS[dto.plan];
    if (!plan) throw new BadRequestException('Plano inválido');

    const subscription = await this.stripe.subscriptions.retrieve(agency.stripeSubscriptionId);
    const currentItemId = subscription.items.data[0]?.id;
    if (!currentItemId) throw new BadRequestException('Item da assinatura não encontrado');

    const updated = await this.stripe.subscriptions.update(agency.stripeSubscriptionId, {
      items: [{ id: currentItemId, price: plan.stripePriceId }],
      proration_behavior: 'none',
      metadata: { agencyId: agency.id, plan: dto.plan },
    });

    this.logger.log(`Plano alterado para agência ${agencyId}: ${dto.plan}`);
    return { subscriptionId: updated.id };
  }

  async handleWebhook(rawBody: Buffer, signature: string): Promise<void> {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      this.logger.warn('STRIPE_WEBHOOK_SECRET não configurado — ignorando webhook');
      return;
    }

    let event: any;
    try {
      event = this.stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err) {
      throw new BadRequestException(`Assinatura do webhook inválida: ${err.message}`);
    }

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdate(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await this.handleSubscriptionCancelled(event.data.object);
        break;
      case 'invoice.payment_failed':
        await this.handlePaymentFailed(event.data.object);
        break;
      default:
        this.logger.debug(`Evento Stripe ignorado: ${event.type}`);
    }
  }

  private async handleSubscriptionUpdate(subscription: any): Promise<void> {
    const agencyId = subscription.metadata?.agencyId;
    if (!agencyId) return;

    const isActive = subscription.status === 'active' || subscription.status === 'trialing';
    await this.agencyRepository.update(agencyId, {
      stripeSubscriptionId: subscription.id,
      subscriptionStatus: isActive ? SubscriptionStatus.ACTIVE : SubscriptionStatus.EXPIRED,
    });

    this.logger.log(`Assinatura atualizada para agência ${agencyId}: ${subscription.status}`);
  }

  private async handleSubscriptionCancelled(subscription: any): Promise<void> {
    const agencyId = subscription.metadata?.agencyId;
    if (!agencyId) return;

    await this.agencyRepository.update(agencyId, {
      subscriptionStatus: SubscriptionStatus.CANCELLED,
    });

    this.logger.log(`Assinatura cancelada para agência ${agencyId}`);
  }

  private async handlePaymentFailed(invoice: any): Promise<void> {
    const customerId = typeof invoice.customer === 'string'
      ? invoice.customer
      : invoice.customer?.id;
    if (!customerId) return;

    await this.agencyRepository.update(
      { stripeCustomerId: customerId },
      { subscriptionStatus: SubscriptionStatus.EXPIRED },
    );

    this.logger.warn(`Pagamento falhou para customer ${customerId}`);
  }
}
