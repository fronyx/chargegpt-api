import {MigrationInterface, QueryRunner} from "typeorm";

export class removeIndexForEvsePrimaryIdFromOcpiStatusLogs1658475746959 implements MigrationInterface {
    name = 'removeIndexForEvsePrimaryIdFromOcpiStatusLogs1658475746959'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_1b43c979fdffef7ad21613b138"`);
        await queryRunner.query(`ALTER TABLE "locations" DROP COLUMN "operator_vu_number"`);
        await queryRunner.query(`ALTER TABLE "locations" ADD "operator_vu_number" double precision`);
        await queryRunner.query(`ALTER TABLE "locations" DROP COLUMN "operator_hotline"`);
        await queryRunner.query(`ALTER TABLE "locations" ADD "operator_hotline" integer`);
        await queryRunner.query(`ALTER TABLE "ocpi_images" DROP COLUMN "width"`);
        await queryRunner.query(`ALTER TABLE "ocpi_images" ADD "width" double precision`);
        await queryRunner.query(`ALTER TABLE "ocpi_images" DROP COLUMN "height"`);
        await queryRunner.query(`ALTER TABLE "ocpi_images" ADD "height" double precision`);
        await queryRunner.query(`ALTER TABLE "ocpi_location_images" DROP COLUMN "width"`);
        await queryRunner.query(`ALTER TABLE "ocpi_location_images" ADD "width" double precision`);
        await queryRunner.query(`ALTER TABLE "ocpi_location_images" DROP COLUMN "height"`);
        await queryRunner.query(`ALTER TABLE "ocpi_location_images" ADD "height" double precision`);
        await queryRunner.query(`CREATE INDEX "IDX_1b43c979fdffef7ad21613b138" ON "ocpi_status_logs" ("evse_primary_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_1b43c979fdffef7ad21613b138"`);
        await queryRunner.query(`ALTER TABLE "ocpi_location_images" DROP COLUMN "height"`);
        await queryRunner.query(`ALTER TABLE "ocpi_location_images" ADD "height" integer`);
        await queryRunner.query(`ALTER TABLE "ocpi_location_images" DROP COLUMN "width"`);
        await queryRunner.query(`ALTER TABLE "ocpi_location_images" ADD "width" integer`);
        await queryRunner.query(`ALTER TABLE "ocpi_images" DROP COLUMN "height"`);
        await queryRunner.query(`ALTER TABLE "ocpi_images" ADD "height" integer`);
        await queryRunner.query(`ALTER TABLE "ocpi_images" DROP COLUMN "width"`);
        await queryRunner.query(`ALTER TABLE "ocpi_images" ADD "width" integer`);
        await queryRunner.query(`ALTER TABLE "locations" DROP COLUMN "operator_hotline"`);
        await queryRunner.query(`ALTER TABLE "locations" ADD "operator_hotline" character varying`);
        await queryRunner.query(`ALTER TABLE "locations" DROP COLUMN "operator_vu_number"`);
        await queryRunner.query(`ALTER TABLE "locations" ADD "operator_vu_number" integer`);
        await queryRunner.query(`CREATE INDEX "IDX_1b43c979fdffef7ad21613b138" ON "ocpi_status_logs" ("evse_primary_id") `);
    }

}
