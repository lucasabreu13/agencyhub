import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindManyOptions } from 'typeorm';
import { Agency } from '../../../database/entities/agency.entity';
import { User } from '../../../database/entities/user.entity';
import { AgencyStatus, UserRole } from '../../../common/enums';
import { CreateAgencyDto, UpdateAgencyDto, AgencyFilterDto } from './dto/agency.dto';

@Injectable()
export class AgenciesService {
  constructor(
    @InjectRepository(Agency)
    private agencyRepository: Repository<Agency>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(filters: AgencyFilterDto) {
    const { search, status, plan, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (plan) where.plan = plan;
    if (search) where.name = Like(`%${search}%`);

    const [agencies, total] = await this.agencyRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
      withDeleted: false,
    });

    return {
      data: agencies,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const agency = await this.agencyRepository.findOne({ where: { id } });
    if (!agency) throw new NotFoundException('Agência não encontrada');
    return agency;
  }

  async findStats(id: string) {
    const agency = await this.findOne(id);

    const userCount = await this.userRepository.count({
      where: { agencyId: id, isActive: true },
    });

    return {
      agency,
      stats: {
        totalUsers: userCount,
        // Expanda com queries de clientes, campanhas, receita conforme os módulos forem criados
      },
    };
  }

  async create(createAgencyDto: CreateAgencyDto) {
    const { owner, ...agencyData } = createAgencyDto;

    // Verifica se o email do owner já existe
    const existingUser = await this.userRepository.findOne({
      where: { email: owner.email.toLowerCase() },
    });
    if (existingUser) {
      throw new ConflictException('Este email já está cadastrado');
    }

    // Cria a agência
    const agency = this.agencyRepository.create(agencyData);
    const savedAgency = await this.agencyRepository.save(agency);

    // Cria o usuário owner
    const ownerUser = this.userRepository.create({
      name: owner.name,
      email: owner.email.toLowerCase(),
      passwordHash: owner.password, // @BeforeInsert faz o hash automaticamente
      role: UserRole.AGENCY_OWNER,
      agencyId: savedAgency.id,
    });
    const savedOwner = await this.userRepository.save(ownerUser);

    // Atualiza a agência com o owner
    await this.agencyRepository.update(savedAgency.id, { ownerId: savedOwner.id });

    return { ...savedAgency, ownerId: savedOwner.id };
  }

  async update(id: string, updateAgencyDto: UpdateAgencyDto) {
    const agency = await this.findOne(id);
    Object.assign(agency, updateAgencyDto);
    return this.agencyRepository.save(agency);
  }

  async remove(id: string) {
    const agency = await this.findOne(id);
    // Soft delete — mantém registro no banco
    await this.agencyRepository.softDelete(id);
    return { message: 'Agência removida com sucesso' };
  }
}
