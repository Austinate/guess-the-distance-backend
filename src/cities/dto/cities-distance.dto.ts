import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CitiesDistanceDto {
  @IsUUID(4)
  @ApiProperty({ description: 'uuidv4' })
  from_id: string;

  @IsUUID(4)
  @ApiProperty({ description: 'uuidv4' })
  to_id: string;
}
