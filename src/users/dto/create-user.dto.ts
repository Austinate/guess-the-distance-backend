import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 255)
  @ApiProperty({ minimum: 3, maximum: 255 })
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 255)
  @ApiProperty({ minimum: 3, maximum: 255 })
  password: string;
}
