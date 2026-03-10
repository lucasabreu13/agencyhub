import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from '../../../database/entities/chat-message.entity';
import { ClientContextService } from '../../../common/client-context.service';
import { SendMessageDto } from '../../agency/shared/dto/shared.dto';

@Injectable()
export class ClientMessagesService {
  constructor(
    @InjectRepository(ChatMessage)
    private chatRepository: Repository<ChatMessage>,
    private clientContextService: ClientContextService,
  ) {}

  async findMessages(agencyId: string, userId: string, page = 1, limit = 50) {
    const client = await this.clientContextService.resolveClient(agencyId, userId);

    const [messages, total] = await this.chatRepository.findAndCount({
      where: { agencyId, clientId: client.id },
      order: { createdAt: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data: messages, total, page, limit };
  }

  async sendMessage(agencyId: string, userId: string, dto: SendMessageDto) {
    const client = await this.clientContextService.resolveClient(agencyId, userId);

    const message = this.chatRepository.create({
      agencyId,
      senderId: userId,
      receiverId: dto.receiverId,
      clientId: client.id,
      content: dto.content,
    });

    return this.chatRepository.save(message);
  }

  async markAsRead(agencyId: string, userId: string) {
    const client = await this.clientContextService.resolveClient(agencyId, userId);

    await this.chatRepository
      .createQueryBuilder()
      .update()
      .set({ readAt: new Date() })
      .where(
        'agencyId = :agencyId AND clientId = :clientId AND receiverId = :userId AND readAt IS NULL',
        { agencyId, clientId: client.id, userId },
      )
      .execute();

    return { message: 'Mensagens marcadas como lidas' };
  }
}
