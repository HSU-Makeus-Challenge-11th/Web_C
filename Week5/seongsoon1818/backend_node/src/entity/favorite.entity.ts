import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BaseTimeEntity } from "./base-time.entity"
import { Member } from "./member.entity";

@Entity("favorite")
export class Favorite extends BaseTimeEntity {
  @PrimaryGeneratedColumn({ name: "favorite_id" })
  favoriteId: number;

  @ManyToOne(() => Member, { nullable: false })
  @JoinColumn({ name: "member_id" })
  member: Member;

  @Column({ name: "movie_id" })
  movieId: number;
}
