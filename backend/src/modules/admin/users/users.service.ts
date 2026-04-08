import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../../database/entities/user.entity';
import { UserRole } from '../../../common/enums';
import { CreateUserDto, UpdateUserDto, ChangePasswordDto, UserFilterDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(filters: UserFilterDto) {
    const { search, role, agencyId, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (role) where.role = role;
    if (agencyId) where.agencyId = agencyId;
    if (search) where.name = Like(`%${search}%`);

    const [users, total] = await this.userRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
      select: ['id', 'name', 'email', 'role', 'agencyId', 'isActive', 'createdAt'],
    });

    return { data: users, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'role', 'agencyId', 'isActive', 'createdAt', 'updatedAt'],
    });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const { password, ...userData } = createUserDto;

    // Valida agencyId obrigatório para não-admins
    if (userData.role !== UserRole.ADMIN && !userData.agencyId) {
      throw new BadRequestException('agencyId é obrigatório para este role');
    }

    const existing = await this.userRepository.findOne({
      where: { email: userData.email.toLowerCase() },
    });
    if (existing) throw new ConflictException('Este email já está cadastrado');

    const user = this.userRepository.create({
      ...userData,
      email: userData.email.toLowerCase(),
      passwordHash: password,
    });

    const saved = await this.userRepository.save(user);
    const { passwordHash: _, ...result } = saved as any;
    return result;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    if (updateUserDto.email) {
      const existing = await this.userRepository.findOne({
        where: { email: updateUserDto.email.toLowerCase() },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException('Este email já está em uso');
      }
      updateUserDto.email = updateUserDto.email.toLowerCase();
    }

    Object.assign(user, updateUserDto);
    const saved = await this.userRepository.save(user);
    const { passwordHash: _, ...result } = saved as any;
    return result;
  }

  async changePassword(id: string, dto: ChangePasswordDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    user.passwordHash = await bcrypt.hash(dto.password, 10);
    await this.userRepository.save(user);
    return { message: 'Senha atualizada com sucesso' };
  }

  async toggleActive(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    user.isActive = !user.isActive;
    await this.userRepository.save(user);
    return { message: `Usuário ${user.isActive ? 'ativado' : 'desativado'} com sucesso`, isActive: user.isActive };
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.userRepository.softDelete(id);
    return { message: 'Usuário removido com sucesso' };
  }
}
