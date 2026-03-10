import { IsString, IsEmail, IsEnum, IsOptional, IsUUID, MinLength, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { UserRole } from '../../../../common/enums';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiPropertyOptional({ description: 'Obrigatório se role != admin' })
  @IsOptional()
  @IsUUID()
  agencyId?: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  @MinLength(6)
  password: string;
}

export class UserFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ enum: UserRole })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional()
  @IsOptional()
  agencyId?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  limit?: number = 20;
}
