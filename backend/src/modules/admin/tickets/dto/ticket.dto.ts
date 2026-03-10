import { IsString, IsEnum, IsOptional, IsUUID, IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { TicketPriority, TicketStatus, TicketType } from '../../../../common/enums';

export class CreateTicketDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: TicketType })
  @IsEnum(TicketType)
  type: TicketType;

  @ApiProperty({ enum: TicketPriority })
  @IsEnum(TicketPriority)
  priority: TicketPriority;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  clientId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  assignedTo?: string;

  @ApiPropertyOptional({ default: 24 })
  @IsOptional()
  @IsNumber()
  slaHours?: number;

  @ApiPropertyOptional()
  @IsOptional()
  linkedEntityType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  linkedEntityId?: string;
}

export class UpdateTicketDto extends PartialType(CreateTicketDto) {
  @ApiPropertyOptional({ enum: TicketStatus })
  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;
}

export class AddTicketMessageDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class TicketFilterDto {
  @ApiPropertyOptional({ enum: TicketStatus })
  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;

  @ApiPropertyOptional({ enum: TicketPriority })
  @IsOptional()
  @IsEnum(TicketPriority)
  priority?: TicketPriority;

  @ApiPropertyOptional({ enum: TicketType })
  @IsOptional()
  @IsEnum(TicketType)
  type?: TicketType;

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
