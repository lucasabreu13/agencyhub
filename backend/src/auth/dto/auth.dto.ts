import { IsEmail, IsString, MinLength, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AgencyPlan } from '../../database/entities/agency.entity';

export class LoginDto {
  @ApiProperty({ example: 'admin@agencyhub.com' })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @ApiProperty({ example: 'senha123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  password: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ example: 'usuario@exemplo.com' })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;
}

export class RegisterAgencyDto {
  @ApiProperty({ example: 'Pixel Agency' })
  @IsString()
  @IsNotEmpty()
  agencyName: string;

  @ApiProperty({ enum: AgencyPlan, example: AgencyPlan.PRO })
  @IsEnum(AgencyPlan)
  plan: AgencyPlan;

  @ApiProperty({ example: 'Mariana Costa' })
  @IsString()
  @IsNotEmpty()
  ownerName: string;

  @ApiProperty({ example: 'mariana@pixelagency.com.br' })
  @IsEmail({}, { message: 'Email inválido' })
  ownerEmail: string;

  @ApiProperty({ example: 'Senha@123', minLength: 8 })
  @IsString()
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  ownerPassword: string;

  @ApiPropertyOptional({ example: '(11) 99999-0000' })
  @IsOptional()
  @IsString()
  ownerPhone?: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ minLength: 6 })
  @IsString()
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  password: string;
}
