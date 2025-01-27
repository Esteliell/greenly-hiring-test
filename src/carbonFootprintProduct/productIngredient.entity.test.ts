import { GreenlyDataSource, dataSource } from "../../config/dataSource";
import { CarbonEmissionFactor } from "../carbonEmissionFactor/carbonEmissionFactor.entity";
import { CarbonFootprintProduct } from "./carbonFootprintProduct.entity";
import { ProductIngredient } from "./productIngredient.entity";

let chickenEmissionFactor: CarbonEmissionFactor;
let chickenProduct: CarbonFootprintProduct;
let chickenIngredient: ProductIngredient;

beforeAll(async () => {
  await dataSource.initialize();

  chickenEmissionFactor = new CarbonEmissionFactor({
    emissionCO2eInKgPerUnit: 2.4,
    unit: "kg",
    name: "chicken",
    source: "Agrybalise",
  });

  chickenProduct = new CarbonFootprintProduct({
    name: "chicken",
    ingredients: [],
    totalCarbonFootprint: null,
  });

  chickenIngredient = new ProductIngredient({
    name: "chicken",
    quantity: 0.8,
    unit: "kg",
    product: chickenProduct,
    carbonEmissionFactor: chickenEmissionFactor,
  });

  chickenProduct.ingredients = [chickenIngredient];
});

beforeEach(async () => {
  await GreenlyDataSource.cleanDatabase();
});

describe("ProductIngredientEntity", () => {
  describe("constructor", () => {
    it("should create a product ingredient entity", () => {
      expect(chickenIngredient.name).toBe("chicken");
      expect(chickenIngredient.quantity).toBe(0.8);
      expect(chickenIngredient.unit).toBe("kg");
      expect(chickenIngredient.product).toBe(chickenProduct);
      expect(chickenIngredient.carbonEmissionFactor).toBe(
        chickenEmissionFactor
      );
    });
    
    it("should throw an error if empty name", () => {
      expect(
        () =>
          new ProductIngredient({
            name: "",
            product: chickenProduct,
            carbonEmissionFactor: chickenEmissionFactor,
            quantity: 0.6,
            unit: "kg",
          })
      ).toThrow("Ingredient name cannot be null.");
    });

    it("should throw an error if null quantity", () => {
      expect(
        () =>
          new ProductIngredient({
            name: "chicken",
            product: chickenProduct,
            carbonEmissionFactor: chickenEmissionFactor,
            quantity: null as any,
            unit: "kg",
          })
      ).toThrow("Ingredient quantity cannot be null.");
    });

    it("should throw an error if negative quantity", () => {
      expect(
        () =>
          new ProductIngredient({
            name: "chicken",
            product: chickenProduct,
            carbonEmissionFactor: chickenEmissionFactor,
            quantity: -0.8,
            unit: "kg",
          })
      ).toThrow("Ingredient quantity cannot be negative.");
    });

    it("should throw an error if no product", () => {
      expect(
        () =>
          new ProductIngredient({
            name: "chicken",
            product: null as any,
            carbonEmissionFactor: chickenEmissionFactor,
            quantity: 0.8,
            unit: "kg",
          })
      ).toThrow("Ingredient must have a linked product.");
    });

    it("should throw an error if no linked carbon emission factor", () => {
      expect(
        () =>
          new ProductIngredient({
            name: "chicken",
            product: chickenProduct,
            carbonEmissionFactor: null as any,
            quantity: 0.8,
            unit: "kg",
          })
      ).toThrow("Ingredient must have a matching carbon emission factor.");
    });
  });
});
