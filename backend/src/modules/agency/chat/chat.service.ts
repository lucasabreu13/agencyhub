import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from '../../../database/entities/chat-message.entity';
import { SendMessageDto } from '../shared/dto/shared.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatMessage)
    private chatRepository: Repository<ChatMessage>,
  ) {}

  // Retorna conversas únicas (última mensagem de cada par agência-cliente)
  async findConversations(agencyId: string) {
    const messages = await this.chatRepository
      .createQueryBuilder('msg')
      .where('msg.agencyId = :agencyId', { agencyId })
      .orderBy('msg.createdAt', 'DESC')
      .getMany();

    // Agrupa por clientId mantendo apenas a última mensagem de cada conversa
    const conversations = new Map<string, ChatMessage>();
    for (const msg of messages) {
      const key = msg.clientId || msg.receiverId;
      if (!conversations.has(key)) {
        conversations.set(key, msg);
      }
    }

    return Array.from(conversations.values());
  }

  async findMessages(agencyId: string, clientId: string, page = 1, limit = 50) {
    const [messages, total] = await this.chatRepository.findAndCount({
      where: { agencyId, clientId },
      order: { createdAt: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data: messages, total, page, limit };
  }

  async sendMessage(agencyId: string, dto: SendMessageDto, senderId: string) {
    const message = this.chatRepository.create({
      agencyId,
      senderId,
      receiverId: dto.receiverId,
      clientId: dto.clientId,
      content: dto.content,
    });
    return this.chatRepository.save(message);
  }

  async markAsRead(agencyId: string, clientId: string, userId: string) {
    await this.chatRepository
      .createQueryBuilder()
      .update()
      .set({ readAt: new Date() })
      .where('agencyId = :agencyId AND clientId = :clientId AND receiverId = :userId AND readAt IS NULL',
        { agencyId, clientId, userId })
      .execute();

    return { message: 'Mensagens marcadas como lidas' };
  }
}
