import { IsString, IsEnum, IsOptional, IsUUID, IsDateString, IsUrl, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { EventStatus, EventType } from '../../../../common/enums';

export class ParticipantDto {
  @IsUUID() id: string;
  @IsString() name: string;
  @IsString() email: string;
  @IsString() role: string;
}

export class CreateEventDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: EventType })
  @IsEnum(EventType)
  type: EventType;

  @ApiProperty({ example: '2026-03-15T10:00:00Z' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2026-03-15T11:00:00Z' })
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  clientId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  meetingLink?: string;

  @ApiPropertyOptional({ type: [ParticipantDto] })
  @IsOptional()
  @IsArray()
  participants?: ParticipantDto[];
}

export class UpdateEventDto extends PartialType(CreateEventDto) {
  @ApiPropertyOptional({ enum: EventStatus })
  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;
}

export class CalendarFilterDto {
  @ApiPropertyOptional({ description: 'Início do período (YYYY-MM-DD)' })
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Fim do período (YYYY-MM-DD)' })
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  clientId?: string;

  @ApiPropertyOptional({ enum: EventType })
  @IsOptional()
  @IsEnum(EventType)
  type?: EventType;
}
