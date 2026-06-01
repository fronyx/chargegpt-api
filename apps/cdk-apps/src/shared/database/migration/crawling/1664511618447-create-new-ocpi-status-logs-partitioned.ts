import {MigrationInterface, QueryRunner} from "typeorm";

export class createNewOcpiStatusLogsPartitioned1664511618447 implements MigrationInterface {
    name = 'createNewOcpiStatusLogsPartitioned1664511618447'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ocpi_status_logs_part" ("id" SERIAL NOT NULL, "evse_id" character varying NOT NULL, "evse_primary_id" character varying, "uid" character varying NOT NULL, "status" character varying NOT NULL, "last_updated" TIMESTAMP WITH TIME ZONE, "location_id" character varying NOT NULL, CONSTRAINT "nci_lastupdated_primaryid_status_logs_part" PRIMARY KEY ("last_updated", "evse_primary_id")) PARTITION BY RANGE (last_updated)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "ocpi_status_logs_part"`);
    }

}
