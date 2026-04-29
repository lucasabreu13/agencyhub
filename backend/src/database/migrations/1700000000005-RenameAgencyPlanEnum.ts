import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameAgencyPlanEnum1700000000005 implements MigrationInterface {
  name = 'RenameAgencyPlanEnum1700000000005';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TYPE "agencies_plan_enum" RENAME VALUE 'basic' TO 'starter'`);
    await queryRunner.query(`ALTER TYPE "agencies_plan_enum" RENAME VALUE 'enterprise' TO 'scale'`);
    await queryRunner.query(`ALTER TABLE "agencies" ALTER COLUMN "plan" SET DEFAULT 'starter'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TYPE "agencies_plan_enum" RENAME VALUE 'starter' TO 'basic'`);
    await queryRunner.query(`ALTER TYPE "agencies_plan_enum" RENAME VALUE 'scale' TO 'enterprise'`);
    await queryRunner.query(`ALTER TABLE "agencies" ALTER COLUMN "plan" SET DEFAULT 'basic'`);
  }
}
