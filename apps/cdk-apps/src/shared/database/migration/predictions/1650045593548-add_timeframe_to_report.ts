import {MigrationInterface, QueryRunner} from "typeorm";

export class addTimeframeToReport1650045593548 implements MigrationInterface {
    name = 'addTimeframeToReport1650045593548'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "processed_predictions" ("id" SERIAL NOT NULL, "evse" character varying NOT NULL, "timeframe" integer NOT NULL, "is_available" boolean NOT NULL, "probability" double precision NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_a4bc8287957f9c82e57e2b2477e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "report_request" ADD "timeframe" integer`);
        await queryRunner.query(`ALTER TABLE "report_request" ADD "deliver_at" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "report_request" DROP COLUMN "deliver_at"`);
        await queryRunner.query(`ALTER TABLE "report_request" DROP COLUMN "timeframe"`);
        await queryRunner.query(`DROP TABLE "processed_predictions"`);
    }

}
