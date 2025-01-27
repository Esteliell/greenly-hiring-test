import { NotFoundException } from "@nestjs/common";
import { dataSource, GreenlyDataSource } from "../../config/dataSource";
import { getTestCarbonFootprintProduct, seedTestCarbonEmissionFactors } from "../seed-dev-data";
import { CarbonFootprintProduct } from "./carbonFootprintProduct.entity";
import { CarbonFootprintProductsService } from "./carbonFootprintProducts.service";

let carbonFootprintProductsService: CarbonFootprintProductsService;
let hamCheesePizza = getTestCarbonFootprintProduct("hamCheesePizza"); 
let hamCheeseGramsPizza = getTestCarbonFootprintProduct("hamCheeseGramsPizza"); 
let doubleCheesePizza = getTestCarbonFootprintProduct("doubleCheesePizza"); 

beforeAll(async () => {
  await dataSource.initialize();
  await GreenlyDataSource.cleanDatabase();

  carbonFootprintProductsService = new CarbonFootprintProductsService(
    dataSource.getRepository(CarbonFootprintProduct)
  );
});

afterAll(async() => {
  await GreenlyDataSource.cleanDatabase();
  dataSource.destroy();
})

describe("CarbonFootprintProducts.service", () => {
  beforeEach(async() =>{
    await GreenlyDataSource.cleanDatabase();
    await seedTestCarbonEmissionFactors();
    await dataSource.getRepository(CarbonFootprintProduct).save(hamCheesePizza);
  });
  
  afterEach(async() => {
    await GreenlyDataSource.cleanDatabase();
  });

  it("should retrieve all carbonFootprintProducts", async () => {
    const carbonFootprintProducts = await carbonFootprintProductsService.findAll();
    expect(carbonFootprintProducts).toHaveLength(1);
  });

  it("should save new product", async() => {
    await dataSource.getRepository(CarbonFootprintProduct).save(hamCheeseGramsPizza); 
    await dataSource.getRepository(CarbonFootprintProduct).save(doubleCheesePizza);

    const retrieveHamCheeseGramsPizza = await dataSource.getRepository(CarbonFootprintProduct)
                                                        .findOne({ where: { name: "hamCheeseGramsPizza" } });
    
    const retrieveBlueCheesePizza = await dataSource.getRepository(CarbonFootprintProduct)
                                                    .findOne({ where: { name: "doubleCheesePizza" } });

    expect(retrieveHamCheeseGramsPizza?.id).not.toBeNull();
    expect(retrieveBlueCheesePizza?.id).not.toBeNull();
  });

  it("should throw an error if trying to compute non-existent product emission", async () => {
    await expect(carbonFootprintProductsService.calculateEmission(100000))
                .rejects
                .toThrow(NotFoundException);
  });

  it("should calculate, save product emissions, handle mg/kg conversion", async () => {
    await dataSource.getRepository(CarbonFootprintProduct).save(hamCheeseGramsPizza); 
    await dataSource.getRepository(CarbonFootprintProduct).save(doubleCheesePizza);

    const retrieveHamCheesePizza = await dataSource
                                        .getRepository(CarbonFootprintProduct)
                                        .findOne({ where: { name: "hamCheesePizza" } });

    const retrieveHamCheeseGramsPizza = await dataSource
                                              .getRepository(CarbonFootprintProduct)
                                              .findOne({ where: { name: "hamCheeseGramsPizza" } });
    
    const retrieveBlueCheesePizza = await dataSource
                                          .getRepository(CarbonFootprintProduct)
                                          .findOne({ where: { name: "doubleCheesePizza" } });

    if(retrieveHamCheesePizza && retrieveHamCheeseGramsPizza && retrieveBlueCheesePizza){
      hamCheesePizza = await carbonFootprintProductsService.calculateEmission(retrieveHamCheesePizza.id);
      hamCheeseGramsPizza = await carbonFootprintProductsService.calculateEmission(retrieveHamCheeseGramsPizza.id);
      doubleCheesePizza = await carbonFootprintProductsService.calculateEmission(retrieveBlueCheesePizza.id);
      
      expect(hamCheesePizza.totalCarbonFootprint).toBeCloseTo(0.224)
      expect(hamCheesePizza.totalCarbonFootprint).toBe(hamCheeseGramsPizza.totalCarbonFootprint);
      expect(doubleCheesePizza.totalCarbonFootprint).toBeNull();
    }
  });
});

