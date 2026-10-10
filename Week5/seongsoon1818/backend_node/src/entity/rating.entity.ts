import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BaseTimeEntity } from "./base-time.entity";
import { Member } from "./member.entity";

@Entity("rating")
export class Rating extends BaseTimeEntity {
  @PrimaryGeneratedColumn({ name: "rating_id" })
  ratingId: number;

  @ManyToOne(() => Member, { nullable: false })
  @JoinColumn({ name: "member_id" })
  member: Member;

  @Column({ name: "movie_id" })
  movieId: number;

  @Column()
  score: number;

  @Column({ type: "text", nullable: true })
  comment: string | null;
}