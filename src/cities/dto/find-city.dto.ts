import { IsNotEmpty, IsString } from 'class-validator';

export class FindCityDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
