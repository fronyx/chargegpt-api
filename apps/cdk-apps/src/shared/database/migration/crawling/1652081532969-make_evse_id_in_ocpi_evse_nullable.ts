import {MigrationInterface, QueryRunner} from "typeorm";

export class makeEvseIdInOcpiEvseNullable1652081532969 implements MigrationInterface {
    name = 'makeEvseIdInOcpiEvseNullable1652081532969'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ocpi_evses" ALTER COLUMN "evse_id" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ocpi_evses" ALTER COLUMN "evse_id" SET NOT NULL`);
    }

}
