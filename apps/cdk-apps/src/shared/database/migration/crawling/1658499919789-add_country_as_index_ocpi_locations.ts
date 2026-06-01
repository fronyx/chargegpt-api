import {MigrationInterface, QueryRunner} from "typeorm";

export class addCountryAsIndexOcpiLocations1658499919789 implements MigrationInterface {
    name = 'addCountryAsIndexOcpiLocations1658499919789'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_210b0af5b3309bfcdf0c7a81d9" ON "ocpi_locations" ("country") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_210b0af5b3309bfcdf0c7a81d9"`);
    }

}
