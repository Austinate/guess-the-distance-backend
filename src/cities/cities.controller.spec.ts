import { Test, TestingModule } from '@nestjs/testing';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { CitiesController } from './cities.controller';
import { CitiesService } from './cities.service';
import { City } from './entities/city.entity';
import { CreateCityDto } from './dto/create-city.dto';

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

  describe('POST city', () => {
    describe('when validation passes', () => {
      it('should create and return new city', async () => {
        const cityDTO = new CreateCityDto();
        cityDTO.name = 'Kyiv';
        cityDTO.country = 'Ukraine';
        cityDTO.latitude = 50.45;
        cityDTO.longitude = 30.5236;

        serviceMock.create.mockImplementationOnce((dto) => {
          return Promise.resolve(
            new City(dto.name, dto.country, dto.latitude, dto.longitude),
          );
        });
        expect(await controller.create(cityDTO)).toEqual(
          expect.objectContaining(cityDTO),
        );
        expect(serviceMock.create).toBeCalledWith(cityDTO);
        expect(serviceMock.create).toBeCalledTimes(1);
      });
    });
  });
});
