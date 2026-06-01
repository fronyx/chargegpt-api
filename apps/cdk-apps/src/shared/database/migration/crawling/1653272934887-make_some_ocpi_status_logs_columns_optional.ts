import {MigrationInterface, QueryRunner} from "typeorm";

export class makeSomeOcpiStatusLogsColumnsOptional1653272934887 implements MigrationInterface {
    name = 'makeSomeOcpiStatusLogsColumnsOptional1653272934887'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_9dc3ea5cfb54946d2bf358d22e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a8f7402400e974d3e6929907b6"`);
        await queryRunner.query(`ALTER TABLE "ocpi_status_logs" ALTER COLUMN "latitude" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ocpi_status_logs" ALTER COLUMN "longitude" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ocpi_status_logs" ALTER COLUMN "city" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ocpi_status_logs" ALTER COLUMN "country" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ocpi_status_logs" ALTER COLUMN "country" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ocpi_status_logs" ALTER COLUMN "city" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ocpi_status_logs" ALTER COLUMN "longitude" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ocpi_status_logs" ALTER COLUMN "latitude" SET NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_a8f7402400e974d3e6929907b6" ON "ocpi_status_logs" ("country") `);
        await queryRunner.query(`CREATE INDEX "IDX_9dc3ea5cfb54946d2bf358d22e" ON "ocpi_status_logs" ("city") `);
    }

}
