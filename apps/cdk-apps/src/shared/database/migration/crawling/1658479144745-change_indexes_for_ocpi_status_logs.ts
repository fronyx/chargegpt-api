import {MigrationInterface, QueryRunner} from "typeorm";

export class changeIndexesForOcpiStatusLogs1658479144745 implements MigrationInterface {
    name = 'changeIndexesForOcpiStatusLogs1658479144745'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_1b43c979fdffef7ad21613b138"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c659187ad308d221bbe9327590"`);
        await queryRunner.query(`ALTER TABLE "locations" DROP COLUMN "operator_hotline"`);
        await queryRunner.query(`ALTER TABLE "locations" ADD "operator_hotline" character varying`);
        await queryRunner.query(`CREATE INDEX "IDX_c659187ad308d221bbe9327590" ON "ocpi_status_logs" ("evse_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_1b43c979fdffef7ad21613b138" ON "ocpi_status_logs" ("evse_primary_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_5f5a15f577c253ecf9fea2b89d" ON "ocpi_status_logs" ("location_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_5f5a15f577c253ecf9fea2b89d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1b43c979fdffef7ad21613b138"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c659187ad308d221bbe9327590"`);
        await queryRunner.query(`ALTER TABLE "locations" DROP COLUMN "operator_hotline"`);
        await queryRunner.query(`ALTER TABLE "locations" ADD "operator_hotline" integer`);
        await queryRunner.query(`CREATE INDEX "IDX_c659187ad308d221bbe9327590" ON "ocpi_status_logs" ("evse_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_1b43c979fdffef7ad21613b138" ON "ocpi_status_logs" ("evse_primary_id") `);
    }

}
