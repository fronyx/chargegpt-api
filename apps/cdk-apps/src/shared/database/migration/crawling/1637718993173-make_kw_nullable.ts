import {MigrationInterface, QueryRunner} from "typeorm";

export class makeKwNullable1637718993173 implements MigrationInterface {
    name = 'makeKwNullable1637718993173'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ocpi_connectors" ALTER COLUMN "power_kw" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ocpi_connectors" ALTER COLUMN "power_kw" SET NOT NULL`);
    }

}
