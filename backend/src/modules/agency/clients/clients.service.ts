import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Client } from '../../../database/entities/client.entity';
import { User } from '../../../database/entities/user.entity';
import { UserRole } from '../../../common/enums';
import { CreateClientDto, UpdateClientDto, ClientFilterDto } from './dto/client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(agencyId: string, filters: ClientFilterDto) {
    const { search, status, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = { agencyId }; // Sempre filtra pelo tenant
    if (status) where.status = status;
    if (search) where.name = Like(`%${search}%`);

    const [clients, total] = await this.clientRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { data: clients, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(agencyId: string, id: string) {
    const client = await this.clientRepository.findOne({
      where: { id, agencyId }, // agencyId garante isolamento
    });
    if (!client) throw new NotFoundException('Cliente não encontrado');
    return client;
  }

  async create(agencyId: string, createClientDto: CreateClientDto) {
    const { password, ...clientData } = createClientDto;

    // Verifica email duplicado dentro da agência
    const existing = await this.clientRepository.findOne({
      where: { email: clientData.email, agencyId },
    });
    if (existing) throw new ConflictException('Este email já está cadastrado nesta agência');

    let userId: string | null = null;

    // Cria login de acesso se senha foi informada
    if (password) {
      const existingUser = await this.userRepository.findOne({
        where: { email: clientData.email.toLowerCase() },
      });
      if (existingUser) throw new ConflictException('Este email já possui acesso à plataforma');

      const user = this.userRepository.create({
        name: clientData.name,
        email: clientData.email.toLowerCase(),
        passwordHash: password,
        role: UserRole.AGENCY_CLIENT,
        agencyId,
      });
      const savedUser = await this.userRepository.save(user);
      userId = savedUser.id;
    }

    const client = this.clientRepository.create({
      ...clientData,
      agencyId,
      userId,
    });

    return this.clientRepository.save(client);
  }

  async update(agencyId: string, id: string, updateClientDto: UpdateClientDto) {
    const client = await this.findOne(agencyId, id);
    Object.assign(client, updateClientDto);
    return this.clientRepository.save(client);
  }

  async remove(agencyId: string, id: string) {
    await this.findOne(agencyId, id);
    await this.clientRepository.softDelete(id);
    return { message: 'Cliente removido com sucesso' };
  }
}
