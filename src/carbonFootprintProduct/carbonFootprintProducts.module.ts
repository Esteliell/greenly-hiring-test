import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CarbonFootprintProduct } from "./carbonFootprintProduct.entity";
import { CarbonFootprintProductsController } from "./carbonFootprintProducts.controller";
import { CarbonFootprintProductsService } from "./carbonFootprintProducts.service";
import { ProductIngredient } from "./productIngredient.entity";

@Module({
  imports: [TypeOrmModule.forFeature([CarbonFootprintProduct, ProductIngredient])],
  providers: [CarbonFootprintProductsService],
  controllers: [CarbonFootprintProductsController],
})
export class CarbonFootprintProductsModule {}
