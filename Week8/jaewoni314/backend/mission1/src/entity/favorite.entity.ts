import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { BaseTimeEntity } from "./base-time.entity.js";
import { Member } from "./member.entity.js";

// 즐겨찾기는 영화 자체가 아니라 "어떤 회원이 어떤 영화를 즐겨찾기했다"는 관계예요.
// 한 회원은 한 영화를 한 번만 즐겨찾기할 수 있어서 (member_id, movie_id)에 UNIQUE 제약을 둬요.
// 제약 이름은 sql/01_schema_seed.sql의 uk_favorite_member_movie와 같아요. (synchronize: false라 표시용이에요.)
@Entity("favorite")
@Unique("uk_favorite_member_movie", ["member", "movieId"])
export class Favorite extends BaseTimeEntity {
  @PrimaryGeneratedColumn({ name: "favorite_id" })
  favoriteId: number;

  @ManyToOne(() => Member, { nullable: false })
  @JoinColumn({ name: "member_id" })
  member: Member;

  // TMDB가 부여한 영화 ID라서 우리 DB의 외래 키가 아니에요.
  @Column({ name: "movie_id" })
  movieId: number;
}
