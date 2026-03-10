// ============================================================
// Reports DTOs
// ============================================================
import {
  IsString, IsEnum, IsOptional, IsUUID, IsUrl, IsObject,
  IsDateString, IsNumber, ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { ReportStatus, ReportType } from '../../../../common/enums';

export class AgencySummaryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() whatWorked?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() whatDidntWork?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() nextSteps?: string;
}

export class CreateReportDto {
  @ApiProperty() @IsUUID() clientId: string;
  @ApiProperty() @IsString() title: string;
  @ApiPropertyOptional() @IsOptional() @IsString() period?: string;
  @ApiPropertyOptional({ enum: ReportType }) @IsOptional() @IsEnum(ReportType) type?: ReportType;
  @ApiPropertyOptional() @IsOptional() @IsString() pdfUrl?: string;
  @ApiPropertyOptional({ type: AgencySummaryDto }) @IsOptional() @ValidateNested() @Type(() => AgencySummaryDto) agencySummary?: AgencySummaryDto;
}

export class UpdateReportDto extends PartialType(CreateReportDto) {
  @ApiPropertyOptional({ enum: ReportStatus }) @IsOptional() @IsEnum(ReportStatus) status?: ReportStatus;
}

export class ReportFilterDto {
  @ApiPropertyOptional() @IsOptional() clientId?: string;
  @ApiPropertyOptional({ enum: ReportStatus }) @IsOptional() @IsEnum(ReportStatus) status?: ReportStatus;
  @ApiPropertyOptional({ default: 1 }) @IsOptional() page?: number = 1;
  @ApiPropertyOptional({ default: 20 }) @IsOptional() limit?: number = 20;
}
