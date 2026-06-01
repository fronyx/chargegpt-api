import {MigrationInterface, QueryRunner} from "typeorm";

export class addNewScopeEvsePrimaryIdsTable1672607548463 implements MigrationInterface {
    name = 'addNewScopeEvsePrimaryIdsTable1672607548463'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "toolkit_scoped_evses_primary_ids" ("primary_id" character varying NOT NULL, "evse_id" character varying, "evse_id_stripped" character varying, "uid" character varying, "location_id" character varying, CONSTRAINT "PK_394cba181a284602a473b474ef0" PRIMARY KEY ("primary_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "toolkit_scoped_evses_primary_ids"`);
    }

}
