import {MigrationInterface, QueryRunner} from "typeorm";

export class addReportsRelatedTable1637531838320 implements MigrationInterface {
    name = 'addReportsRelatedTable1637531838320'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "report_request" ("id" SERIAL NOT NULL, "duration_from_last_searched" character varying NOT NULL, "location" character varying NOT NULL, "arrival_time" character varying NOT NULL, "email" character varying NOT NULL, "is_sent" boolean NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_5b809608bb38d119333b69f65f9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "evse_report" ("id" SERIAL NOT NULL, "evse" character varying NOT NULL, "distance" integer NOT NULL, "predicted_status" character varying NOT NULL, "current_status" character varying, "location" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE, "reportRequestId" integer, CONSTRAINT "PK_dda22df5513337aa58c20852f0e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "evse_report" ADD CONSTRAINT "FK_c3d49155aa907e3957d19c2e662" FOREIGN KEY ("reportRequestId") REFERENCES "report_request"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "evse_report" DROP CONSTRAINT "FK_c3d49155aa907e3957d19c2e662"`);
        await queryRunner.query(`DROP TABLE "evse_report"`);
        await queryRunner.query(`DROP TABLE "report_request"`);
    }

}
