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

// 등록/수정/삭제는 토큰에서 꺼낸 요청자가 주어라서, 요청자의 memberId를 첫 번째 인자로 받아요.
// 공개 조회(getRatingsByMember)의 memberId는 요청자가 아니라 URL로 받은 "누구의 평점 목록인지"예요.
@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  // 5주차에 만든 공개 조회예요. 누구의 평점 목록이든 볼 수 있어요.
  async getRatingsByMember(memberId: number): Promise<RatingResponseDto[]> {
    await this.findMember(memberId);

    const ratings = await this.ratingRepository.find({
      where: { member: { memberId } },
      order: { ratingId: "DESC" },
    });

    return ratings.map((rating) => RatingResponseDto.from(rating));
  }

  async create(memberId: number, dto: CreateRatingDto): Promise<RatingResponseDto> {
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

    return RatingResponseDto.from(saved);
  }

  async update(memberId: number, ratingId: number, dto: UpdateRatingDto): Promise<RatingResponseDto> {
    const rating = await this.findOwnedRating(memberId, ratingId);

    rating.score = dto.score;
    rating.comment = dto.comment ?? null;

    const saved = await this.ratingRepository.save(rating);
    return RatingResponseDto.from(saved);
  }

  async delete(memberId: number, ratingId: number): Promise<void> {
    const rating = await this.findOwnedRating(memberId, ratingId);

    await this.ratingRepository.remove(rating);
  }

  private async findMember(memberId: number): Promise<Member> {
    const member = await this.memberRepository.findOneBy({ memberId });
    if (!member) {
      throw new ApiException(ErrorCodes.MEMBER_NOT_FOUND);
    }
    return member;
  }

  // 인증(누구인지)은 AuthGuard가, 인가(이 평점이 내 것인지)는 여기서 확인해요.
  // 평점이 없으면 404를 먼저 주고, 있지만 요청자의 평점이 아니면 403이에요.
  private async findOwnedRating(memberId: number, ratingId: number): Promise<Rating> {
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
