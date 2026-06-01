import { MigrationInterface, QueryRunner } from 'typeorm';

export class addProjectTypeToolkitScope1683885225643 implements MigrationInterface {
  name = 'addProjectTypeToolkitScope1683885225643';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "toolkit_scoped_evses_primary_ids" ADD "is_chargegpt" boolean DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "toolkit_scoped_evses_primary_ids" ADD "is_availability" boolean DEFAULT true`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "toolkit_scoped_evses_primary_ids" DROP COLUMN "is_availability"`);
    await queryRunner.query(`ALTER TABLE "toolkit_scoped_evses_primary_ids" DROP COLUMN "is_chargegpt"`);
  }

}
