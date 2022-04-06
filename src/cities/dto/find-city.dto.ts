import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class FindCityDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional({ description: 'Matches city name by prefix' })
  name?: string;

  // Use @Type since  IsNumberString doesn't allow to use number validation
  @Type(() => Number)
  @Min(1)
  @Max(20)
  @ApiProperty({ minimum: 1, maximum: 20 })
  limit: number;

  // Use @Type since  IsNumberString doesn't allow to use number validation
  @Type(() => Number)
  @Min(0)
  @ApiProperty({ minimum: 0 })
  offset: number;
}
