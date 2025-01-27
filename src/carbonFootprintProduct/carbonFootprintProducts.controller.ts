import { Controller, Get, Logger, Param, Post } from "@nestjs/common";
import { CarbonFootprintProduct } from "./carbonFootprintProduct.entity";
import { CarbonFootprintProductsService } from "./carbonFootprintProducts.service";

@Controller("carbon-footprint-products")
export class CarbonFootprintProductsController {
    constructor(
        private readonly carbonFootprintProductService: CarbonFootprintProductsService
    ) { }

    @Get()
    getCarbonFootprintProducts(): Promise<CarbonFootprintProduct[]> {
        Logger.log(
            `[carbon-footprint-products] [GET] CarbonFootprintProduct: getting all CarbonFootprintProducts`
        );

        return this.carbonFootprintProductService.findAll();
    }

    @Get(":id")
    getProductEmission(
        @Param("id") id: number
    ): Promise<number | null> {
        Logger.log(
            `[carbon-footprint-products] [GET] CarbonFootprintProduct: getting CarbonFootprintProduct footprint by id`
        );
        return this.carbonFootprintProductService.getProductEmission(id);
    }

    @Post(':id/calculate-emissions')
    calculateProductEmission(
    @Param("id") id: number
    ): Promise<CarbonFootprintProduct> {
        Logger.log(
        `[carbon-footprint-products] [POST] CarbonFootprintProduct: calculating CarbonFootprintProduct carbon footprint`
        );
        return this.carbonFootprintProductService.calculateEmission(id);
    }
}
