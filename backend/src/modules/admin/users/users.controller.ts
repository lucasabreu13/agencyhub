import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, ChangePasswordDto, UserFilterDto } from './dto/user.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { UserRole } from '../../../common/enums';

@ApiTags('admin')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os usuários da plataforma' })
  findAll(@Query() filters: UserFilterDto) {
    return this.usersService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhe de um usuário' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar usuário' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar usuário' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch(':id/password')
  @ApiOperation({ summary: 'Alterar senha do usuário' })
  changePassword(@Param('id') id: string, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(id, dto);
  }

  @Patch(':id/toggle-active')
  @ApiOperation({ summary: 'Ativar/desativar usuário' })
  toggleActive(@Param('id') id: string) {
    return this.usersService.toggleActive(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover usuário (soft delete)' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
