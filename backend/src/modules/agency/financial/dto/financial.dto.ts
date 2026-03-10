import { IsString, IsEnum, IsOptional, IsUUID, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { TransactionType } from '../../../../common/enums';

export class CreateTransactionDto {
  @ApiProperty({ enum: TransactionType }) @IsEnum(TransactionType) type: TransactionType;
  @ApiProperty() @IsNumber() amount: number;
  @ApiProperty() @IsString() description: string;
  @ApiProperty({ example: '2026-03-01' }) @IsDateString() date: string;
  @ApiPropertyOptional() @IsOptional() @IsString() category?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() clientId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {}

export class TransactionFilterDto {
  @ApiPropertyOptional({ enum: TransactionType }) @IsOptional() @IsEnum(TransactionType) type?: TransactionType;
  @ApiPropertyOptional() @IsOptional() clientId?: string;
  @ApiPropertyOptional({ default: 1 }) @IsOptional() page?: number = 1;
  @ApiPropertyOptional({ default: 20 }) @IsOptional() limit?: number = 20;
}
