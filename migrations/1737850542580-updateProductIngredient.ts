import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProductIngredient1737850542580 implements MigrationInterface {
    name = 'UpdateProductIngredient1737850542580'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_ingredient" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "carbon_footprint_product" DROP CONSTRAINT "UQ_108d0bc44c40206a9561dd3131f"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "carbon_footprint_product" ADD CONSTRAINT "UQ_108d0bc44c40206a9561dd3131f" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "product_ingredient" DROP COLUMN "name"`);
    }

}
