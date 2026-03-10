import { IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CampaignStatus, InvoiceStatus, ReportStatus } from '../../../common/enums';

export class ClientCampaignFilterDto {
  @ApiPropertyOptional({ enum: CampaignStatus }) @IsOptional() @IsEnum(CampaignStatus) status?: CampaignStatus;
  @ApiPropertyOptional({ default: 1 }) @IsOptional() page?: number = 1;
  @ApiPropertyOptional({ default: 20 }) @IsOptional() limit?: number = 20;
}

export class ClientReportFilterDto {
  @ApiPropertyOptional({ enum: ReportStatus }) @IsOptional() @IsEnum(ReportStatus) status?: ReportStatus;
  @ApiPropertyOptional({ default: 1 }) @IsOptional() page?: number = 1;
  @ApiPropertyOptional({ default: 20 }) @IsOptional() limit?: number = 20;
}

export class ClientInvoiceFilterDto {
  @ApiPropertyOptional({ enum: InvoiceStatus }) @IsOptional() @IsEnum(InvoiceStatus) status?: InvoiceStatus;
  @ApiPropertyOptional({ default: 1 }) @IsOptional() page?: number = 1;
  @ApiPropertyOptional({ default: 20 }) @IsOptional() limit?: number = 20;
}

export class ClientDocumentFilterDto {
  @ApiPropertyOptional() @IsOptional() category?: string;
  @ApiPropertyOptional({ default: 1 }) @IsOptional() page?: number = 1;
  @ApiPropertyOptional({ default: 20 }) @IsOptional() limit?: number = 20;
}
