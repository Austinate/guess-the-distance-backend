import { Test, TestingModule } from '@nestjs/testing';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { CitiesController } from './cities.controller';
import { CitiesService } from './cities.service';
import { City } from './entities/city.entity';
import { CreateCityDto } from './dto/create-city.dto';
import { v4 as uuid } from 'uuid';

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

  describe('create', () => {
    describe('when validation passes', () => {
      it('should create and return new city', async () => {
        const dto = new CreateCityDto();
        dto.name = 'Kyiv';
        dto.country = 'Ukraine';
        dto.latitude = 50.45;
        dto.longitude = 30.5236;

        serviceMock.create.mockImplementationOnce((dto) => {
          return Promise.resolve(
            new City(dto.name, dto.country, dto.latitude, dto.longitude),
          );
        });
        expect(await controller.create(dto)).toEqual(
          expect.objectContaining(dto),
        );
        expect(serviceMock.create).toBeCalledWith(dto);
        expect(serviceMock.create).toBeCalledTimes(1);
      });
    });
  });

  describe('update', () => {
    it('should return an updated city', async () => {
      const dto = new CreateCityDto();
      dto.name = 'Kyiv';
      dto.country = 'Ukraine';
      dto.latitude = 50.45;
      dto.longitude = 30.5236;

      const city = new City(dto.name, dto.country, dto.latitude, dto.longitude);
      serviceMock.update.mockResolvedValueOnce(city);

      expect(await controller.update(city.id, dto)).toBe(city);
      expect(serviceMock.update).toBeCalledWith(city.id, dto);
      expect(serviceMock.update).toBeCalledTimes(1);
    });
  });

  describe('distance', () => {
    it('should return a distance between 2 existing cities', async () => {
      const from = uuid();
      const to = uuid();
      const result = { distance: 408.63 };

      serviceMock.distance.mockResolvedValueOnce(result);

      expect(await controller.distance({ from_id: from, to_id: to })).toBe(
        result,
      );
      expect(serviceMock.distance).toBeCalledWith(from, to);
      expect(serviceMock.distance).toBeCalledTimes(1);
    });
  });
});
