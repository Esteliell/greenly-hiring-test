import { MigrationInterface, QueryRunner } from "typeorm";

export class CascadeProductIngredrient1737939007918 implements MigrationInterface {
    name = 'CascadeProductIngredrient1737939007918'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_ingredient" DROP CONSTRAINT "FK_a7a4b2de441d2ab00df5b0d4cdd"`);
        await queryRunner.query(`ALTER TABLE "product_ingredient" ADD CONSTRAINT "FK_a7a4b2de441d2ab00df5b0d4cdd" FOREIGN KEY ("product_id") REFERENCES "carbon_footprint_product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_ingredient" DROP CONSTRAINT "FK_a7a4b2de441d2ab00df5b0d4cdd"`);
        await queryRunner.query(`ALTER TABLE "product_ingredient" ADD CONSTRAINT "FK_a7a4b2de441d2ab00df5b0d4cdd" FOREIGN KEY ("product_id") REFERENCES "carbon_footprint_product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
