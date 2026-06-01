import { MigrationInterface, QueryRunner } from "typeorm"

export class dropIdFromIndexOcpiStatusLogs1658497393332 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ocpi_status_logs" DROP CONSTRAINT "PK_5efbecb3bb585b6ce7c605ce12b"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ocpi_status_logs" ADD CONSTRAINT "PK_5efbecb3bb585b6ce7c605ce12b" PRIMARY KEY ("id")`);
    }

}
