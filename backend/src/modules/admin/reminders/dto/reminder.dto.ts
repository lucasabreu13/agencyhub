import { IsString, IsOptional, IsNotEmpty, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateReminderDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '2026-03-15T10:00:00Z' })
  @IsDateString()
  dueDate: string;
}

export class UpdateReminderDto extends PartialType(CreateReminderDto) {}
