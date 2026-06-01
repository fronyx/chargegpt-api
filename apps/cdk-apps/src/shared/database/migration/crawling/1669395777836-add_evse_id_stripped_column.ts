import {MigrationInterface, QueryRunner} from "typeorm";

export class addEvseIdStrippedColumn1669395777836 implements MigrationInterface {
    name = 'addEvseIdStrippedColumn1669395777836'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ocpi_evses" ADD "evse_id_stripped" character varying`);
        await queryRunner.query(`CREATE INDEX "IDX_evse_id_stripped" ON "ocpi_evses" ("evse_id_stripped", "locationId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_evse_id_stripped"`);
        await queryRunner.query(`ALTER TABLE "ocpi_evses" DROP COLUMN "evse_id_stripped"`);
    }

}
