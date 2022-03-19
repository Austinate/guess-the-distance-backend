import { Migration } from '@mikro-orm/migrations';

export class Migration20220319202949 extends Migration {
  async up(): Promise<void> {
    this.addSql('create extension if not exists "uuid-ossp"');
    this.addSql(
      'create table "city" ("id" uuid not null default uuid_generate_v4(), "name" varchar(255) not null, "country" varchar(255) not null, "latitude" real not null, "longitude" real not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) null);',
    );
    this.addSql(
      'alter table "city" add constraint "city_pkey" primary key ("id");',
    );
  }
}
