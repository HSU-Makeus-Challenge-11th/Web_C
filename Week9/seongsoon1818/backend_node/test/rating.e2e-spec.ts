import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { Repository } from 'typeorm';
import { RatingController } from '../src/controller/rating.controller';
import { Member } from '../src/entity/member.entity';
import { Rating } from '../src/entity/rating.entity';
import { HttpExceptionFilter } from '../src/filter/http-exception.filter';
import { RatingService } from '../src/service/rating.service';

describe('평점 등록 API (통합 테스트)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let memberRepository: Repository<Member>;
  let ratingRepository: Repository<Rating>;
  let member: Member;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqljs',
          autoSave: false,
          entities: [Member, Rating],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Member, Rating]),
        JwtModule.register({ global: true, secret: 'test-secret-for-e2e-only' }),
      ],
      controllers: [RatingController],
      providers: [RatingService],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();

    jwtService = module.get(JwtService);
    memberRepository = module.get(getRepositoryToken(Member));
    ratingRepository = module.get(getRepositoryToken(Rating));
    member = await memberRepository.save(memberRepository.create({
      email: 'rating-e2e@umc.com',
      password: 'unused-in-this-test',
      nickname: '평점테스터',
    }));
  });

  afterAll(async () => {
    await app.close();
  });

  it('토큰 없이 POST /ratings를 호출하면 401을 응답한다', async () => {
    const response = await request(app.getHttpServer())
      .post('/ratings')
      .send({ movieId: 550, score: 5 })
      .expect(401);

    expect(response.body.code).toBe('AUTH401_2');
  });

  it('토큰을 담아 POST /ratings를 호출하면 201을 응답하고 평점을 저장한다', async () => {
    const token = jwtService.sign({ sub: String(member.memberId), email: member.email });
    const response = await request(app.getHttpServer())
      .post('/ratings')
      .set('Authorization', `Bearer ${token}`)
      .send({ movieId: 550, score: 5, comment: '좋아요' })
      .expect(201);

    expect(response.body.code).toBe('COMMON201');
    const saved = await ratingRepository.findOneBy({ ratingId: response.body.result });
    expect(saved).toMatchObject({ movieId: 550, score: 5, comment: '좋아요' });
  });
});
