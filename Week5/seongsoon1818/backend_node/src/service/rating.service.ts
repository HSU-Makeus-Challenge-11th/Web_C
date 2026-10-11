import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Rating } from "../entity/rating.entity";
import { Member } from "../entity/member.entity";
import { RatingResponseDto } from "../dto/rating-response.dto";
import { RatingPageResponseDto } from "../dto/rating-page-response.dto";

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
      throw new BadRequestException("페이지 범위가 너무 큽니다.");
    }
    const member = await this.memberRepository.findOneBy({ memberId });
    if (!member) {
      throw new NotFoundException("존재하지 않는 유저입니다.");
    }

    const [ratings, totalItems] = await this.ratingRepository.findAndCount({
      where: { member: { memberId } },
      order: { ratingId: "DESC" },
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
}
