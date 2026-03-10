import { IsString, IsEnum, IsOptional, IsNumber, IsNotEmpty, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { TransactionType } from '../../../../common/enums';

export class CreateTransactionDto {
  @ApiProperty({ enum: TransactionType })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({ example: 497.00 })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'Mensalidade plano Pro - Marketing Pro Agency' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ example: 'subscription' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ example: '2026-03-01' })
  @IsDateString()
  date: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  agencyId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {}

export class RevenueFilterDto {
  @ApiPropertyOptional({ enum: TransactionType })
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @ApiPropertyOptional()
  @IsOptional()
  agencyId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ example: '2026-01-01' })
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-12-31' })
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  limit?: number = 20;
}
