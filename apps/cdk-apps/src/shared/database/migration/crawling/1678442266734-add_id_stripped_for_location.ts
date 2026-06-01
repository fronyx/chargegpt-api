import { MigrationInterface, QueryRunner } from "typeorm";

export class addIdStrippedForLocation1678442266734 implements MigrationInterface {
    name = 'addIdStrippedForLocation1678442266734'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ocpi_locations" ADD "id_stripped" character varying`);
        await queryRunner.query(`CREATE INDEX "IDX_idstrippedocpilocations" ON "ocpi_locations" ("id_stripped") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        

        await queryRunner.query(`ALTER TABLE "ocpi_locations" DROP COLUMN "id_stripped"`);
    }

}
