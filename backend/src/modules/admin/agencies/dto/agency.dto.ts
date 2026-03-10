import { IsString, IsEmail, IsEnum, IsOptional, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { AgencyPlan, AgencyStatus, UserRole } from '../../../../common/enums';

export class CreateAgencyDto {
  @ApiProperty({ example: 'Marketing Pro Agency' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: AgencyPlan, example: AgencyPlan.PRO })
  @IsEnum(AgencyPlan)
  plan: AgencyPlan;

  @ApiProperty({ description: 'Dados do dono da agência' })
  owner: {
    name: string;
    email: string;
    password: string;
  };
}

export class UpdateAgencyDto extends PartialType(CreateAgencyDto) {
  @ApiPropertyOptional({ enum: AgencyStatus })
  @IsOptional()
  @IsEnum(AgencyStatus)
  status?: AgencyStatus;
}

export class AgencyFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: AgencyStatus })
  @IsOptional()
  @IsEnum(AgencyStatus)
  status?: AgencyStatus;

  @ApiPropertyOptional({ enum: AgencyPlan })
  @IsOptional()
  @IsEnum(AgencyPlan)
  plan?: AgencyPlan;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  limit?: number = 20;
}
