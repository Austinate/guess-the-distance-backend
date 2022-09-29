import { FindOptions, QueryOrder } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { City } from './entities/city.entity';
import * as haversine from 'haversine';

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

  async distance(from: string, to: string) {
    if (from === to) {
      return { distance: 0 };
    }

    const cities = await this.citiesRepository.find([from, to]);
    if (cities.length != 2) {
      const missing_ids = [from, to].filter((id) => {
        return !cities.some((city) => city.id === id);
      });
      throw new NotFoundException(
        `Cities with id's ${missing_ids} do not exist`,
      );
    }

    const from_city = cities[0];
    const to_city = cities[1];
    const distance = haversine(
      [from_city.latitude, from_city.longitude],
      [to_city.latitude, to_city.longitude],
      { format: '[lat,lon]' },
    );

    // Number->String->Number conversion is redundant, update to something more efficient
    const rounded = parseFloat(distance.toFixed(2));
    return { distance: rounded };
  }
}
