import {MigrationInterface, QueryRunner} from "typeorm";

export class addExtraOcpiLocationColumn1650045890893 implements MigrationInterface {
    name = 'addExtraOcpiLocationColumn1650045890893'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ocpi_locations" ADD "frk_peer_id" character varying`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" ADD "frk_party_id" character varying`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" ADD "frk_country_code" character varying`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" ADD "frk_location_id" character varying`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" ADD "frk_name" character varying`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" ADD "frk_rank" double precision`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" ADD "frk_operator_name" character varying`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" ADD "frk_power_levels" character varying`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" ADD "frk_plugs" character varying`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" ADD "frk_location_coordinates" character varying`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" ADD "frk_location_type" character varying`);
        await queryRunner.query(`ALTER TABLE "ocpi_images" ALTER COLUMN "url" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ocpi_images" ALTER COLUMN "category" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ocpi_images" ALTER COLUMN "type" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ocpi_images" ALTER COLUMN "width" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ocpi_images" ALTER COLUMN "height" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ocpi_location_images" ALTER COLUMN "url" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ocpi_location_images" ALTER COLUMN "category" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ocpi_location_images" ALTER COLUMN "type" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ocpi_location_images" ALTER COLUMN "width" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ocpi_location_images" ALTER COLUMN "height" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" ALTER COLUMN "address" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" ALTER COLUMN "city" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" ALTER COLUMN "country" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" ALTER COLUMN "latitude" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" ALTER COLUMN "longitude" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" ALTER COLUMN "charging_when_closed" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ocpi_locations" ALTER COLUMN "charging_when_closed" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" ALTER COLUMN "longitude" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" ALTER COLUMN "latitude" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" ALTER COLUMN "country" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" ALTER COLUMN "city" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" ALTER COLUMN "address" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ocpi_location_images" ALTER COLUMN "height" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ocpi_location_images" ALTER COLUMN "width" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ocpi_location_images" ALTER COLUMN "type" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ocpi_location_images" ALTER COLUMN "category" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ocpi_location_images" ALTER COLUMN "url" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ocpi_images" ALTER COLUMN "height" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ocpi_images" ALTER COLUMN "width" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ocpi_images" ALTER COLUMN "type" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ocpi_images" ALTER COLUMN "category" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ocpi_images" ALTER COLUMN "url" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" DROP COLUMN "frk_location_type"`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" DROP COLUMN "frk_location_coordinates"`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" DROP COLUMN "frk_plugs"`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" DROP COLUMN "frk_power_levels"`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" DROP COLUMN "frk_operator_name"`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" DROP COLUMN "frk_rank"`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" DROP COLUMN "frk_name"`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" DROP COLUMN "frk_location_id"`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" DROP COLUMN "frk_country_code"`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" DROP COLUMN "frk_party_id"`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" DROP COLUMN "frk_peer_id"`);
    }

}
