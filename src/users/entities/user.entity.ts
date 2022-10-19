import {
  Entity,
  Enum,
  PrimaryKey,
  Property,
  types,
  Unique,
} from '@mikro-orm/core';
import { IsUUID } from 'class-validator';
import { UserRole } from '../user-role.enum';
import { v4 as uuid } from 'uuid';

@Entity()
@Unique({ properties: ['username'] })
export class User {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  @IsUUID()
  readonly id: string;

  @Property()
  readonly username: string;

  @Property({ hidden: true })
  readonly passwordHash: string;

  @Enum({ type: types.enumArray, default: [UserRole.User], nullable: false })
  readonly roles: UserRole[];

  @Property({ type: types.datetime, hidden: true })
  readonly createdAt = new Date();

  @Property({
    type: types.datetime,
    nullable: true,
    hidden: true,
    onUpdate: () => new Date(),
  })
  readonly updatedAt?: Date;

  constructor(username: string, roles: [UserRole], passwordHash: string) {
    this.id = uuid();
    this.username = username;
    this.passwordHash = passwordHash;
    this.roles = roles;
  }
}
