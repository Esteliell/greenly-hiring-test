import { MigrationInterface, QueryRunner } from "typeorm";

export class CarbonFootprintProduct1737724130183 implements MigrationInterface {
    name = 'CarbonFootprintProduct1737724130183'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "carbon_footprint_product" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "totalCarbonFootprint" double precision, CONSTRAINT "UQ_108d0bc44c40206a9561dd3131f" UNIQUE ("name"), CONSTRAINT "PK_9cebf9a50c3895a154d778babf1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_ingredient" ("id" SERIAL NOT NULL, "quantity" double precision NOT NULL, "unit" character varying NOT NULL, "product_id" integer NOT NULL, "carbon_emission_factor_id" integer NOT NULL, CONSTRAINT "PK_e7431906c21f94c0152d6b0db99" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "product_ingredient" ADD CONSTRAINT "FK_a7a4b2de441d2ab00df5b0d4cdd" FOREIGN KEY ("product_id") REFERENCES "carbon_footprint_product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_ingredient" ADD CONSTRAINT "FK_3c0b3655e901df4d5404196f6a3" FOREIGN KEY ("carbon_emission_factor_id") REFERENCES "carbon_emission_factors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_ingredient" DROP CONSTRAINT "FK_3c0b3655e901df4d5404196f6a3"`);
        await queryRunner.query(`ALTER TABLE "product_ingredient" DROP CONSTRAINT "FK_a7a4b2de441d2ab00df5b0d4cdd"`);
        await queryRunner.query(`DROP TABLE "product_ingredient"`);
        await queryRunner.query(`DROP TABLE "carbon_footprint_product"`);
    }

}
