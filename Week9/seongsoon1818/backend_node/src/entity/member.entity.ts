import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { BaseTimeEntity } from './base-time.entity';

@Entity('member')
@Unique('email', ['email'])
@Unique('nickname', ['nickname'])
export class Member extends BaseTimeEntity {
  @PrimaryGeneratedColumn({ name: 'member_id' })
  memberId: number;

  @Column({ length: 254 })
  email: string;

  @Column({ length: 60 })
  password: string;

  @Column({ length: 50 })
  nickname: string;
}
