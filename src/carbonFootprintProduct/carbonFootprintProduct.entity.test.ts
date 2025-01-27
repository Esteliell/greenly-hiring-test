import { dataSource, GreenlyDataSource } from "../../config/dataSource";
import { CarbonEmissionFactor } from "../carbonEmissionFactor/carbonEmissionFactor.entity";
import { CarbonFootprintProduct } from "./carbonFootprintProduct.entity";
import { ProductIngredient } from "./productIngredient.entity";

let chickenEmissionFactor: CarbonEmissionFactor;
let chickenProduct: CarbonFootprintProduct;

beforeAll(async () => {
  await dataSource.initialize();

  chickenEmissionFactor = new CarbonEmissionFactor({
    emissionCO2eInKgPerUnit: 2.4,
    unit: "kg",
    name: "chicken",
    source: "Agrybalise",
  });

  chickenProduct = new CarbonFootprintProduct({
    name: "chickenProduct",
    ingredients: [],
    totalCarbonFootprint: null,
  });

  let chickenIngredient = new ProductIngredient({
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

describe("CarbonFootprintProductEntity", () => {
  describe("constructor", () => {
    it("should create a product entity", () => {
      expect(chickenProduct.name).toBe("chickenProduct");
      expect(chickenProduct.totalCarbonFootprint).toBe(null);
      expect(chickenProduct.ingredients.length).toBe(1);
    });

    it("should throw an error if no name", () => {
      expect(
        () =>
          (chickenProduct = new CarbonFootprintProduct({
            name: "",
            ingredients: [],
            totalCarbonFootprint: null,
          }))
      ).toThrow("Product name cannot be empty.");
    });
  });
});
