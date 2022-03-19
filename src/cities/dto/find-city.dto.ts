import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class FindCityDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  // Use @Type since  IsNumberString doesn't allow to use number validation
  @Type(() => Number)
  @Min(1)
  @Max(20)
  limit: number;

  // Use @Type since  IsNumberString doesn't allow to use number validation
  @Type(() => Number)
  @Min(1)
  @IsOptional()
  offset?: number;
}
