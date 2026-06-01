import {MigrationInterface, QueryRunner} from "typeorm";

export class myInit1637357038643 implements MigrationInterface {
    name = 'myInit1637357038643'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "evse" ("evse" character varying NOT NULL, "station_id" character varying NOT NULL, "country" character varying NOT NULL, "city" character varying NOT NULL, "zipcode" character varying NOT NULL, "street" character varying NOT NULL, "longitude" double precision NOT NULL, "latitude" double precision NOT NULL, "charging_facility_type" character varying NOT NULL, "current_type" character varying NOT NULL, "plug_type" character varying NOT NULL, "station_name" character varying NOT NULL, CONSTRAINT "PK_59c708f1948559507caf162555f" PRIMARY KEY ("evse"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c6dbd1673cf7f397d054fd46eb" ON "evse" ("city") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_c6dbd1673cf7f397d054fd46eb"`);
        await queryRunner.query(`DROP TABLE "evse"`);
    }

}
