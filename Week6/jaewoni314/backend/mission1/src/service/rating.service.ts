import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Rating } from "../entity/rating.entity.js";
import { Member } from "../entity/member.entity.js";
import { RatingResponseDto } from "../dto/rating-response.dto.js";
import { CreateRatingDto } from "../dto/create-rating.dto.js";
import { UpdateRatingDto } from "../dto/update-rating.dto.js";
import { ApiException } from "../common/api.exception.js";
import { ErrorCodes } from "../common/error-code.js";

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  async getRatingsByMember(memberId: number): Promise<RatingResponseDto[]> {
    await this.findMember(memberId);

    const ratings = await this.ratingRepository.find({
      where: { member: { memberId } },
      order: { ratingId: "DESC" },
    });

    return ratings.map(RatingResponseDto.from);
  }

  async create(memberId: number, dto: CreateRatingDto): Promise<number> {
    const member = await this.findMember(memberId);

    // rating 테이블의 (member_id, movie_id) UNIQUE 제약도 막아 주지만, 정한 메시지로 응답하려고 먼저 확인해요.
    const exists = await this.ratingRepository.exists({
      where: { member: { memberId }, movieId: dto.movieId },
    });
    if (exists) {
      throw new ApiException(ErrorCodes.RATING_DUPLICATED);
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

  async update(ratingId: number, memberId: number, dto: UpdateRatingDto): Promise<void> {
    const rating = await this.findOwnedRating(ratingId, memberId);

    rating.score = dto.score;
    rating.comment = dto.comment ?? null;

    await this.ratingRepository.save(rating);
  }

  async delete(ratingId: number, memberId: number): Promise<void> {
    const rating = await this.findOwnedRating(ratingId, memberId);

    await this.ratingRepository.remove(rating);
  }

  private async findMember(memberId: number): Promise<Member> {
    const member = await this.memberRepository.findOneBy({ memberId });
    if (!member) {
      throw new ApiException(ErrorCodes.MEMBER_NOT_FOUND);
    }
    return member;
  }

  // 평점이 없으면 404, 있지만 요청한 회원의 평점이 아니면 403이에요.
  private async findOwnedRating(ratingId: number, memberId: number): Promise<Rating> {
    const rating = await this.ratingRepository.findOne({
      where: { ratingId },
      relations: { member: true }, // 작성자를 함께 불러와야 소유자를 비교할 수 있어요.
    });

    if (!rating) {
      throw new ApiException(ErrorCodes.RATING_NOT_FOUND);
    }
    if (rating.member.memberId !== memberId) {
      throw new ApiException(ErrorCodes.RATING_FORBIDDEN);
    }

    return rating;
  }
}
