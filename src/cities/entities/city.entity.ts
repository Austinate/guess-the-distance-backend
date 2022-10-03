import { Entity, PrimaryKey, Property, types } from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';
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
  readonly id: string;

  @Property()
  @IsNotEmpty()
  readonly name: string;

  @Property()
  @IsNotEmpty()
  @Length(3, 255)
  readonly country: string;

  @Property({ type: types.float })
  @IsLatitude()
  readonly latitude: number;

  @Property({ type: types.float })
  @IsLongitude()
  readonly longitude: number;

  @Property({ type: types.datetime, hidden: true })
  readonly createdAt = new Date();

  @Property({
    type: types.datetime,
    nullable: true,
    hidden: true,
    onUpdate: () => new Date(),
  })
  readonly updatedAt?: Date;

  constructor(
    name: string,
    country: string,
    latitude: number,
    longitude: number,
  ) {
    this.id = uuid();
    this.name = name;
    this.country = country;
    this.latitude = latitude;
    this.longitude = longitude;
  }
}
