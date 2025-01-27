import { dataSource, GreenlyDataSource } from "../config/dataSource";
import { CarbonEmissionFactor } from "./carbonEmissionFactor/carbonEmissionFactor.entity";
import { CarbonFootprintProduct } from "./carbonFootprintProduct/carbonFootprintProduct.entity";
import { ProductIngredient } from "./carbonFootprintProduct/productIngredient.entity";

export const TEST_CARBON_EMISSION_FACTORS = [
  {
    name: "ham",
    unit: "kg",
    emissionCO2eInKgPerUnit: 0.11,
    source: "Agrybalise",
  },
  {
    name: "cheese",
    unit: "kg",
    emissionCO2eInKgPerUnit: 0.12,
    source: "Agrybalise",
  },
  {
    name: "tomato",
    unit: "kg",
    emissionCO2eInKgPerUnit: 0.13,
    source: "Agrybalise",
  },
  {
    name: "flour",
    unit: "kg",
    emissionCO2eInKgPerUnit: 0.14,
    source: "Agrybalise",
  },
  {
    name: "blueCheese",
    unit: "kg",
    emissionCO2eInKgPerUnit: 0.34,
    source: "Agrybalise",
  },
  {
    name: "vinegar",
    unit: "kg",
    emissionCO2eInKgPerUnit: 0.14,
    source: "Agrybalise",
  },
  {
    name: "beef",
    unit: "kg",
    emissionCO2eInKgPerUnit: 14,
    source: "Agrybalise",
  },
  {
    name: "oliveOil",
    unit: "kg",
    emissionCO2eInKgPerUnit: 0.15,
    source: "Agrybalise",
  },
].map((args) => {
  return new CarbonEmissionFactor({
    name: args.name,
    unit: args.unit,
    emissionCO2eInKgPerUnit: args.emissionCO2eInKgPerUnit,
    source: args.source,
  });
});

export const getTestEmissionFactor = (name: string) => {
  const emissionFactor = TEST_CARBON_EMISSION_FACTORS.find(
    (ef) => ef.name === name
  );
  if (!emissionFactor) {
    throw new Error(
      `test emission factor with name ${name} could not be found`
    );
  }
  return emissionFactor;
};

export const TEST_CARBON_FOOTPRINT_PRODUCTS = [
  {
    name: "hamCheesePizza",
    totalCarbonFootprint: null,
    ingredients: [
      { name: "ham", quantity: 0.1, unit: "kg" },
      { name: "cheese", quantity: 0.15, unit: "kg" },
      { name: "tomato", quantity: 0.4, unit: "kg" },
      { name: "flour", quantity: 0.7, unit: "kg" },
      { name: "oliveOil", quantity: 0.3, unit: "kg" },
    ],
  },
  {
    name: "hamCheeseGramsPizza",
    totalCarbonFootprint: null,
    ingredients: [
      { name: "ham", quantity: 0.1, unit: "kg" },
      { name: "cheese", quantity: 0.15, unit: "kg" },
      { name: "tomato", quantity: 0.4, unit: "kg" },
      { name: "flour", quantity: 0.7, unit: "kg" },
      { name: "oliveOil", quantity: 0.3, unit: "kg" },
    ],
  },
  {
    name: "doubleCheesePizza",
    totalCarbonFootprint: null,
    ingredients: [
      { name: "cheese", quantity: 0.15, unit: "kg" },
      { name: "blueCheese", quantity: 0.15, unit: "t" },
      { name: "tomato", quantity: 0.4, unit: "kg" },
      { name: "flour", quantity: 0.7, unit: "kg" },
      { name: "oliveOil", quantity: 0.3, unit: "kg" },
    ],
  },
].map((args) => {
  let product = new CarbonFootprintProduct({
    name: args.name,
    totalCarbonFootprint: null,
    ingredients: [],
  });

  const ingredients = args.ingredients.map((ingredient) =>
      new ProductIngredient({
      name: ingredient.name,
      quantity: ingredient.quantity,
      unit: ingredient.unit,
      product: product,
      carbonEmissionFactor : getTestEmissionFactor(ingredient.name)
      }));

  product.ingredients = ingredients;
  return product;
});


export const getTestCarbonFootprintProduct = (name: string) => {
  const carbonFootprintProduct = TEST_CARBON_FOOTPRINT_PRODUCTS.find(
    (ef) => ef.name === name
  );
  if (!carbonFootprintProduct) {
    throw new Error(
      `test product with name ${name} could not be found`
    );
  }
  return carbonFootprintProduct;
};

export const seedTestCarbonEmissionFactors = async () => {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }
  const carbonEmissionFactorsService =
    dataSource.getRepository(CarbonEmissionFactor);

  await carbonEmissionFactorsService.save(TEST_CARBON_EMISSION_FACTORS);
};


export const seedTestCarbonFootprintProducts = async () => {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  GreenlyDataSource.cleanDatabase();

  const carbonFootprintProductService =
    dataSource.getRepository(CarbonFootprintProduct);

  await seedTestCarbonEmissionFactors();

  await carbonFootprintProductService.save(TEST_CARBON_FOOTPRINT_PRODUCTS);
};


if (require.main === module) {
  seedTestCarbonFootprintProducts().catch((e) => console.error(e));
}
