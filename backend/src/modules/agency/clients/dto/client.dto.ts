// ============================================================
// Agency Clients Module — DTO
// ============================================================
import { IsString, IsEmail, IsEnum, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { ClientStatus } from '../../../../common/enums';

export class CreateClientDto {
  @ApiProperty({ example: 'TechStart Solutions' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'contato@techstart.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: 'TechStart' })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiPropertyOptional({ example: '+55 11 99999-9999' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 15000 })
  @IsOptional()
  @IsNumber()
  monthlyBudget?: number;

  @ApiPropertyOptional({ example: '2026-01-15' })
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  // Se informado, cria login de acesso para o cliente
  @ApiPropertyOptional({ description: 'Senha para criar acesso do cliente à plataforma' })
  @IsOptional()
  @IsString()
  password?: string;
}

export class UpdateClientDto extends PartialType(CreateClientDto) {
  @ApiPropertyOptional({ enum: ClientStatus })
  @IsOptional()
  @IsEnum(ClientStatus)
  status?: ClientStatus;
}

export class ClientFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ enum: ClientStatus })
  @IsOptional()
  @IsEnum(ClientStatus)
  status?: ClientStatus;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  limit?: number = 20;
}
