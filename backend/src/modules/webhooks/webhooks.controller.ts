import { Controller, Post, Body, Headers, Param, HttpCode, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { WebhooksService } from './webhooks.service';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('meta/:agencyId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Webhook Meta Ads (Facebook/Instagram)' })
  async metaWebhook(
    @Param('agencyId') agencyId: string,
    @Body() payload: any,
    @Headers('x-hub-signature-256') signature: string,
  ) {
    this.logger.log(`Meta webhook recebido para agência ${agencyId}`);
    return this.webhooksService.handleMeta(agencyId, payload, signature);
  }

  @Post('google/:agencyId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Webhook Google Ads' })
  async googleWebhook(
    @Param('agencyId') agencyId: string,
    @Body() payload: any,
  ) {
    this.logger.log(`Google Ads webhook recebido para agência ${agencyId}`);
    return this.webhooksService.handleGoogle(agencyId, payload);
  }
}
