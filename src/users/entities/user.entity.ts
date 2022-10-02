import {
  Entity,
  Enum,
  PrimaryKey,
  Property,
  types,
  Unique,
} from '@mikro-orm/core';
import { IsUUID } from 'class-validator';
import { UserRole } from '../common/user.role';

@Entity()
@Unique({ properties: ['username'] })
export class User {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  @IsUUID()
  id: string;

  @Property()
  username: string;

  @Property()
  @Enum({ default: [UserRole.User] })
  role: UserRole;

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