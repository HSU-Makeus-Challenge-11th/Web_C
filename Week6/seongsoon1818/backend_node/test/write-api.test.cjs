const { test, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const bcrypt = require('bcrypt');
const { Test } = require('@nestjs/testing');
const { getRepositoryToken } = require('@nestjs/typeorm');
const { QueryFailedError } = require('typeorm');
const { MemberController } = require('../dist/controller/member.controller');
const { RatingController } = require('../dist/controller/rating.controller');
const { MemberService } = require('../dist/service/member.service');
const { RatingService } = require('../dist/service/rating.service');
const { Member } = require('../dist/entity/member.entity');
const { Rating } = require('../dist/entity/rating.entity');
const { configureApp } = require('../dist/configure-app');

let memberRows;
let ratingRows;
let memberSaveError;
let ratingSaveError;
let app;
const signup = { email: 'new@example.com', nickname: 'newuser', password: 'ValidPass1!' };
const memberRepository = {
  findOneBy: async (where) => memberRows.find((member) => Object.entries(where).every(([key, value]) => member[key] === value)) ?? null,
  create: (value) => ({ ...value }),
  save: async (value) => {
    if (memberSaveError) throw memberSaveError;
    const saved = { ...value, memberId: memberRows.length + 1 };
    memberRows.push(saved);
    return saved;
  },
};
const ratingRepository = {
  findOne: async ({ where }) => ratingRows.find((rating) => where.ratingId !== undefined
    ? rating.ratingId === where.ratingId
    : rating.member.memberId === where.member.memberId && rating.movieId === where.movieId) ?? null,
  create: (value) => ({ ...value }),
  save: async (value) => {
    if (ratingSaveError) throw ratingSaveError;
    if (value.ratingId) return value;
    const saved = { ...value, ratingId: ratingRows.length + 1 };
    ratingRows.push(saved);
    return saved;
  },
  remove: async (value) => { ratingRows = ratingRows.filter((rating) => rating.ratingId !== value.ratingId); },
};

function expectFailure(response, status, code, message) {
  assert.equal(response.status, status);
  assert.deepEqual(response.body, { isSuccess: false, code, message, result: null });
}

function uniqueError(key, value = 'private-value') {
  const sqlMessage = `Duplicate entry '${value}' for key '${key}'`;
  return new QueryFailedError('INSERT INTO table VALUES (?)', ['private-parameter'],
    Object.assign(new Error(sqlMessage), { code: 'ER_DUP_ENTRY', errno: 1062, sqlMessage }));
}

before(async () => {
  const module = await Test.createTestingModule({
    controllers: [MemberController, RatingController],
    providers: [MemberService, RatingService,
      { provide: getRepositoryToken(Member), useValue: memberRepository },
      { provide: getRepositoryToken(Rating), useValue: ratingRepository }],
  }).compile();
  app = module.createNestApplication({ logger: false });
  configureApp(app);
  await app.init();
});
after(async () => { await app?.close(); });
beforeEach(() => {
  memberRows = [
    { memberId: 1, email: 'taken@example.com', nickname: 'taken' },
    { memberId: 2, email: 'other@example.com', nickname: 'other' },
  ];
  ratingRows = [{ ratingId: 1, movieId: 550, member: memberRows[0], score: 3, comment: 'original review' }];
  memberSaveError = null;
  ratingSaveError = null;
});

test('signup returns 201, stores bcrypt with independent salts, and omits the password', async () => {
  const first = await request(app.getHttpServer()).post('/members').send(signup).expect(201);
  assert.deepEqual(first.body, {
    isSuccess: true, code: 'COMMON201', message: '회원가입에 성공했습니다.',
    result: { memberId: 3, email: signup.email, nickname: signup.nickname },
  });
  const hash = memberRows[2].password;
  assert.notEqual(hash, signup.password);
  assert.equal(bcrypt.getRounds(hash), 10);
  assert.equal(await bcrypt.compare(signup.password, hash), true);
  await request(app.getHttpServer()).post('/members').send({ ...signup, email: 'second@example.com', nickname: 'second' }).expect(201);
  assert.notEqual(memberRows[3].password, hash);
});

test('signup validates email, nickname, password strength and UTF-8 byte length before saving', async () => {
  for (const override of [
    { email: 'invalid' }, { nickname: 'a' }, { nickname: 'a'.repeat(13) },
    { password: 'short' }, { password: 'lowercase123!' }, { password: 'UPPERCASE123!' },
    { password: 'NoDigitsHere!' }, { password: 'NoSymbol123' },
    { password: 'Aa1!' + 'x'.repeat(69) }, { password: 'Aa1!' + '가'.repeat(23) },
  ]) {
    const response = await request(app.getHttpServer()).post('/members').send({ ...signup, ...override });
    assert.equal(response.status, 400);
    assert.equal(response.body.code, 'COMMON400');
    assert.equal(response.body.isSuccess, false);
    assert.equal(typeof response.body.message, 'string');
    assert.equal(response.body.result, null);
  }
  assert.equal(memberRows.length, 2);
  await request(app.getHttpServer()).post('/members').send({ ...signup, password: 'Aa1!' + 'x'.repeat(68) }).expect(201);
});

test('duplicate email and nickname have distinct codes and messages', async () => {
  expectFailure(await request(app.getHttpServer()).post('/members').send({ ...signup, email: 'taken@example.com' }),
    409, 'MEMBER_EMAIL_DUPLICATE', '이미 사용 중인 이메일입니다.');
  expectFailure(await request(app.getHttpServer()).post('/members').send({ ...signup, nickname: 'taken' }),
    409, 'MEMBER_NICKNAME_DUPLICATE', '이미 사용 중인 닉네임입니다.');
  assert.equal(memberRows.length, 2);
});

test('DB email/nickname UNIQUE violations match the precheck response even with qualified keys', async () => {
  for (const [key, code, message] of [
    ['email', 'MEMBER_EMAIL_DUPLICATE', '이미 사용 중인 이메일입니다.'],
    ['member.email', 'MEMBER_EMAIL_DUPLICATE', '이미 사용 중인 이메일입니다.'],
    ['nickname', 'MEMBER_NICKNAME_DUPLICATE', '이미 사용 중인 닉네임입니다.'],
    ['database.member.nickname', 'MEMBER_NICKNAME_DUPLICATE', '이미 사용 중인 닉네임입니다.'],
  ]) {
    memberSaveError = uniqueError(key, "email for key 'email'");
    expectFailure(await request(app.getHttpServer()).post('/members').send(signup), 409, code, message);
  }
  assert.equal(memberRows.length, 2);
});

test('an unknown unique key still returns a sanitized conflict envelope', async () => {
  memberSaveError = uniqueError('future_unique_key');
  expectFailure(await request(app.getHttpServer()).post('/members').send(signup),
    409, 'DATA_DUPLICATE', '이미 존재하는 데이터입니다.');
});

test('numeric MySQL duplicate code and message fallback are supported', async () => {
  memberSaveError = new QueryFailedError('INSERT', [], Object.assign(
    new Error("Duplicate entry 'private-value' for key 'member.email'"), { errno: 1062 },
  ));
  expectFailure(await request(app.getHttpServer()).post('/members').send(signup),
    409, 'MEMBER_EMAIL_DUPLICATE', '이미 사용 중인 이메일입니다.');
});

test('other database failures remain 500 without leaking SQL or parameters', async () => {
  memberSaveError = new QueryFailedError('SECRET SQL', ['private-password'],
    Object.assign(new Error('private database detail'), { code: 'ER_BAD_FIELD_ERROR', errno: 1054 }));
  expectFailure(await request(app.getHttpServer()).post('/members').send(signup),
    500, 'COMMON500', '서버 내부 오류가 발생했습니다.');
});

test('rating creation returns its ID and 201, including an optional comment', async () => {
  const response = await request(app.getHttpServer()).post('/members/1/ratings').send({ movieId: 155, score: 4 }).expect(201);
  assert.deepEqual(response.body, { isSuccess: true, code: 'COMMON201', message: '평점 등록에 성공했습니다.', result: 2 });
  assert.equal(ratingRows[1].member.memberId, 1);
  assert.equal(ratingRows[1].comment, null);
});

test('duplicate rating precheck and DB UNIQUE violation have the same response', async () => {
  expectFailure(await request(app.getHttpServer()).post('/members/1/ratings').send({ movieId: 550, score: 5 }),
    409, 'RATING_DUPLICATE', '이미 이 영화에 평점을 남기셨습니다.');
  ratingSaveError = uniqueError('rating.uk_rating_member_movie');
  expectFailure(await request(app.getHttpServer()).post('/members/1/ratings').send({ movieId: 155, score: 5 }),
    409, 'RATING_DUPLICATE', '이미 이 영화에 평점을 남기셨습니다.');
  assert.equal(ratingRows.length, 1);
});

test('invalid scores and long comments return the same 400 envelope for POST and PATCH', async () => {
  for (const score of [0, 6, 1.5, '4', null]) {
    for (const method of ['post', 'patch']) {
      const url = method === 'post' ? '/members/1/ratings' : '/members/1/ratings/1';
      const body = method === 'post' ? { movieId: 155, score } : { score };
      const response = await request(app.getHttpServer())[method](url).send(body).expect(400);
      assert.equal(response.body.code, 'COMMON400');
      assert.equal(response.body.isSuccess, false);
      assert.equal(response.body.result, null);
      assert.equal(typeof response.body.message, 'string');
    }
  }
  await request(app.getHttpServer()).post('/members/1/ratings').send({ movieId: 155, score: 5, comment: 'x'.repeat(501) }).expect(400);
  assert.equal(ratingRows.length, 1);
  assert.equal(ratingRows[0].score, 3);
});

test('owner can PATCH; omitted comment is preserved and explicit null clears it', async () => {
  const response = await request(app.getHttpServer()).patch('/members/1/ratings/1').send({ score: 5 }).expect(200);
  assert.deepEqual(response.body, { isSuccess: true, code: 'COMMON200', message: '평점 수정에 성공했습니다.', result: null });
  assert.equal(ratingRows[0].score, 5);
  assert.equal(ratingRows[0].comment, 'original review');
  await request(app.getHttpServer()).patch('/members/1/ratings/1').send({ score: 4, comment: 'updated review' }).expect(200);
  assert.equal(ratingRows[0].comment, 'updated review');
  await request(app.getHttpServer()).patch('/members/1/ratings/1').send({ score: 4, comment: null }).expect(200);
  assert.equal(ratingRows[0].comment, null);
});

test('another member receives 403 for PATCH and DELETE without changing data', async () => {
  expectFailure(await request(app.getHttpServer()).patch('/members/2/ratings/1').send({ score: 5 }),
    403, 'COMMON403', '본인이 작성한 평점만 수정하거나 삭제할 수 있습니다.');
  expectFailure(await request(app.getHttpServer()).delete('/members/2/ratings/1'),
    403, 'COMMON403', '본인이 작성한 평점만 수정하거나 삭제할 수 있습니다.');
  assert.equal(ratingRows[0].score, 3);
  assert.equal(ratingRows.length, 1);
});

test('missing ratings receive 404 for PATCH and DELETE', async () => {
  expectFailure(await request(app.getHttpServer()).patch('/members/1/ratings/999').send({ score: 5 }),
    404, 'COMMON404', '존재하지 않는 평점입니다.');
  expectFailure(await request(app.getHttpServer()).delete('/members/1/ratings/999'),
    404, 'COMMON404', '존재하지 않는 평점입니다.');
});

test('owner can DELETE with a 200 JSON response; a repeated deletion returns 404', async () => {
  const response = await request(app.getHttpServer()).delete('/members/1/ratings/1').expect(200);
  assert.deepEqual(response.body, { isSuccess: true, code: 'COMMON200', message: '평점 삭제에 성공했습니다.', result: null });
  assert.equal(ratingRows.length, 0);
  await request(app.getHttpServer()).delete('/members/1/ratings/1').expect(404);
});
