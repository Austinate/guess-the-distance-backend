import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CitiesService } from './cities.service';
import { CitiesDistanceDto } from './dto/cities-distance.dto';
import { CreateCityDto } from './dto/create-city.dto';
import { FindCityDto } from './dto/find-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

@ApiBearerAuth('JWT')
@ApiTags('cities')
@Controller('cities')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Post()
  create(@Body() createCityDto: CreateCityDto) {
    return this.citiesService.create(createCityDto);
  }

  @Get('find')
  find(@Query() query: FindCityDto) {
    return this.citiesService.findByName(query.limit, query.offset, query.name);
  }

  @Get('distance')
  distance(@Query() query: CitiesDistanceDto) {
    return this.citiesService.distance(query.from_id, query.to_id);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.citiesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCityDto: UpdateCityDto,
  ) {
    return this.citiesService.update(id, updateCityDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.citiesService.remove(+id);
  }
}
