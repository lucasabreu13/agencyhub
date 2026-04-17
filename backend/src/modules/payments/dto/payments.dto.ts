import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum StripePlanId {
  STARTER = 'starter',
  PRO = 'pro',
  SCALE = 'scale',
}

export class CreateCheckoutDto {
  @ApiProperty({
    enum: StripePlanId,
    description: 'Plano escolhido para assinar',
    example: StripePlanId.PRO,
  })
  @IsEnum(StripePlanId)
  plan: StripePlanId;
}

export class ChangePlanDto {
  @ApiProperty({
    enum: StripePlanId,
    description: 'Novo plano para migrar',
    example: StripePlanId.PRO,
  })
  @IsEnum(StripePlanId)
  plan: StripePlanId;
}

export interface PlanInfo {
  id: StripePlanId;
  name: string;
  priceInCents: number;
  priceLabel: string;
  stripePriceId: string;
  features: string[];
}
