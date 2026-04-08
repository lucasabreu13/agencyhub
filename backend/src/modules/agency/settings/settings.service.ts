import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Agency } from '../../../database/entities/agency.entity';
import { User } from '../../../database/entities/user.entity';

@Injectable()
export class AgencySettingsService {
  constructor(
    @InjectRepository(Agency)
    private agencyRepository: Repository<Agency>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getProfile(agencyId: string) {
    const agency = await this.agencyRepository.findOne({ where: { id: agencyId } });
    if (!agency) throw new NotFoundException('Agência não encontrada');
    return agency;
  }

  async updateProfile(agencyId: string, dto: { name?: string }) {
    const agency = await this.getProfile(agencyId);
    if (dto.name) agency.name = dto.name;
    return this.agencyRepository.save(agency);
  }

  async getMyProfile(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'name', 'email', 'role', 'agencyId', 'isActive', 'createdAt'],
    });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async updateMyProfile(userId: string, dto: { name?: string }) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    if (dto.name) user.name = dto.name;
    await this.userRepository.save(user);
    const { passwordHash: _, ...result } = user as any;
    return result;
  }

  async changeMyPassword(userId: string, dto: { currentPassword: string; newPassword: string }) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    const valid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Senha atual incorreta');
    user.passwordHash = await bcrypt.hash(dto.newPassword, 10);
    await this.userRepository.save(user);
    return { message: 'Senha alterada com sucesso' };
  }
}
