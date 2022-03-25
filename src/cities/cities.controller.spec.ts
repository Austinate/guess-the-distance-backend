import { Test, TestingModule } from '@nestjs/testing';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { CitiesController } from './cities.controller';
import { CitiesService } from './cities.service';
import { resolve } from 'path';
import { City } from './entities/city.entity';

describe('CitiesController', () => {
  let controller: CitiesController;
  let serviceMock: DeepMocked<CitiesService>;

  beforeEach(async () => {
    serviceMock = createMock<CitiesService>();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CitiesController],
      providers: [{ provide: CitiesService, useValue: serviceMock }],
    }).compile();

    controller = module.get<CitiesController>(CitiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of cities', async () => {
      const cities = [
        new City('Kyiv', 'Ukraine', 50.45, 30.5236),
        new City('Kharkiv', 'Ukraine', 50, 36.2292),
      ];
      serviceMock.findAll.mockReturnValueOnce(Promise.resolve(cities));
      expect(await controller.findAll()).toBe(cities);
      expect(serviceMock.findAll).toBeCalledTimes(1);
    });
  });
});
