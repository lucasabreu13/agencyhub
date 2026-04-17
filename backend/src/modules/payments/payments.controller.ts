import {
  Controller,
  Get,
  Post,
  Body,
  Headers,
  RawBody,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreateCheckoutDto, ChangePlanDto } from './dto/payments.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { TenantId } from '../../auth/decorators/user.decorator';
import { UserRole } from '../../common/enums';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('plans')
  @ApiOperation({ summary: 'Listar planos disponíveis com preços' })
  getPlans() {
    return this.paymentsService.getPlans();
  }

  @Post('checkout')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AGENCY_OWNER)
  @ApiOperation({ summary: 'Criar sessão de checkout no Stripe' })
  createCheckout(
    @TenantId() agencyId: string,
    @Body() dto: CreateCheckoutDto,
  ) {
    return this.paymentsService.createCheckoutSession(agencyId, dto);
  }

  @Post('change-plan')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AGENCY_OWNER)
  @ApiOperation({ summary: 'Alterar plano da assinatura mantendo dias restantes do trial' })
  changePlan(
    @TenantId() agencyId: string,
    @Body() dto: ChangePlanDto,
  ) {
    return this.paymentsService.changePlan(agencyId, dto);
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Receber eventos do Stripe (webhook)' })
  async handleWebhook(
    @RawBody() rawBody: Buffer,
    @Headers('stripe-signature') signature: string,
  ) {
    await this.paymentsService.handleWebhook(rawBody, signature);
    return { received: true };
  }
}
