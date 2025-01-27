import { ProductIngredient } from "../productIngredient.entity";

export class CreateCarbonFootprintProductDto {
    name: string;
    totalCarbonFootprint: number | null;
    ingredients: ProductIngredient[];
  }
  