import { Entity, PrimaryKey, Property, types } from '@mikro-orm/core';
import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsUUID,
  Length,
} from 'class-validator';

@Entity()
export class City {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  @IsUUID()
  id: string;

  @Property()
  @IsNotEmpty()
  name: string;

  @Property()
  @IsNotEmpty()
  @Length(3, 255)
  country: string;

  @Property({ type: types.float })
  @IsLatitude()
  latitude: number;

  @Property({ type: types.float })
  @IsLongitude()
  longitude: number;

  @Property({ type: types.datetime, hidden: true })
  createdAt = new Date();

  @Property({
    type: types.datetime,
    nullable: true,
    hidden: true,
    onUpdate: () => new Date(),
  })
  updatedAt?: Date;
}
