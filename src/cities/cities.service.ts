import { QueryOrder } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
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

  async findByName(name: string) {
    return await this.citiesRepository.findOne({ name: name });
  }

  findOne(id: number) {
    return `This action returns a #${id} city`;
  }

  update(id: number, updateCityDto: UpdateCityDto) {
    return `This action updates a #${id} city`;
  }

  remove(id: number) {
    return `This action removes a #${id} city`;
  }
}
