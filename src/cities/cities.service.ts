import { FindOptions, QueryOrder } from '@mikro-orm/core';
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
    await this.citiesRepository.persistAndFlush(city);
    return city;
  }

  async findByName(limit: number, offset: number, name?: string) {
    const options: FindOptions<City, never> = {
      orderBy: { name: QueryOrder.ASC },
      limit: limit,
      offset: offset * limit,
    };
    if (name) {
      return await this.citiesRepository.find(
        {
          name: { $like: `${name}%` },
        },
        options,
      );
    } else {
      return await this.citiesRepository.findAll(options);
    }
  }

  async findOne(id: string) {
    const city = await this.citiesRepository.findOne({ id: id });
    if (city) {
      return city;
    } else {
      throw new NotFoundException(`City with id ${id} does not exist`);
    }
  }

  async update(id: string, updateCityDto: UpdateCityDto) {
    const city = await this.findOne(id);
    Object.assign(city, updateCityDto);
    await this.citiesRepository.persistAndFlush(city);
    return city;
  }

  remove(id: number) {
    return `This action removes a #${id} city`;
  }
}
