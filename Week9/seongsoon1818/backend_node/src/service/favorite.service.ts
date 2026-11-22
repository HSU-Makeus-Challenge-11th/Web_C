import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from '../entity/favorite.entity';
import { Member } from '../entity/member.entity';
import { ApiException } from '../exception/api.exception';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite) private readonly favorites: Repository<Favorite>,
    @InjectRepository(Member) private readonly members: Repository<Member>,
  ) {}

  async list(memberId: number) {
    const items = await this.favorites.find({
      where: { member: { memberId } },
      order: { favoriteId: 'DESC' },
    });
    return items.map(({ favoriteId, movieId }) => ({ favoriteId, movieId }));
  }

  async contains(memberId: number, movieId: number) {
    return this.favorites.existsBy({ member: { memberId }, movieId });
  }

  async create(memberId: number, movieId: number) {
    const member = await this.members.findOneBy({ memberId });
    if (!member) {
      throw new ApiException(HttpStatus.NOT_FOUND, 'MEMBER404_1', '해당 회원을 찾을 수 없습니다.');
    }
    if (await this.contains(memberId, movieId)) {
      throw new ApiException(HttpStatus.CONFLICT, 'FAVORITE409_1', '이미 즐겨찾기에 등록된 영화입니다.');
    }
    const favorite = await this.favorites.save(this.favorites.create({ member, movieId }));
    return { favoriteId: favorite.favoriteId, movieId: favorite.movieId };
  }

  async remove(memberId: number, movieId: number) {
    const result = await this.favorites.delete({ member: { memberId }, movieId });
    if (!result.affected) {
      throw new ApiException(HttpStatus.NOT_FOUND, 'FAVORITE404_1', '즐겨찾기를 찾을 수 없습니다.');
    }
  }
}
