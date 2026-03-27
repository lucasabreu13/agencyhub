import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPasswordResetFields1700000000002 implements MigrationInterface {
  name = 'AddPasswordResetFields1700000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS reset_password_token VARCHAR(100),
      ADD COLUMN IF NOT EXISTS reset_password_expiry TIMESTAMP
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users(reset_password_token) WHERE reset_password_token IS NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE users DROP COLUMN IF EXISTS reset_password_token`);
    await queryRunner.query(`ALTER TABLE users DROP COLUMN IF EXISTS reset_password_expiry`);
  }
}
