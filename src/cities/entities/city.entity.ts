import { Entity, PrimaryKey } from '@mikro-orm/core';

@Entity()
export class City {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id: string;
}
