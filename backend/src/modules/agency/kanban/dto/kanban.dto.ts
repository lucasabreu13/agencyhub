import { IsString, IsEnum, IsOptional, IsUUID, IsDateString, IsNumber, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { KanbanColumn, TaskPriority } from '../../../../common/enums';

export class CreateTaskDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: KanbanColumn, default: KanbanColumn.BACKLOG })
  @IsOptional()
  @IsEnum(KanbanColumn)
  column?: KanbanColumn;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  clientId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  assignedTo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({ enum: TaskPriority })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  tags?: string[];
}

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}

export class MoveTaskDto {
  @ApiProperty({ enum: KanbanColumn })
  @IsEnum(KanbanColumn)
  column: KanbanColumn;

  @ApiPropertyOptional({ description: 'Nova posição dentro da coluna' })
  @IsOptional()
  @IsNumber()
  position?: number;
}

export class KanbanFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  projectId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  clientId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  assignedTo?: string;
}
