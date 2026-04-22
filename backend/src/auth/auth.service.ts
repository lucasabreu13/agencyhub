import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';
import { Agency } from '../database/entities/agency.entity';
import { UserRole, AgencyPlan, AgencyStatus, SubscriptionStatus } from '../common/enums';
import { LoginDto, RegisterAgencyDto } from './dto/auth.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { EmailService } from '../modules/email/email.service';
import { OnboardingService } from '../modules/onboarding/onboarding.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Agency)
    private agencyRepository: Repository<Agency>,

    private jwtService: JwtService,
    private emailService: EmailService,
    private onboardingService: OnboardingService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: { email: email.toLowerCase(), isActive: true },
    });

    if (!user) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const token = this.generateToken(user);

    // Busca dados da agência para verificação de trial no frontend
    let agencyData: { subscriptionStatus: string; trialEndsAt: Date | null } | null = null;
    if (user.agencyId) {
      const agency = await this.agencyRepository.findOne({
        where: { id: user.agencyId },
      });
      if (agency) {
        agencyData = {
          subscriptionStatus: agency.subscriptionStatus,
          trialEndsAt: agency.trialEndsAt,
        };
      }
    }

    return {
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        agencyId: user.agencyId,
      },
      agency: agencyData,
    };
  }

  async register(dto: RegisterAgencyDto) {
    const { agencyName, plan, ownerName, ownerEmail, ownerPassword } = dto;

    // Verifica se email já existe
    const existing = await this.userRepository.findOne({
      where: { email: ownerEmail.toLowerCase() },
    });
    if (existing) {
      throw new ConflictException('Este email já está cadastrado na plataforma');
    }

    // Trial de 14 dias a partir do cadastro
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 14);

    // Cria a agência
    const agency = this.agencyRepository.create({
      name: agencyName,
      plan: plan as AgencyPlan,
      status: AgencyStatus.ACTIVE,
      subscriptionStatus: SubscriptionStatus.TRIAL,
      trialEndsAt,
    });
    const savedAgency = await this.agencyRepository.save(agency);

    // Cria o usuário owner
    const owner = this.userRepository.create({
      name: ownerName,
      email: ownerEmail.toLowerCase(),
      passwordHash: ownerPassword,
      role: UserRole.AGENCY_OWNER,
      agencyId: savedAgency.id,
    });
    const savedOwner = await this.userRepository.save(owner);

    // Vincula o owner à agência
    await this.agencyRepository.update(savedAgency.id, { ownerId: savedOwner.id });

    // Seed dos dados iniciais (não bloqueia o cadastro em caso de erro)
    await this.onboardingService.seedAgencyData(savedAgency.id, savedOwner.id);

    // Email de boas-vindas (não bloqueia em caso de falha SMTP)
    await this.emailService.sendAgencyWelcome(
      savedOwner.email,
      savedOwner.name,
      agencyName,
      plan,
    );

    // Retorna token para auto-login imediato
    const token = this.generateToken(savedOwner);

    return {
      access_token: token,
      user: {
        id: savedOwner.id,
        name: savedOwner.name,
        email: savedOwner.email,
        role: savedOwner.role,
        agencyId: savedAgency.id,
      },
    };
  }

  async getMe(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId, isActive: true },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      agencyId: user.agencyId,
    };
  }

  private generateToken(user: User): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      agencyId: user.agencyId,
    };

    return this.jwtService.sign(payload);
  }
}
