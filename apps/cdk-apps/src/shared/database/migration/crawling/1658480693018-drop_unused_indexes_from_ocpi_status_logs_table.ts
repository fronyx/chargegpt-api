import { MigrationInterface, QueryRunner } from "typeorm"

export class dropUnusedIndexesFromOcpiStatusLogsTable1658480693018 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_1b43c979fdffef7ad21613b138"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c659187ad308d221bbe9327590"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5f5a15f577c253ecf9fea2b89d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c66cec1a99961a967c8ecb2c2e"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_c66cec1a99961a967c8ecb2c2e" ON "ocpi_status_logs" ("last_updated") `);
        await queryRunner.query(`CREATE INDEX "IDX_5f5a15f577c253ecf9fea2b89d" ON "ocpi_status_logs" ("location_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_c659187ad308d221bbe9327590" ON "ocpi_status_logs" ("evse_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_1b43c979fdffef7ad21613b138" ON "ocpi_status_logs" ("evse_primary_id") `);
    }

}
