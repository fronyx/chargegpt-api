import {MigrationInterface, QueryRunner} from "typeorm";

export class removeUnusedColumnInStatusLogTable1659106908351 implements MigrationInterface {
    name = 'removeUnusedColumnInStatusLogTable1659106908351'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ocpi_status_logs" DROP COLUMN "latitude"`);
        await queryRunner.query(`ALTER TABLE "ocpi_status_logs" DROP COLUMN "longitude"`);
        await queryRunner.query(`ALTER TABLE "ocpi_status_logs" DROP COLUMN "postal_code"`);
        await queryRunner.query(`ALTER TABLE "ocpi_status_logs" DROP COLUMN "city"`);
        await queryRunner.query(`ALTER TABLE "ocpi_status_logs" DROP COLUMN "country"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ocpi_status_logs" ADD "country" character varying`);
        await queryRunner.query(`ALTER TABLE "ocpi_status_logs" ADD "city" character varying`);
        await queryRunner.query(`ALTER TABLE "ocpi_status_logs" ADD "postal_code" character varying`);
        await queryRunner.query(`ALTER TABLE "ocpi_status_logs" ADD "longitude" double precision`);
        await queryRunner.query(`ALTER TABLE "ocpi_status_logs" ADD "latitude" double precision`);
    }

}
