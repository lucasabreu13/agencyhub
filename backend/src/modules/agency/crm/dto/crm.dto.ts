import { IsString, IsEnum, IsOptional, IsNumber, IsEmail, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CrmStage } from '../../../../common/enums';

export class CreateContactDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  company?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  position?: string;

  @ApiPropertyOptional({ enum: CrmStage, default: CrmStage.LEAD })
  @IsOptional()
  @IsEnum(CrmStage)
  stage?: CrmStage;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  dealValue?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  lastContact?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  assignedTo?: string;
}

export class UpdateContactDto extends PartialType(CreateContactDto) {}

export class MoveStageDto {
  @ApiProperty({ enum: CrmStage })
  @IsEnum(CrmStage)
  stage: CrmStage;
}

export class CrmFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ enum: CrmStage })
  @IsOptional()
  @IsEnum(CrmStage)
  stage?: CrmStage;

  @ApiPropertyOptional()
  @IsOptional()
  assignedTo?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ default: 50 })
  @IsOptional()
  limit?: number = 50;
}
