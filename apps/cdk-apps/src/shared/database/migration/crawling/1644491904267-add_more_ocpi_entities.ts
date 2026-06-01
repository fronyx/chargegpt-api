import {MigrationInterface, QueryRunner} from "typeorm";

export class addMoreOcpiEntities1644491904267 implements MigrationInterface {
    name = 'addMoreOcpiEntities1644491904267'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ocpi_directions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "language" character varying, "text" character varying, "locationId" character varying, CONSTRAINT "PK_51dec98a2fa112e16226adde421" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ocpi_status_schedule" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "period_begin" TIMESTAMP WITH TIME ZONE NOT NULL, "period_end" TIMESTAMP WITH TIME ZONE, "status" character varying NOT NULL, "evseEvseId" character varying, CONSTRAINT "PK_be51a43c4c808aaada03bdb8dfd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ocpi_images" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "url" character varying NOT NULL, "thumbnail" character varying, "category" character varying NOT NULL, "type" character varying NOT NULL, "width" integer NOT NULL, "height" integer NOT NULL, "evseEvseId" character varying, CONSTRAINT "PK_1204d701fcf460221a779a271f6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ocpi_related_location_names" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "language" character varying, "text" character varying, "relatedLocationId" uuid, CONSTRAINT "PK_dd882ae4924332a58e6d00042cf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ocpi_related_locations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "latitude" double precision NOT NULL, "longitude" double precision NOT NULL, "locationId" character varying, CONSTRAINT "PK_c80dbd4bc927c51ccdc0830ee0d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ocpi_location_regular_hours" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "weekday" integer, "period_begin" character varying, "period_end" character varying, "locationId" character varying, CONSTRAINT "PK_53ff0b0b4de6593b525f95c1e9c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ocpi_exceptional_closings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "period_begin" character varying, "period_end" character varying, "locationId" character varying, CONSTRAINT "PK_ec5b3429ac320029f9ba77cd3a9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ocpi_exceptional_openings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "period_begin" character varying, "period_end" character varying, "locationId" character varying, CONSTRAINT "PK_e199db401ce2a1c94350bd6a079" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ocpi_location_images" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "url" character varying NOT NULL, "thumbnail" character varying, "category" character varying NOT NULL, "type" character varying NOT NULL, "width" integer NOT NULL, "height" integer NOT NULL, "locationId" character varying, CONSTRAINT "PK_a5bdadf886c7d45e73fed9d7688" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ocpi_environmental_impacts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" double precision, "source" character varying, "locationId" character varying, CONSTRAINT "PK_2fb72b0db484d447b8ee8799592" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ocpi_energy_sources" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "percentage" double precision, "source" character varying, "locationId" character varying, CONSTRAINT "PK_ad0337c88fcfe45caaceb41b38e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ocpi_evse_directions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "language" character varying, "text" character varying, "evseEvseId" character varying, CONSTRAINT "PK_a64e721803313b192b8b60b20c0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ocpi_parking_restrictions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" character varying NOT NULL, "evseEvseId" character varying, CONSTRAINT "PK_a72fffc0399252d3d3fd8c653d0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ocpi_evse_coordinates" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "latitude" double precision, "longitude" double precision, CONSTRAINT "PK_9fddd412432194fc7cf21b493b4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" ADD "type" character varying`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" ADD "operator_website" character varying`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" ADD "operator_logo" character varying`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" ADD "suboperator_name" character varying`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" ADD "suboperator_hotline" character varying`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" ADD "suboperator_website" character varying`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" ADD "suboperator_logo" character varying`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" ADD "owner_name" character varying`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" ADD "owner_hotline" character varying`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" ADD "owner_website" character varying`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" ADD "owner_logo" character varying`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" ADD "twentyfourseven" boolean`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" ADD "is_green_energy" boolean`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" ADD "supplier_name" character varying`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" ADD "energy_product_name" character varying`);
        await queryRunner.query(`ALTER TABLE "ocpi_evses" ADD "floor_level" character varying`);
        await queryRunner.query(`ALTER TABLE "ocpi_evses" ADD "physical_reference" character varying`);
        await queryRunner.query(`ALTER TABLE "ocpi_evses" ADD "coordinatesId" uuid`);
        await queryRunner.query(`ALTER TABLE "ocpi_evses" ADD CONSTRAINT "UQ_f94c81dc455c8565ba381b17248" UNIQUE ("coordinatesId")`);
        await queryRunner.query(`ALTER TABLE "ocpi_connectors" ADD "tariff_id" character varying`);
        await queryRunner.query(`ALTER TABLE "ocpi_connectors" ADD "terms_and_conditions" character varying`);
        await queryRunner.query(`ALTER TABLE "ocpi_connectors" ADD "last_updated" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" ALTER COLUMN "facilities" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ocpi_evses" ALTER COLUMN "capabilities" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ocpi_directions" ADD CONSTRAINT "FK_5a95b44e7dd40ca2c7b7456a752" FOREIGN KEY ("locationId") REFERENCES "ocpi_locations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ocpi_status_schedule" ADD CONSTRAINT "FK_fabe71d37af5267568d050fe5c2" FOREIGN KEY ("evseEvseId") REFERENCES "ocpi_evses"("evse_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ocpi_images" ADD CONSTRAINT "FK_3581744392aecdbd435fbfcbeb9" FOREIGN KEY ("evseEvseId") REFERENCES "ocpi_evses"("evse_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ocpi_related_location_names" ADD CONSTRAINT "FK_96ab6bd5eefa90ec3f0568339ac" FOREIGN KEY ("relatedLocationId") REFERENCES "ocpi_related_locations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ocpi_related_locations" ADD CONSTRAINT "FK_90c543de4deab08baae49167b62" FOREIGN KEY ("locationId") REFERENCES "ocpi_locations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ocpi_location_regular_hours" ADD CONSTRAINT "FK_cac2e020feb2e938144cfb9d6a8" FOREIGN KEY ("locationId") REFERENCES "ocpi_locations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ocpi_exceptional_closings" ADD CONSTRAINT "FK_edea9a968da0058a20ad7f90dc3" FOREIGN KEY ("locationId") REFERENCES "ocpi_locations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ocpi_exceptional_openings" ADD CONSTRAINT "FK_5c4e8d4dcce0f9bce8fb271cb96" FOREIGN KEY ("locationId") REFERENCES "ocpi_locations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ocpi_location_images" ADD CONSTRAINT "FK_2fd889e3f213633f002097c7278" FOREIGN KEY ("locationId") REFERENCES "ocpi_locations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ocpi_environmental_impacts" ADD CONSTRAINT "FK_33fde3bb42c711d649b037d9574" FOREIGN KEY ("locationId") REFERENCES "ocpi_locations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ocpi_energy_sources" ADD CONSTRAINT "FK_1e85dcb67ab900356acc37fd73e" FOREIGN KEY ("locationId") REFERENCES "ocpi_locations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ocpi_evse_directions" ADD CONSTRAINT "FK_5436e80b8727cc0a0916e8cd8c4" FOREIGN KEY ("evseEvseId") REFERENCES "ocpi_evses"("evse_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ocpi_parking_restrictions" ADD CONSTRAINT "FK_75e6b41eab0bc2e5cd37b6c5767" FOREIGN KEY ("evseEvseId") REFERENCES "ocpi_evses"("evse_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ocpi_evses" ADD CONSTRAINT "FK_f94c81dc455c8565ba381b17248" FOREIGN KEY ("coordinatesId") REFERENCES "ocpi_evse_coordinates"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ocpi_evses" DROP CONSTRAINT "FK_f94c81dc455c8565ba381b17248"`);
        await queryRunner.query(`ALTER TABLE "ocpi_parking_restrictions" DROP CONSTRAINT "FK_75e6b41eab0bc2e5cd37b6c5767"`);
        await queryRunner.query(`ALTER TABLE "ocpi_evse_directions" DROP CONSTRAINT "FK_5436e80b8727cc0a0916e8cd8c4"`);
        await queryRunner.query(`ALTER TABLE "ocpi_energy_sources" DROP CONSTRAINT "FK_1e85dcb67ab900356acc37fd73e"`);
        await queryRunner.query(`ALTER TABLE "ocpi_environmental_impacts" DROP CONSTRAINT "FK_33fde3bb42c711d649b037d9574"`);
        await queryRunner.query(`ALTER TABLE "ocpi_location_images" DROP CONSTRAINT "FK_2fd889e3f213633f002097c7278"`);
        await queryRunner.query(`ALTER TABLE "ocpi_exceptional_openings" DROP CONSTRAINT "FK_5c4e8d4dcce0f9bce8fb271cb96"`);
        await queryRunner.query(`ALTER TABLE "ocpi_exceptional_closings" DROP CONSTRAINT "FK_edea9a968da0058a20ad7f90dc3"`);
        await queryRunner.query(`ALTER TABLE "ocpi_location_regular_hours" DROP CONSTRAINT "FK_cac2e020feb2e938144cfb9d6a8"`);
        await queryRunner.query(`ALTER TABLE "ocpi_related_locations" DROP CONSTRAINT "FK_90c543de4deab08baae49167b62"`);
        await queryRunner.query(`ALTER TABLE "ocpi_related_location_names" DROP CONSTRAINT "FK_96ab6bd5eefa90ec3f0568339ac"`);
        await queryRunner.query(`ALTER TABLE "ocpi_images" DROP CONSTRAINT "FK_3581744392aecdbd435fbfcbeb9"`);
        await queryRunner.query(`ALTER TABLE "ocpi_status_schedule" DROP CONSTRAINT "FK_fabe71d37af5267568d050fe5c2"`);
        await queryRunner.query(`ALTER TABLE "ocpi_directions" DROP CONSTRAINT "FK_5a95b44e7dd40ca2c7b7456a752"`);
        await queryRunner.query(`ALTER TABLE "ocpi_evses" ALTER COLUMN "capabilities" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" ALTER COLUMN "facilities" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ocpi_connectors" DROP COLUMN "last_updated"`);
        await queryRunner.query(`ALTER TABLE "ocpi_connectors" DROP COLUMN "terms_and_conditions"`);
        await queryRunner.query(`ALTER TABLE "ocpi_connectors" DROP COLUMN "tariff_id"`);
        await queryRunner.query(`ALTER TABLE "ocpi_evses" DROP CONSTRAINT "UQ_f94c81dc455c8565ba381b17248"`);
        await queryRunner.query(`ALTER TABLE "ocpi_evses" DROP COLUMN "coordinatesId"`);
        await queryRunner.query(`ALTER TABLE "ocpi_evses" DROP COLUMN "physical_reference"`);
        await queryRunner.query(`ALTER TABLE "ocpi_evses" DROP COLUMN "floor_level"`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" DROP COLUMN "energy_product_name"`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" DROP COLUMN "supplier_name"`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" DROP COLUMN "is_green_energy"`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" DROP COLUMN "twentyfourseven"`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" DROP COLUMN "owner_logo"`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" DROP COLUMN "owner_website"`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" DROP COLUMN "owner_hotline"`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" DROP COLUMN "owner_name"`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" DROP COLUMN "suboperator_logo"`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" DROP COLUMN "suboperator_website"`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" DROP COLUMN "suboperator_hotline"`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" DROP COLUMN "suboperator_name"`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" DROP COLUMN "operator_logo"`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" DROP COLUMN "operator_website"`);
        await queryRunner.query(`ALTER TABLE "ocpi_locations" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TABLE "ocpi_evse_coordinates"`);
        await queryRunner.query(`DROP TABLE "ocpi_parking_restrictions"`);
        await queryRunner.query(`DROP TABLE "ocpi_evse_directions"`);
        await queryRunner.query(`DROP TABLE "ocpi_energy_sources"`);
        await queryRunner.query(`DROP TABLE "ocpi_environmental_impacts"`);
        await queryRunner.query(`DROP TABLE "ocpi_location_images"`);
        await queryRunner.query(`DROP TABLE "ocpi_exceptional_openings"`);
        await queryRunner.query(`DROP TABLE "ocpi_exceptional_closings"`);
        await queryRunner.query(`DROP TABLE "ocpi_location_regular_hours"`);
        await queryRunner.query(`DROP TABLE "ocpi_related_locations"`);
        await queryRunner.query(`DROP TABLE "ocpi_related_location_names"`);
        await queryRunner.query(`DROP TABLE "ocpi_images"`);
        await queryRunner.query(`DROP TABLE "ocpi_status_schedule"`);
        await queryRunner.query(`DROP TABLE "ocpi_directions"`);
    }

}
