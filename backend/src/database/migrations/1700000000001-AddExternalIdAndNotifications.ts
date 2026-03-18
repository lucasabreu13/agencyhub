import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddExternalIdAndNotifications1700000000001 implements MigrationInterface {
  name = 'AddExternalIdAndNotifications1700000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Adicionar external_id na tabela campaigns
    await queryRunner.query(`
      ALTER TABLE campaigns 
      ADD COLUMN IF NOT EXISTS external_id VARCHAR(100)
    `);

    // Criar tabela de notificações
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL,
        agency_id UUID,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'info',
        link VARCHAR(500),
        read_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Index para busca por usuário
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id)
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, read_at) WHERE read_at IS NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS notifications`);
    await queryRunner.query(`ALTER TABLE campaigns DROP COLUMN IF EXISTS external_id`);
  }
}
