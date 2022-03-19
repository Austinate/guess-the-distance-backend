import { ApiProperty } from '@nestjs/swagger';
import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';

export class CreateCityDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 255)
  @ApiProperty({ minimum: 3, maximum: 255 })
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 255)
  @ApiProperty({ minimum: 3, maximum: 255 })
  country: string;

  @IsLatitude()
  @ApiProperty()
  latitude: number;

  @IsLongitude()
  @ApiProperty()
  longitude: number;
}
