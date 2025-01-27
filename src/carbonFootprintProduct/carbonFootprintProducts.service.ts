import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CarbonFootprintProduct } from "./carbonFootprintProduct.entity";
import { CreateCarbonFootprintProductDto } from "./dto/create-carbonFootprintProduct.dto";
import { ProductIngredient } from "./productIngredient.entity";

@Injectable()
export class CarbonFootprintProductsService {
  constructor(
    @InjectRepository(CarbonFootprintProduct)
    private carbonFootprintProductRepository: Repository<CarbonFootprintProduct>
  ) {}

  findAll(): Promise<CarbonFootprintProduct[]> {
    return this.carbonFootprintProductRepository.find();
  }

  save(
    carbonFootprintProduct: CreateCarbonFootprintProductDto[]
  ): Promise<CarbonFootprintProduct[] | null> {
    return this.carbonFootprintProductRepository.save(carbonFootprintProduct);
  }

  async getProductEmission(productId : number): Promise<number|null>{
    let product = await this.carbonFootprintProductRepository.findOne({where: {id: productId}});
    if(!product){
      throw new NotFoundException("No product was found with id ${productId}");
    }

    return product?.totalCarbonFootprint;
  }

  async calculateEmission(productId: number): Promise<CarbonFootprintProduct>{
    let product = await this.carbonFootprintProductRepository.findOne({
      where: {id: productId},
      relations : {
        ingredients : {
          carbonEmissionFactor : true
        }
      }
    });
    
    if(!product){
      throw new NotFoundException("No product was found with id" + productId);
    }

    let productEmission = this.calculateTotalEmission(product.ingredients);
    product.totalCarbonFootprint = productEmission;

    return await this.carbonFootprintProductRepository.save(product);
  }

  private calculateTotalEmission(
    ingredients: ProductIngredient[]
  ): number | null {
    let total = 0;
    
    for (const ingredient of ingredients) {
      const emissionFactorUnit = ingredient.carbonEmissionFactor.unit.toLowerCase();
      const ingredientUnit = ingredient.unit.toLowerCase();
      const emissionFactorValue = ingredient.carbonEmissionFactor.emissionCO2eInKgPerUnit;
      
      if (emissionFactorUnit != ingredientUnit) {
        let convertedQuantity = this.handleConversion(emissionFactorUnit, ingredientUnit, ingredient.quantity);
        
        if (convertedQuantity === null) { return null; }
        else {
          total += emissionFactorValue * convertedQuantity;
        }
      }
      else {
        total += emissionFactorValue * ingredient.quantity;
      }
    }
    
    return total;
  }
  
  private handleConversion(
    emissionUnit: string,
    ingredientUnit: string,
    ingredientQuantity: number
  ): number | null {
    let convertedValue = ingredientQuantity;
  
    if (emissionUnit === "kg") {
      switch (ingredientUnit) {
        case "g":
          convertedValue = ingredientQuantity / 1000;
          break;
        case "mg":
          convertedValue = ingredientQuantity / 1000000;
          break;
        default:
          Logger.log(
            "Unknown conversion between ${emissionUnit} and ${ingredientUnit}."
          );
          return null;
      }
    }
    else if (emissionUnit === "g") {
      switch (ingredientUnit) {
        case "kg":
          convertedValue = ingredientQuantity * 1000;
          break;
        case "mg":
          convertedValue = ingredientQuantity / 1000;
          break;
        default:
          return null;
      }
    }
    else {
      Logger.log(
        "Unknown conversion between ${emissionUnit} and ${ingredientUnit}."
      );
      return null;
    }
  
    return convertedValue;
  }
  
}
