import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ProductIngredient } from "./productIngredient.entity";

@Entity("carbon_footprint_product")
export class CarbonFootprintProduct extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: true,
    type: "float",
  })
  totalCarbonFootprint: number | null;

  @OneToMany(() => ProductIngredient, (ingredient) => ingredient.product, {
    cascade: ["update", "remove", "insert"],
    eager: true,
  })
  ingredients: ProductIngredient[];

  sanitize() {
    if (this.name === "") {
      throw new Error("Product name cannot be empty.");
    }
  }

  constructor(props: {
    name: string;
    totalCarbonFootprint: number | null;
    ingredients: ProductIngredient[];
  }) {
    super();

    this.name = props?.name;
    this.totalCarbonFootprint = props?.totalCarbonFootprint;
    this.ingredients = props?.ingredients;
    this.sanitize();
  }
}
