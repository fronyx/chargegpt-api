import { MigrationInterface, QueryRunner } from "typeorm";

export class addIsRealTimeToolkitScope1679557331381 implements MigrationInterface {
    name = 'addIsRealTimeToolkitScope1679557331381'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "toolkit_scoped_evses_primary_ids" ADD "is_real_time" boolean DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "toolkit_scoped_evses_primary_ids" DROP COLUMN "is_real_time"`);
    }

}
