import { IsString, IsOptional, IsUUID, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateDocumentDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty({ description: 'URL do arquivo (após upload para storage)' }) @IsString() fileUrl: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() clientId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fileType?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() fileSize?: number;
  @ApiPropertyOptional({ description: 'contrato | proposta | relatorio | nf | outro' }) @IsOptional() @IsString() category?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
}

export class UpdateDocumentDto extends PartialType(CreateDocumentDto) {}

export class DocumentFilterDto {
  @ApiPropertyOptional() @IsOptional() clientId?: string;
  @ApiPropertyOptional() @IsOptional() category?: string;
  @ApiPropertyOptional({ default: 1 }) @IsOptional() page?: number = 1;
  @ApiPropertyOptional({ default: 20 }) @IsOptional() limit?: number = 20;
}
