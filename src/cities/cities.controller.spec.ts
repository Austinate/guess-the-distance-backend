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
});
