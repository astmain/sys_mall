import { Migration } from '@mikro-orm/migrations'

export class Migration20251120021315 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`create table "tb_user" ("id" serial primary key, "name" varchar(255) not null, "email" varchar(255) not null);`)
  }
}
