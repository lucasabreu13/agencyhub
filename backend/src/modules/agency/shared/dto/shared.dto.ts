import { IsString, IsOptional, IsUUID, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../../../common/enums';

// ============================================================
// Chat DTOs
// ============================================================
export class SendMessageDto {
  @ApiProperty() @IsUUID() receiverId: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() clientId?: string;
  @ApiProperty() @IsString() content: string;
  @ApiPropertyOptional() @IsOptional() @IsString() attachmentUrl?: string;
}

// ============================================================
// Settings DTOs
// ============================================================
export class UpdateAgencyProfileDto {
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
}

export class UpdateMyProfileDto {
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
}

export class ChangePasswordDto {
  @ApiProperty() @IsString() currentPassword: string;
  @ApiProperty() @IsString() newPassword: string;
}

// ============================================================
// Agency Users (invite) DTO
// ============================================================
export class InviteUserDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() email: string;
  @ApiProperty({ minLength: 6 }) @IsString() password: string;
  @ApiPropertyOptional({ enum: [UserRole.AGENCY_OWNER, UserRole.AGENCY_CLIENT] })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
