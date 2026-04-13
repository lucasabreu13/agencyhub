import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAgencySubscriptionFields1700000000004 implements MigrationInterface {
  name = 'AddAgencySubscriptionFields1700000000004';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar o tipo ENUM para subscription_status
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE subscription_status_enum AS ENUM ('trial', 'active', 'expired', 'cancelled');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `);

    await queryRunner.query(`
      ALTER TABLE agencies
        ADD COLUMN IF NOT EXISTS subscription_status subscription_status_enum NOT NULL DEFAULT 'trial',
        ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMP,
        ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255),
        ADD COLUMN IF NOT EXISTS stripe_subscription_id VARCHAR(255)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE agencies
        DROP COLUMN IF EXISTS subscription_status,
        DROP COLUMN IF EXISTS trial_ends_at,
        DROP COLUMN IF EXISTS stripe_customer_id,
        DROP COLUMN IF EXISTS stripe_subscription_id
    `);

    await queryRunner.query(`DROP TYPE IF EXISTS subscription_status_enum`);
  }
}
