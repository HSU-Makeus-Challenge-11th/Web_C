import {
  Injectable,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from '../entity/rating.entity';
import { Member } from '../entity/member.entity';
import { RatingResponseDto } from '../dto/rating-response.dto';
import { RatingPageResponseDto } from '../dto/rating-page-response.dto';
import { CreateRatingDto } from '../dto/create-rating.dto';
import { UpdateRatingDto } from '../dto/update-rating.dto';
import { API_ERRORS } from '../error/api-errors';
import { ApiException } from '../exception/api.exception';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  async getRatingsByMember(
    memberId: number,
    page = 0,
    size = 10,
  ): Promise<RatingPageResponseDto> {
    const skip = page * size;
    if (!Number.isSafeInteger(skip)) {
      throw new ApiException(
        HttpStatus.BAD_REQUEST,
        'RATING400_1',
        '페이지 범위가 너무 큽니다.',
      );
    }
    const member = await this.memberRepository.findOneBy({ memberId });
    if (!member) {
      throw new ApiException(
        HttpStatus.NOT_FOUND,
        'MEMBER404_1',
        '해당 회원을 찾을 수 없습니다.',
      );
    }

    const [ratings, totalItems] = await this.ratingRepository.findAndCount({
      where: { member: { memberId } },
      order: { ratingId: 'DESC' },
      skip,
      take: size,
    });

    const totalPages = Math.ceil(totalItems / size);
    return {
      items: ratings.map(RatingResponseDto.from),
      page,
      size,
      totalItems,
      totalPages,
      hasNext: page + 1 < totalPages,
      hasPrevious: page > 0,
    };
  }

  async create(memberId: number, dto: CreateRatingDto): Promise<number> {
    const member = await this.memberRepository.findOneBy({ memberId });
    if (!member) {
      throw new ApiException(
        HttpStatus.NOT_FOUND,
        'MEMBER404_1',
        '해당 회원을 찾을 수 없습니다.',
      );
    }

    // rating 테이블에는 (member_id, movie_id) 복합 UNIQUE 제약이 걸려 있습니다.
    // 그냥 저장해도 DB가 막아주지만, 우리가 정한 메시지로 응답하기 위해 먼저 확인합니다.
    const existing = await this.ratingRepository.findOne({
      where: { member: { memberId }, movieId: dto.movieId },
    });
    if (existing) {
      throw new ApiException(
        HttpStatus.CONFLICT,
        API_ERRORS.duplicateRating.code,
        API_ERRORS.duplicateRating.message,
      );
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
    memberId: number,
    ratingId: number,
    dto: UpdateRatingDto,
  ): Promise<RatingResponseDto> {
    const rating = await this.findOwnedRating(ratingId, memberId);

    rating.score = dto.score;
    if (dto.comment !== undefined) rating.comment = dto.comment;

    const saved = await this.ratingRepository.save(rating);
    return RatingResponseDto.from(saved);
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
      throw new ApiException(
        HttpStatus.NOT_FOUND,
        'RATING404_1',
        '해당 평점을 찾을 수 없습니다.',
      );
    }

    if (rating.member.memberId !== memberId) {
      throw new ApiException(
        HttpStatus.FORBIDDEN,
        'RATING403_1',
        '본인이 작성한 평점만 수정하거나 삭제할 수 있습니다.',
      );
    }

    return rating;
  }
}
