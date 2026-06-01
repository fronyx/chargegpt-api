import { MigrationInterface, QueryRunner } from "typeorm"

export class deleteEvfreaksStatusLogsTable1658483331559 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_98bb4a4c8a5a7450d3d5a53cf9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0a7a3c864011cbab50df0deea8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_949b96007bab377f22bceaba15"`);
        await queryRunner.query(`DROP TABLE "evfreaks_status_logs"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "evfreaks_status_logs" ("id" SERIAL NOT NULL, "evse_id" character varying NOT NULL, "uid" character varying NOT NULL, "status" character varying NOT NULL, "location_id" character varying NOT NULL, "last_updated" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_e8007b9f6d4c07d6ae112533fbc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_949b96007bab377f22bceaba15" ON "evfreaks_status_logs" ("uid") `);
        await queryRunner.query(`CREATE INDEX "IDX_0a7a3c864011cbab50df0deea8" ON "evfreaks_status_logs" ("location_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_98bb4a4c8a5a7450d3d5a53cf9" ON "evfreaks_status_logs" ("last_updated") `);
    }
}
