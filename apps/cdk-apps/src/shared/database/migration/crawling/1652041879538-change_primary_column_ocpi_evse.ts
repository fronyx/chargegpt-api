import {MigrationInterface, QueryRunner} from "typeorm";

export class changePrimaryColumnOcpiEvse1652041879538 implements MigrationInterface {
    name = 'changePrimaryColumnOcpiEvse1652041879538'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ocpi_status_schedule" DROP CONSTRAINT "FK_fabe71d37af5267568d050fe5c2"`);
        await queryRunner.query(`ALTER TABLE "ocpi_images" DROP CONSTRAINT "FK_3581744392aecdbd435fbfcbeb9"`);
        await queryRunner.query(`ALTER TABLE "ocpi_evse_directions" DROP CONSTRAINT "FK_5436e80b8727cc0a0916e8cd8c4"`);
        await queryRunner.query(`ALTER TABLE "ocpi_parking_restrictions" DROP CONSTRAINT "FK_75e6b41eab0bc2e5cd37b6c5767"`);
        await queryRunner.query(`ALTER TABLE "ocpi_connectors" DROP CONSTRAINT "FK_e0ed2ebb9aae628ea8cb341bde9"`);
        await queryRunner.query(`ALTER TABLE "ocpi_status_schedule" DROP COLUMN "evseEvseId"`);
        await queryRunner.query(`ALTER TABLE "ocpi_images" DROP COLUMN "evseEvseId"`);
        await queryRunner.query(`ALTER TABLE "ocpi_evse_directions" DROP COLUMN "evseEvseId"`);
        await queryRunner.query(`ALTER TABLE "ocpi_parking_restrictions" DROP COLUMN "evseEvseId"`);
        await queryRunner.query(`ALTER TABLE "ocpi_connectors" DROP COLUMN "evseEvseId"`);
        await queryRunner.query(`ALTER TABLE "ocpi_evses" ALTER COLUMN "primary_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ocpi_evses" DROP CONSTRAINT "PK_40a44d61c405eca4f459a34e6b5"`);
        await queryRunner.query(`ALTER TABLE "ocpi_evses" ADD CONSTRAINT "PK_09aec74f5c43b2a7d50c51680a9" PRIMARY KEY ("evse_id", "primary_id")`);
        await queryRunner.query(`ALTER TABLE "ocpi_evses" DROP CONSTRAINT "PK_09aec74f5c43b2a7d50c51680a9"`);
        await queryRunner.query(`ALTER TABLE "ocpi_evses" ADD CONSTRAINT "PK_4aabf8f5714f25b700905693c77" PRIMARY KEY ("primary_id")`);
        await queryRunner.query(`ALTER TABLE "ocpi_status_schedule" ADD CONSTRAINT "FK_3fdb83c6e861c06d5a438aa775b" FOREIGN KEY ("evsePrimaryId") REFERENCES "ocpi_evses"("primary_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ocpi_images" ADD CONSTRAINT "FK_5f611f2bea9274b454e31881dc9" FOREIGN KEY ("evsePrimaryId") REFERENCES "ocpi_evses"("primary_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ocpi_evse_directions" ADD CONSTRAINT "FK_a6f382675178ae8085cce8247a2" FOREIGN KEY ("evsePrimaryId") REFERENCES "ocpi_evses"("primary_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ocpi_parking_restrictions" ADD CONSTRAINT "FK_30a7c050f34c02ebf82612b82c6" FOREIGN KEY ("evsePrimaryId") REFERENCES "ocpi_evses"("primary_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ocpi_connectors" ADD CONSTRAINT "FK_5009a5c9238d926dc8767885bc2" FOREIGN KEY ("evsePrimaryId") REFERENCES "ocpi_evses"("primary_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ocpi_connectors" DROP CONSTRAINT "FK_5009a5c9238d926dc8767885bc2"`);
        await queryRunner.query(`ALTER TABLE "ocpi_parking_restrictions" DROP CONSTRAINT "FK_30a7c050f34c02ebf82612b82c6"`);
        await queryRunner.query(`ALTER TABLE "ocpi_evse_directions" DROP CONSTRAINT "FK_a6f382675178ae8085cce8247a2"`);
        await queryRunner.query(`ALTER TABLE "ocpi_images" DROP CONSTRAINT "FK_5f611f2bea9274b454e31881dc9"`);
        await queryRunner.query(`ALTER TABLE "ocpi_status_schedule" DROP CONSTRAINT "FK_3fdb83c6e861c06d5a438aa775b"`);
        await queryRunner.query(`ALTER TABLE "ocpi_evses" DROP CONSTRAINT "PK_4aabf8f5714f25b700905693c77"`);
        await queryRunner.query(`ALTER TABLE "ocpi_evses" ADD CONSTRAINT "PK_09aec74f5c43b2a7d50c51680a9" PRIMARY KEY ("evse_id", "primary_id")`);
        await queryRunner.query(`ALTER TABLE "ocpi_evses" DROP CONSTRAINT "PK_09aec74f5c43b2a7d50c51680a9"`);
        await queryRunner.query(`ALTER TABLE "ocpi_evses" ADD CONSTRAINT "PK_40a44d61c405eca4f459a34e6b5" PRIMARY KEY ("evse_id")`);
        await queryRunner.query(`ALTER TABLE "ocpi_evses" ALTER COLUMN "primary_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ocpi_connectors" ADD "evseEvseId" character varying`);
        await queryRunner.query(`ALTER TABLE "ocpi_parking_restrictions" ADD "evseEvseId" character varying`);
        await queryRunner.query(`ALTER TABLE "ocpi_evse_directions" ADD "evseEvseId" character varying`);
        await queryRunner.query(`ALTER TABLE "ocpi_images" ADD "evseEvseId" character varying`);
        await queryRunner.query(`ALTER TABLE "ocpi_status_schedule" ADD "evseEvseId" character varying`);
        await queryRunner.query(`ALTER TABLE "ocpi_connectors" ADD CONSTRAINT "FK_e0ed2ebb9aae628ea8cb341bde9" FOREIGN KEY ("evseEvseId") REFERENCES "ocpi_evses"("evse_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ocpi_parking_restrictions" ADD CONSTRAINT "FK_75e6b41eab0bc2e5cd37b6c5767" FOREIGN KEY ("evseEvseId") REFERENCES "ocpi_evses"("evse_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ocpi_evse_directions" ADD CONSTRAINT "FK_5436e80b8727cc0a0916e8cd8c4" FOREIGN KEY ("evseEvseId") REFERENCES "ocpi_evses"("evse_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ocpi_images" ADD CONSTRAINT "FK_3581744392aecdbd435fbfcbeb9" FOREIGN KEY ("evseEvseId") REFERENCES "ocpi_evses"("evse_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ocpi_status_schedule" ADD CONSTRAINT "FK_fabe71d37af5267568d050fe5c2" FOREIGN KEY ("evseEvseId") REFERENCES "ocpi_evses"("evse_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
