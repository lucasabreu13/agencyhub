import { IsString, IsEnum, IsOptional, IsNumber, IsNotEmpty, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { GoalStatus } from '../../../../common/enums';

export class CreateGoalDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 50000 })
  @IsNumber()
  targetValue: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  currentValue?: number;

  @ApiPropertyOptional({ example: 'R$' })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional({ example: '2026-12-31' })
  @IsOptional()
  @IsDateString()
  deadline?: string;
}

export class UpdateGoalDto extends PartialType(CreateGoalDto) {
  @ApiPropertyOptional({ enum: GoalStatus })
  @IsOptional()
  @IsEnum(GoalStatus)
  status?: GoalStatus;
}

export class UpdateProgressDto {
  @ApiProperty({ description: 'Valor atual do progresso' })
  @IsNumber()
  currentValue: number;
}

export class GoalFilterDto {
  @ApiPropertyOptional({ enum: GoalStatus })
  @IsOptional()
  @IsEnum(GoalStatus)
  status?: GoalStatus;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  limit?: number = 20;
}
