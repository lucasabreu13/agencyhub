import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';
import { LoginDto } from './dto/auth.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Busca usuário pelo email
    const user = await this.userRepository.findOne({
      where: { email: email.toLowerCase(), isActive: true },
    });

    if (!user) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    // Verifica a senha
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    // Gera o token
    const token = this.generateToken(user);

    return {
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        agencyId: user.agencyId,
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
