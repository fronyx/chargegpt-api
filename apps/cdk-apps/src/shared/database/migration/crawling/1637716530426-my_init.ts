import {MigrationInterface, QueryRunner} from "typeorm";

export class myInit1637716530426 implements MigrationInterface {
    name = 'myInit1637716530426'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "locations" ("id" character varying NOT NULL, "address" character varying, "postal_code" character varying, "city" character varying NOT NULL, "country" character varying NOT NULL, "name" character varying, "operator_name" character varying, "operator_vu_number" integer, "operator_hotline" character varying, "is_public" boolean NOT NULL, "accessibility" character varying NOT NULL, "latitude" double precision NOT NULL, "longitude" double precision NOT NULL, "last_updated" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_7cc1c9e3853b94816c094825e74" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "evses" ("evse_id" character varying NOT NULL, "uid" character varying NOT NULL, "status" character varying NOT NULL, "charging_facility_type" character varying NOT NULL, "current_type" character varying NOT NULL, "is_bookable" boolean NOT NULL, "plugs" character varying NOT NULL, "payments" character varying NOT NULL, "last_updated" TIMESTAMP WITH TIME ZONE, "locationId" character varying, CONSTRAINT "PK_459ee1484acd16dcab703b4a5b1" PRIMARY KEY ("evse_id"))`);
        await queryRunner.query(`CREATE TABLE "status_logs" ("id" SERIAL NOT NULL, "evse_id" character varying NOT NULL, "uid" character varying NOT NULL, "status" character varying NOT NULL, "last_updated" TIMESTAMP WITH TIME ZONE, "location_id" character varying NOT NULL, "latitude" double precision NOT NULL, "longitude" double precision NOT NULL, "postal_code" character varying, "city" character varying NOT NULL, "country" character varying NOT NULL, CONSTRAINT "PK_0eda9a7966d0e4cc54181c8d47b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c2d8a9e1881812ab04fc95cf07" ON "status_logs" ("evse_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_68efc0abe318167812129388d8" ON "status_logs" ("last_updated") `);
        await queryRunner.query(`CREATE INDEX "IDX_522ec7c0fc3e2135f97819d229" ON "status_logs" ("city") `);
        await queryRunner.query(`CREATE INDEX "IDX_23deedae72da2479cf308979b8" ON "status_logs" ("country") `);
        await queryRunner.query(`CREATE TABLE "ocpi_locations" ("id" character varying NOT NULL, "facilities" character varying NOT NULL, "address" character varying NOT NULL, "postal_code" character varying, "city" character varying NOT NULL, "country" character varying NOT NULL, "time_zone" character varying, "name" character varying, "operator_name" character varying, "operator_hotline" character varying, "charging_when_closed" boolean NOT NULL, "latitude" double precision NOT NULL, "longitude" double precision NOT NULL, "last_updated" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_f2d0ee24d89b1ee73f8714129a9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ocpi_evses" ("evse_id" character varying NOT NULL, "uid" character varying NOT NULL, "status" character varying NOT NULL, "capabilities" character varying NOT NULL, "last_updated" TIMESTAMP WITH TIME ZONE, "locationId" character varying, CONSTRAINT "PK_40a44d61c405eca4f459a34e6b5" PRIMARY KEY ("evse_id"))`);
        await queryRunner.query(`CREATE TABLE "ocpi_connectors" ("primary_id" character varying NOT NULL, "id" character varying NOT NULL, "standard" character varying NOT NULL, "power_type" character varying NOT NULL, "format" character varying NOT NULL, "amperage" double precision NOT NULL, "voltage" double precision NOT NULL, "power_kw" double precision NOT NULL, "evseEvseId" character varying, CONSTRAINT "PK_489b6f2b76c885e80b254df9f32" PRIMARY KEY ("primary_id"))`);
        await queryRunner.query(`CREATE TABLE "ocpi_cpo" ("party_id" character varying NOT NULL, "token" character varying NOT NULL, "token_b" character varying, "versions_url" character varying NOT NULL, "credentials_url" character varying, "locations_url" character varying, "country_code" character varying NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_d7e2d1408c16826fa8f00b89e66" PRIMARY KEY ("party_id"))`);
        await queryRunner.query(`CREATE TABLE "ocpi_status_logs" ("id" SERIAL NOT NULL, "evse_id" character varying NOT NULL, "uid" character varying NOT NULL, "status" character varying NOT NULL, "last_updated" TIMESTAMP WITH TIME ZONE, "location_id" character varying NOT NULL, "latitude" double precision NOT NULL, "longitude" double precision NOT NULL, "postal_code" character varying, "city" character varying NOT NULL, "country" character varying NOT NULL, CONSTRAINT "PK_5efbecb3bb585b6ce7c605ce12b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c659187ad308d221bbe9327590" ON "ocpi_status_logs" ("evse_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_c66cec1a99961a967c8ecb2c2e" ON "ocpi_status_logs" ("last_updated") `);
        await queryRunner.query(`CREATE INDEX "IDX_9dc3ea5cfb54946d2bf358d22e" ON "ocpi_status_logs" ("city") `);
        await queryRunner.query(`CREATE INDEX "IDX_a8f7402400e974d3e6929907b6" ON "ocpi_status_logs" ("country") `);
        await queryRunner.query(`CREATE TABLE "processed_predictions" ("id" SERIAL NOT NULL, "evse" character varying NOT NULL, "timeframe" integer NOT NULL, "is_available" boolean NOT NULL, "probability" double precision NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_a4bc8287957f9c82e57e2b2477e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2c8937a6dfc62cba03c3ce7d60" ON "processed_predictions" ("evse") `);
        await queryRunner.query(`CREATE INDEX "IDX_19cfc46dcd13641a4d854d881a" ON "processed_predictions" ("updated_at") `);
        await queryRunner.query(`ALTER TABLE "ocpi_evses" ADD CONSTRAINT "FK_9cb50f135461e7291022feb6ecc" FOREIGN KEY ("locationId") REFERENCES "ocpi_locations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ocpi_connectors" ADD CONSTRAINT "FK_e0ed2ebb9aae628ea8cb341bde9" FOREIGN KEY ("evseEvseId") REFERENCES "ocpi_evses"("evse_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ocpi_connectors" DROP CONSTRAINT "FK_e0ed2ebb9aae628ea8cb341bde9"`);
        await queryRunner.query(`ALTER TABLE "ocpi_evses" DROP CONSTRAINT "FK_9cb50f135461e7291022feb6ecc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_19cfc46dcd13641a4d854d881a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2c8937a6dfc62cba03c3ce7d60"`);
        await queryRunner.query(`DROP TABLE "processed_predictions"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a8f7402400e974d3e6929907b6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9dc3ea5cfb54946d2bf358d22e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c66cec1a99961a967c8ecb2c2e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c659187ad308d221bbe9327590"`);
        await queryRunner.query(`DROP TABLE "ocpi_status_logs"`);
        await queryRunner.query(`DROP TABLE "ocpi_cpo"`);
        await queryRunner.query(`DROP TABLE "ocpi_connectors"`);
        await queryRunner.query(`DROP TABLE "ocpi_evses"`);
        await queryRunner.query(`DROP TABLE "ocpi_locations"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_23deedae72da2479cf308979b8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_522ec7c0fc3e2135f97819d229"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_68efc0abe318167812129388d8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c2d8a9e1881812ab04fc95cf07"`);
        await queryRunner.query(`DROP TABLE "status_logs"`);
        await queryRunner.query(`DROP TABLE "evses"`);
        await queryRunner.query(`DROP TABLE "locations"`);
    }

}
