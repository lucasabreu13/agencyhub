import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private repo: Repository<Notification>,
  ) {}

  async create(data: { userId: string; agencyId?: string; title: string; message: string; type?: string; link?: string }) {
    const notification = this.repo.create({
      userId: data.userId,
      agencyId: data.agencyId,
      title: data.title,
      message: data.message,
      type: data.type || 'info',
      link: data.link,
    });
    return this.repo.save(notification);
  }

  async findByUser(userId: string, unreadOnly = false) {
    const qb = this.repo.createQueryBuilder('n')
      .where('n.userId = :userId', { userId })
      .orderBy('n.createdAt', 'DESC')
      .take(50);

    if (unreadOnly) qb.andWhere('n.readAt IS NULL');

    return qb.getMany();
  }

  async markAsRead(id: string, userId: string) {
    await this.repo.update({ id, userId }, { readAt: new Date() });
    return { message: 'Notificação marcada como lida' };
  }

  async markAllAsRead(userId: string) {
    await this.repo.createQueryBuilder()
      .update()
      .set({ readAt: new Date() })
      .where('userId = :userId AND readAt IS NULL', { userId })
      .execute();
    return { message: 'Todas as notificações marcadas como lidas' };
  }

  async countUnread(userId: string) {
    return this.repo.count({ where: { userId, readAt: null } });
  }

  async delete(id: string, userId: string) {
    await this.repo.delete({ id, userId });
    return { message: 'Notificação removida' };
  }
}
