import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../../../database/entities/project.entity';
import { CreateProjectDto, UpdateProjectDto, ProjectFilterDto } from './dto/project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async findAll(agencyId: string, filters: ProjectFilterDto) {
    const { clientId, status, priority, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = { agencyId };
    if (clientId) where.clientId = clientId;
    if (status) where.status = status;
    if (priority) where.priority = priority;

    const [projects, total] = await this.projectRepository.findAndCount({
      where, skip, take: limit, order: { createdAt: 'DESC' },
    });

    return { data: projects, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(agencyId: string, id: string) {
    const project = await this.projectRepository.findOne({ where: { id, agencyId } });
    if (!project) throw new NotFoundException('Projeto não encontrado');
    return project;
  }

  async create(agencyId: string, dto: CreateProjectDto) {
    const project = this.projectRepository.create({ ...dto, agencyId });
    return this.projectRepository.save(project);
  }

  async update(agencyId: string, id: string, dto: UpdateProjectDto) {
    const project = await this.findOne(agencyId, id);
    Object.assign(project, dto);
    return this.projectRepository.save(project);
  }

  async remove(agencyId: string, id: string) {
    await this.findOne(agencyId, id);
    await this.projectRepository.softDelete(id);
    return { message: 'Projeto removido com sucesso' };
  }
}
