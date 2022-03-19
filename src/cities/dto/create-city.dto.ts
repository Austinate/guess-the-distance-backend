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
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 255)
  country: string;

  @IsLatitude()
  latitude: number;

  @IsLongitude()
  longitude: number;
}
