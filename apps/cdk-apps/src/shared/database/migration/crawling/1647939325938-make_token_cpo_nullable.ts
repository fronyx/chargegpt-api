import {MigrationInterface, QueryRunner} from "typeorm";

export class makeTokenCpoNullable1647939325938 implements MigrationInterface {
    name = 'makeTokenCpoNullable1647939325938'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ocpi_cpo" ADD "website" character varying`);
        await queryRunner.query(`ALTER TABLE "ocpi_cpo" ALTER COLUMN "token" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ocpi_cpo" ALTER COLUMN "versions_url" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ocpi_cpo" ALTER COLUMN "versions_url" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ocpi_cpo" ALTER COLUMN "token" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ocpi_cpo" DROP COLUMN "website"`);
    }

}
