import {MigrationInterface, QueryRunner} from "typeorm";

export class addSendingActiveToCpo1648999701868 implements MigrationInterface {
    name = 'addSendingActiveToCpo1648999701868'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ocpi_cpo" ADD "is_sending_active" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ocpi_cpo" DROP COLUMN "is_sending_active"`);
    }

}
