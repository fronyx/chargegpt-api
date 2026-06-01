import {MigrationInterface, QueryRunner} from "typeorm";

export class addPrimaryIdToOcpiEvsesAndItsChildrens1652021492472 implements MigrationInterface {
    name = 'addPrimaryIdToOcpiEvsesAndItsChildrens1652021492472'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ocpi_status_schedule" ADD "evsePrimaryId" character varying`);
        await queryRunner.query(`ALTER TABLE "ocpi_images" ADD "evsePrimaryId" character varying`);
        await queryRunner.query(`ALTER TABLE "ocpi_evse_directions" ADD "evsePrimaryId" character varying`);
        await queryRunner.query(`ALTER TABLE "ocpi_parking_restrictions" ADD "evsePrimaryId" character varying`);
        await queryRunner.query(`ALTER TABLE "ocpi_evses" ADD "primary_id" character varying`);
        await queryRunner.query(`ALTER TABLE "ocpi_connectors" ADD "evsePrimaryId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ocpi_connectors" DROP COLUMN "evsePrimaryId"`);
        await queryRunner.query(`ALTER TABLE "ocpi_evses" DROP COLUMN "primary_id"`);
        await queryRunner.query(`ALTER TABLE "ocpi_parking_restrictions" DROP COLUMN "evsePrimaryId"`);
        await queryRunner.query(`ALTER TABLE "ocpi_evse_directions" DROP COLUMN "evsePrimaryId"`);
        await queryRunner.query(`ALTER TABLE "ocpi_images" DROP COLUMN "evsePrimaryId"`);
        await queryRunner.query(`ALTER TABLE "ocpi_status_schedule" DROP COLUMN "evsePrimaryId"`);
    }

}
