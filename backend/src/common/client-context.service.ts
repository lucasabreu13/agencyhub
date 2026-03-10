import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../database/entities/client.entity';

@Injectable()
export class ClientContextService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}

  /**
   * Dado o userId (do JWT) e agencyId, retorna o client correspondente.
   * O cliente faz login com sua conta de usuário — o clientId é resolvido aqui.
   */
  async resolveClient(agencyId: string, userId: string): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { agencyId, userId },
    });

    if (!client) {
      throw new NotFoundException('Perfil de cliente não encontrado para este usuário');
    }

    return client;
  }
}
