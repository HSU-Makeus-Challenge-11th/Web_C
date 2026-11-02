// src/service/rating.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from '../entity/rating.entity.js';
import { Member } from '../entity/member.entity.js';
import { RatingResponseDto } from '../dto/rating-response.dto.js';
import { CreateRatingDto } from '../dto/create-rating.dto.js';
import { UpdateRatingDto } from '../dto/update-rating.dto.js';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  async getRatingsByMember(memberId: number): Promise<RatingResponseDto[]> {
    const member = await this.memberRepository.findOneBy({ memberId });
    if (!member) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }

    const ratings = await this.ratingRepository.find({
      where: { member: { memberId } },
      order: { ratingId: 'DESC' },
    });

    return ratings.map(RatingResponseDto.from);
  }

  async getAllRatings(): Promise<RatingResponseDto[]> {
    const ratings = await this.ratingRepository.find({
      order: { ratingId: 'DESC' },
    });
    return ratings.map(RatingResponseDto.from);
  }

  async create(memberId: number, dto: CreateRatingDto): Promise<number> {
    const member = await this.memberRepository.findOneBy({ memberId });
    if (!member) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }

    // rating 테이블에는 (member_id, movie_id) 복합 UNIQUE 제약이 걸려 있습니다.
    // 그냥 저장해도 DB가 막아주지만, 우리가 정한 메시지로 응답하기 위해 먼저 확인합니다.
    const existing = await this.ratingRepository.findOne({
      where: { member: { memberId }, movieId: dto.movieId },
    });
    if (existing) {
      throw new ConflictException('이미 이 영화에 평점을 남기셨습니다.');
    }

    const saved = await this.ratingRepository.save(
      this.ratingRepository.create({
        member,
        movieId: dto.movieId,
        score: dto.score,
        comment: dto.comment ?? null,
      }),
    );

    return saved.ratingId;
  }

  async update(
    ratingId: number,
    memberId: number,
    dto: UpdateRatingDto,
  ): Promise<void> {
    const rating = await this.findOwnedRating(ratingId, memberId);

    rating.score = dto.score;
    rating.comment = dto.comment ?? null;

    await this.ratingRepository.save(rating);
  }

  async delete(ratingId: number, memberId: number): Promise<void> {
    const rating = await this.findOwnedRating(ratingId, memberId);

    await this.ratingRepository.remove(rating);
  }

  /**
   * 평점을 찾고, 그 평점이 요청자의 것인지까지 확인합니다.
   * 먼저 찾아보고(없으면 404), 찾았으면 주인을 봅니다(내 것이 아니면 403).
   */
  private async findOwnedRating(
    ratingId: number,
    memberId: number,
  ): Promise<Rating> {
    const rating = await this.ratingRepository.findOne({
      where: { ratingId },
      relations: { member: true }, // 작성자를 함께 불러와야 소유권을 비교할 수 있습니다
    });

    if (!rating) {
      throw new NotFoundException('존재하지 않는 평점입니다.');
    }

    if (rating.member.memberId !== memberId) {
      throw new ForbiddenException(
        '본인이 작성한 평점만 수정하거나 삭제할 수 있습니다.',
      );
    }

    return rating;
  }
}
