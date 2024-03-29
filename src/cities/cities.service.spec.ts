import { Test, TestingModule } from '@nestjs/testing';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { CitiesService } from './cities.service';
import { EntityRepository, QueryOrder } from '@mikro-orm/core';
import { City } from './entities/city.entity';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { CreateCityDto } from './dto/create-city.dto';
import { FindCityDto } from './dto/find-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

describe('CitiesService', () => {
  let service: CitiesService;
  let repositoryMock: DeepMocked<EntityRepository<City>>;

  beforeEach(async () => {
    repositoryMock = createMock<EntityRepository<City>>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CitiesService,
        {
          provide: getRepositoryToken(City),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<CitiesService>(CitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should return a created city', async () => {
      const cityDTO = new CreateCityDto();
      cityDTO.name = 'Kyiv';
      cityDTO.country = 'Ukraine';
      cityDTO.latitude = 50.45;
      cityDTO.longitude = 30.5236;

      let result: City;
      repositoryMock.create.mockImplementationOnce((dto) => {
        result = new City(dto.name, dto.country, dto.latitude, dto.longitude);
        return result;
      });

      expect(await service.create(cityDTO)).toBe(result);
      expect(repositoryMock.create).toBeCalledWith(cityDTO);
      expect(repositoryMock.create).toBeCalledTimes(1);
      expect(repositoryMock.persistAndFlush).toBeCalledWith(result);
      expect(repositoryMock.persistAndFlush).toBeCalledTimes(1);
    });
  });

  describe('findByName', () => {
    it('should return an array of cities', async () => {
      const query: FindCityDto = {
        name: 'Kyiv',
        limit: 3,
        offset: 1,
      };
      const result = [
        new City('Kyiv', 'Ukraine', 50.45, 30.5236),
        new City('Kharkiv', 'Ukraine', 50, 36.2292),
        new City('Lviv', 'Ukraine', 49.8419, 24.0315),
      ];

      repositoryMock.find.mockResolvedValueOnce(result);

      expect(
        await service.findByName(query.limit, query.offset, query.name),
      ).toBe(result);
      expect(repositoryMock.find).toBeCalledWith(
        { name: { $ilike: `${query.name}%` } },
        {
          limit: query.limit,
          offset: query.offset * query.limit,
          orderBy: { name: QueryOrder.ASC },
        },
      );
      expect(repositoryMock.find).toBeCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a city if it exists', async () => {
      const result = new City('Kyiv', 'Ukraine', 50.45, 30.5236);
      repositoryMock.findOne.mockResolvedValueOnce(result);

      expect(await service.findOne(result.id)).toBe(result);
      expect(repositoryMock.findOne).toBeCalledTimes(1);
      expect(repositoryMock.findOne).toBeCalledWith({ id: result.id });
    });

    it('should throw NotFoundException if city is missing', async () => {
      const id = uuid();
      repositoryMock.findOne.mockResolvedValueOnce(null);

      expect(service.findOne(id)).rejects.toThrow(NotFoundException);
      expect(repositoryMock.findOne).toBeCalledWith({ id: id });
      expect(repositoryMock.findOne).toBeCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should throw NotFoundException if city is missing', async () => {
      const id = uuid();
      const dto: UpdateCityDto = {};
      repositoryMock.findOne.mockReturnValueOnce(null);

      expect(service.update(id, dto)).rejects.toThrow(NotFoundException);
    });

    it('should return updated city', async () => {
      const dto: UpdateCityDto = {
        name: 'Kyiv',
        country: 'Ukraine',
        latitude: 50.45,
        longitude: 30.5236,
      };
      const city = new City(dto.name, dto.country, dto.latitude, dto.longitude);
      repositoryMock.findOne.mockResolvedValueOnce(city);

      expect(await service.update(city.id, dto)).toBe(city);
      expect(repositoryMock.findOne).toBeCalledWith({ id: city.id });
      expect(repositoryMock.findOne).toHaveBeenCalledTimes(1);
      expect(repositoryMock.persistAndFlush).toBeCalledWith(city);
      expect(repositoryMock.persistAndFlush).toBeCalledTimes(1);
    });
  });

  describe('distance', () => {
    it('should throw NotFoundException if any of cities is missing', async () => {
      const dto: UpdateCityDto = {
        name: 'Kyiv',
        country: 'Ukraine',
        latitude: 50.45,
        longitude: 30.5236,
      };
      const from = new City(dto.name, dto.country, dto.latitude, dto.longitude);
      const to = uuid();
      repositoryMock.find.mockResolvedValueOnce([from]);

      expect(service.distance(from.id, to)).rejects.toThrow(NotFoundException);
      expect(repositoryMock.find).toBeCalledWith([from.id, to]);
      expect(repositoryMock.find).toBeCalledTimes(1);
    });

    it('should return 0 for cities with same id', async () => {
      const id = uuid();

      expect(await service.distance(id, id)).toEqual({ distance: 0 });
    });

    it('should return correct distance between 2 existing cities', async () => {
      const from = new City('Kyiv', 'Ukraine', 50.45, 30.5236);
      const to = new City('Kharkiv', 'Ukraine', 50, 36.2292);
      repositoryMock.find.mockResolvedValueOnce([from, to]);

      expect(await service.distance(from.id, to.id)).toEqual({
        distance: 408.86,
      });
    });
  });
});
