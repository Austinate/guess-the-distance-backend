import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { IsLatitude, IsLongitude, IsNotEmpty, IsUUID } from 'class-validator';

@Entity()
export class City {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  @IsUUID()
  id: string;

  @Property()
  @IsNotEmpty()
  name: string;

  @Property()
  @IsLatitude()
  latitude: number;

  @Property()
  @IsLongitude()
  longitude: number;
}
