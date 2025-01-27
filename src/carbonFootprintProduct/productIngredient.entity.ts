import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CarbonEmissionFactor } from "../carbonEmissionFactor/carbonEmissionFactor.entity";
import { CarbonFootprintProduct } from "./carbonFootprintProduct.entity";

@Entity("product_ingredient")
export class ProductIngredient extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: false,
    type: "float",
  })
  quantity: number;

  @Column({
    nullable: false,
  })
  unit: string;

  @ManyToOne(() => CarbonFootprintProduct, (product) => product.ingredients, {
    nullable: false,
    onDelete: "CASCADE"
  })
  @JoinColumn({ name: "product_id" })
  product: CarbonFootprintProduct;

  @ManyToOne(() => CarbonEmissionFactor, {
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: "carbon_emission_factor_id" })
  carbonEmissionFactor: CarbonEmissionFactor;

  sanitize() {
    if (this.name === "") {
      throw new Error("Ingredient name cannot be null.");
    }
    if (this.quantity === null) {
      throw new Error("Ingredient quantity cannot be null.");
    }
    if (this.quantity < 0) {
      throw new Error("Ingredient quantity cannot be negative.");
    }
    if (this.product === null) {
      throw new Error("Ingredient must have a linked product.");
    }
    if (this.carbonEmissionFactor === null) {
      throw new Error(
        "Ingredient must have a matching carbon emission factor."
      );
    }
  }

  constructor(props: {
    name: string;
    quantity: number;
    unit: string;
    product: CarbonFootprintProduct;
    carbonEmissionFactor: CarbonEmissionFactor;
  }) {
    super();

    this.name = props?.name;
    this.quantity = props?.quantity;
    this.unit = props?.unit;
    this.product = props?.product;
    this.carbonEmissionFactor = props?.carbonEmissionFactor;
    this.sanitize();
  }
}
