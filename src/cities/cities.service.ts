import { QueryOrder } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { City } from './entities/city.entity';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City)
    private readonly citiesRepository: EntityRepository<City>,
  ) {}

  async create(createCityDto: CreateCityDto) {
    const city = await this.citiesRepository.create(createCityDto);
    await this.citiesRepository.persist(city).flush();
    return city;
  }

  async findAll() {
    return await this.citiesRepository.findAll();
  }

  async findByName(name: string, limit: number, offset: number) {
    return await this.citiesRepository.find(
      {
        name: { $like: `${name}%` },
      },
      { orderBy: { name: QueryOrder.ASC }, limit: limit, offset: offset },
    );
  }

  async findOne(id: string) {
    const city = await this.citiesRepository.findOne({ id: id });
    if (city) {
      return city;
    } else {
      throw new NotFoundException(`City with id ${id} does not exist`);
    }
  }

  update(id: number, updateCityDto: UpdateCityDto) {
    return `This action updates a #${id} city`;
  }

  remove(id: number) {
    return `This action removes a #${id} city`;
  }
}
