import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CarbonEmissionFactor } from "./carbonEmissionFactor.entity";
import { CreateCarbonEmissionFactorDto } from "./dto/create-carbonEmissionFactor.dto";

@Injectable()
export class CarbonEmissionFactorsService {
  constructor(
    @InjectRepository(CarbonEmissionFactor)
    private carbonEmissionFactorRepository: Repository<CarbonEmissionFactor>
  ) {}

  findAll(): Promise<CarbonEmissionFactor[]> {
    return this.carbonEmissionFactorRepository.find();
  }

  async findName(name: string): Promise<CarbonEmissionFactor> {
    let carbonEmissionFactors = await this.carbonEmissionFactorRepository.find({ where: { name: name } });
    if (carbonEmissionFactors.length === 0){
      throw new NotFoundException('No carbon emission factor was found by name ' + name);
    }

    return carbonEmissionFactors[0];
  }

  save(
    carbonEmissionFactor: CreateCarbonEmissionFactorDto[]
  ): Promise<CarbonEmissionFactor[] | null> {
    return this.carbonEmissionFactorRepository.save(carbonEmissionFactor);
  }
}
