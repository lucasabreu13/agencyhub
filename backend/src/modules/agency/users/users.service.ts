import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../database/entities/user.entity';
import { UserRole } from '../../../common/enums';

@Injectable()
export class AgencyUsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(agencyId: string) {
    return this.userRepository.find({
      where: { agencyId },
      select: ['id', 'name', 'email', 'role', 'isActive', 'createdAt'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(agencyId: string, id: string) {
    const user = await this.userRepository.findOne({
      where: { id, agencyId },
      select: ['id', 'name', 'email', 'role', 'isActive', 'createdAt'],
    });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async invite(agencyId: string, dto: { name: string; email: string; password: string; role?: UserRole }) {
    const existing = await this.userRepository.findOne({ where: { email: dto.email.toLowerCase() } });
    if (existing) throw new ConflictException('Este email já está cadastrado');

    // Só pode convidar agency_owner ou agency_client dentro da agência
    const allowedRoles = [UserRole.AGENCY_OWNER, UserRole.AGENCY_CLIENT];
    const role = dto.role || UserRole.AGENCY_OWNER;
    if (!allowedRoles.includes(role)) {
      throw new ForbiddenException('Role inválido para usuário de agência');
    }

    const user = this.userRepository.create({
      name: dto.name,
      email: dto.email.toLowerCase(),
      passwordHash: dto.password,
      role,
      agencyId,
    });

    const saved = await this.userRepository.save(user);
    const { passwordHash: _, ...result } = saved as any;
    return result;
  }

  async toggleActive(agencyId: string, id: string) {
    const user = await this.userRepository.findOne({ where: { id, agencyId } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    user.isActive = !user.isActive;
    await this.userRepository.save(user);
    return { message: `Usuário ${user.isActive ? 'ativado' : 'desativado'}`, isActive: user.isActive };
  }

  async remove(agencyId: string, id: string) {
    const user = await this.userRepository.findOne({ where: { id, agencyId } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    await this.userRepository.softDelete(id);
    return { message: 'Usuário removido com sucesso' };
  }
}
