// src/entity/favorite.entity.ts
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { BaseTimeEntity } from './base-time.entity.js';
import { Member } from './member.entity.js';

@Entity('favorite')
@Unique('uk_favorite_member_movie', ['member', 'movieId'])
export class Favorite extends BaseTimeEntity {
  @PrimaryGeneratedColumn({ name: 'favorite_id' })
  favoriteId: number;

  // 즐겨찾기의 주인은 로그인한 회원입니다.
  @ManyToOne(() => Member, { nullable: false })
  @JoinColumn({ name: 'member_id' })
  member: Member;

  // TMDB의 영화 ID를 그대로 저장합니다. 우리 DB의 외래 키는 아닙니다.
  @Column({ name: 'movie_id' })
  movieId: number;
}
