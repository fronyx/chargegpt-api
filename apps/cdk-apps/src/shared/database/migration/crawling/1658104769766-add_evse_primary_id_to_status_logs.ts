import {MigrationInterface, QueryRunner} from "typeorm";

export class addEvsePrimaryIdToStatusLogs1658104769766 implements MigrationInterface {
    name = 'addEvsePrimaryIdToStatusLogs1658104769766'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ocpi_status_logs" ADD "evse_primary_id" character varying`);
        await queryRunner.query(`CREATE INDEX "IDX_1b43c979fdffef7ad21613b138" ON "ocpi_status_logs" ("evse_primary_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_1b43c979fdffef7ad21613b138"`);
        await queryRunner.query(`ALTER TABLE "ocpi_status_logs" DROP COLUMN "evse_primary_id"`);
    }

}
