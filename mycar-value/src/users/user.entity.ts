import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Exclude } from "class-transformer";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  @Exclude() // 비밀번호는 반환하지 않음
  password: string;

  @AfterInsert()
  logInsert() {
    console.log("Inserted User with id", this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log("Updated User with id", this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log("Removed User with id", this.id);
  }
}
