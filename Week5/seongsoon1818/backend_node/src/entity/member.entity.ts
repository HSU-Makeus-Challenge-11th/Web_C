import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseTimeEntity } from "./base-time.entity"

@Entity("member")
export class Member extends BaseTimeEntity {
  @PrimaryGeneratedColumn({ name: "member_id" })
  memberId: number;

  @Column({ unique: true, length: 254 })
  email: string;

  @Column({ length: 60 })
  password: string;

  @Column({ unique: true, length: 50 })
  nickname: string;
}