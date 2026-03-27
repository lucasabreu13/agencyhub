import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLastLoginColumn1700000000003 implements MigrationInterface {
  name = 'AddLastLoginColumn1700000000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS last_login TIMESTAMP
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE users DROP COLUMN IF EXISTS last_login`);
  }
}
