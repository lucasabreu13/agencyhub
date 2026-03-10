import { IsString, IsEnum, IsOptional, IsNumber, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CampaignStatus } from '../../../../common/enums';

export class CreateCampaignDto {
  @ApiProperty()
  @IsUUID()
  clientId: string;

  @ApiProperty({ example: 'Lançamento Produto Q1' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Google Ads' })
  @IsOptional()
  @IsString()
  platform?: string;

  @ApiPropertyOptional({ enum: CampaignStatus })
  @IsOptional()
  @IsEnum(CampaignStatus)
  status?: CampaignStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  objective?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  budget?: number;

  @ApiPropertyOptional()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  kpi?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  kpiValue?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  agencyNotes?: string;
}

export class UpdateCampaignDto extends PartialType(CreateCampaignDto) {}

export class UpdateMetricsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  impressions?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  clicks?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  ctr?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  conversions?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  spent?: number;
}

export class CampaignFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  clientId?: string;

  @ApiPropertyOptional({ enum: CampaignStatus })
  @IsOptional()
  @IsEnum(CampaignStatus)
  status?: CampaignStatus;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  limit?: number = 20;
}
