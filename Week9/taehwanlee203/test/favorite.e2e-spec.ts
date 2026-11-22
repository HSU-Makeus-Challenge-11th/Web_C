// test/favorite.e2e-spec.ts
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { Repository } from 'typeorm';
import { FavoriteController } from '../src/controller/favorite.controller.js';
import { Favorite } from '../src/entity/favorite.entity.js';
import { Member } from '../src/entity/member.entity.js';
import { HttpExceptionFilter } from '../src/filter/http-exception.filter.js';
import { FavoriteService } from '../src/service/favorite.service.js';


describe('즐겨찾기 API (통합 테스트)', () => {
  let app: INestApplication;
  let memberRepository: Repository<Member>;
  let favoriteRepository: Repository<Favorite>;
  let member: Member;
  let authorization: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        // 개발용 MySQL 대신, 테스트가 돌 때만 메모리 위에 만들어지는 DB를 씁니다.
        // 테스트가 끝나면 흔적 없이 사라지므로 개발 DB의 데이터를 건드리지 않습니다.
        TypeOrmModule.forRoot({
          type: 'sqljs',
          autoSave: false,
          entities: [Member, Favorite],
          synchronize: true, // 엔티티를 보고 테이블을 만들어줍니다
        }),
        TypeOrmModule.forFeature([Member, Favorite]),
        JwtModule.register({
          global: true,
          secret: 'test-secret-for-e2e-only',
          signOptions: { expiresIn: 3600 },
        }),
      ],
      controllers: [FavoriteController],
      providers: [FavoriteService],
    }).compile();

    app = moduleFixture.createNestApplication();

    // main.ts에 붙인 전역 설정은 테스트 앱에 자동으로 따라오지 않습니다.
    // 여기서 다시 붙여야 검증 실패 400과 우리 형식의 오류 응답이 똑같이 나옵니다.
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();

    memberRepository = moduleFixture.get(getRepositoryToken(Member));
    favoriteRepository = moduleFixture.get(getRepositoryToken(Favorite));

    // 로그인한 회원이 있어야 하므로 회원을 한 명 저장하고 토큰을 직접 발급합니다.
    member = await memberRepository.save(
      memberRepository.create({
        email: 'challenger@umc.com',
        password: '$2b$10$abcdefghijklmnopqrstuv', // 로그인 API를 거치지 않으므로 아무 값이나 괜찮습니다
        nickname: '영화조아',
      }),
    );

    const jwtService = moduleFixture.get(JwtService);
    const token = jwtService.sign({
      sub: String(member.memberId),
      email: member.email,
    });
    authorization = `Bearer ${token}`;
  });

  beforeEach(async () => {
    // 앞 테스트가 남긴 즐겨찾기를 지워서, 테스트끼리 서로 영향을 주지 않게 합니다.
    await favoriteRepository.clear();
  });

  afterAll(async () => {
    await app.close();
  });

  it('토큰 없이 즐겨찾기를 등록하면 401과 AUTH401_2를 응답한다', async () => {
    const response = await request(app.getHttpServer())
      .post('/favorites')
      .send({ movieId: 550 })
      .expect(401);

    expect(response.body.isSuccess).toBe(false);
    expect(response.body.code).toBe('AUTH401_2');
  });

  it('토큰을 담아 즐겨찾기를 등록하면 201과 저장된 영화 ID를 응답한다', async () => {
    const response = await request(app.getHttpServer())
      .post('/favorites')
      .set('Authorization', authorization)
      .send({ movieId: 550 })
      .expect(201);

    expect(response.body.code).toBe('COMMON201');
    expect(response.body.result.movieId).toBe(550);
  });

  it('이미 즐겨찾기한 영화를 다시 등록하면 409와 FAVORITE409_1을 응답한다', async () => {
    await favoriteRepository.save(
      favoriteRepository.create({ member, movieId: 550 }),
    );

    const response = await request(app.getHttpServer())
      .post('/favorites')
      .set('Authorization', authorization)
      .send({ movieId: 550 })
      .expect(409);

    expect(response.body.code).toBe('FAVORITE409_1');
  });

  it('즐겨찾기하지 않은 영화의 여부를 조회하면 200과 isFavorite false를 응답한다', async () => {
    const response = await request(app.getHttpServer())
      .get('/favorites/550')
      .set('Authorization', authorization)
      .expect(200);

    expect(response.body.result.isFavorite).toBe(false);
  });
});
