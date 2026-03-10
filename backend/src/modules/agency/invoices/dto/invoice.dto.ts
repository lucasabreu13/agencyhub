import { IsString, IsEnum, IsOptional, IsUUID, IsNumber, IsDateString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { PaymentMethod } from '../../../../common/enums';

export class InvoiceItemDto {
  @ApiProperty() @IsString() description: string;
  @ApiProperty() @IsNumber() amount: number;
}

export class CreateInvoiceDto {
  @ApiProperty() @IsUUID() clientId: string;
  @ApiProperty() @IsNumber() amount: number;
  @ApiProperty({ example: '2026-04-30' }) @IsDateString() dueDate: string;
  @ApiPropertyOptional({ type: [InvoiceItemDto] }) @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => InvoiceItemDto) items?: InvoiceItemDto[];
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}

export class UpdateInvoiceDto extends PartialType(CreateInvoiceDto) {}

export class MarkAsPaidDto {
  @ApiProperty({ enum: PaymentMethod }) @IsEnum(PaymentMethod) paymentMethod: PaymentMethod;
  @ApiPropertyOptional() @IsOptional() @IsDateString() paidDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() paymentProof?: string;
}

export class InvoiceFilterDto {
  @ApiPropertyOptional() @IsOptional() clientId?: string;
  @ApiPropertyOptional() @IsOptional() status?: string;
  @ApiPropertyOptional({ default: 1 }) @IsOptional() page?: number = 1;
  @ApiPropertyOptional({ default: 20 }) @IsOptional() limit?: number = 20;
}
