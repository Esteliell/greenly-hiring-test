import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { dataSource, GreenlyDataSource } from "../config/dataSource";
import { AppModule } from "../src/app.module";
import { CarbonFootprintProduct } from "../src/carbonFootprintProduct/carbonFootprintProduct.entity";
import { getTestCarbonFootprintProduct, seedTestCarbonEmissionFactors } from "../src/seed-dev-data";

beforeAll(async () => {
  await dataSource.initialize();
});

afterAll(async () => {
  await GreenlyDataSource.cleanDatabase();
  await dataSource.destroy();
});

describe("CarbonFootprintProductsController", () => {
  let app: INestApplication;
  let defaultCarbonFootprintProducts: CarbonFootprintProduct[];

  afterEach(async() => {
    await GreenlyDataSource.cleanDatabase();
  })
  
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    seedTestCarbonEmissionFactors();

    await dataSource
    .getRepository(CarbonFootprintProduct)
    .save([getTestCarbonFootprintProduct("hamCheesePizza")]);

    defaultCarbonFootprintProducts = await dataSource
    .getRepository(CarbonFootprintProduct)
    .find();
  });

  it("GET /carbon-footprint-products", async () => {
    return request(app.getHttpServer())
      .get("/carbon-footprint-products")
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual(defaultCarbonFootprintProducts);
      });
  });

  it("POST /carbon-footprint-products", async () => {
    const id = defaultCarbonFootprintProducts[0].id;
    
    return request(app.getHttpServer())
      .post("/carbon-footprint-products/" + id + "/calculate-emissions")
      .expect(201)
      .expect(({ body }) => {
        expect(body.id).toBe(id);
        expect(body.totalCarbonFootprint).toBeCloseTo(0.224);
      });
  });

  it("GET /carbon-footprint-products/id", async () => {
    const id = defaultCarbonFootprintProducts[0].id;

    return request(app.getHttpServer())
      .get("/carbon-footprint-products/" + id)
      .expect(200)
      .expect(({ body }) => {
        expect(body).not.toBeNull();
      });
  });
});
