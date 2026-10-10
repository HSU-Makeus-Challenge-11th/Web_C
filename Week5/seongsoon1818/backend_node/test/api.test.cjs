const { test, before, after, beforeEach, mock } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { Test } = require('@nestjs/testing');
const { getRepositoryToken } = require('@nestjs/typeorm');
const { MemberController } = require('../dist/controller/member.controller');
const { RatingController } = require('../dist/controller/rating.controller');
const { MemberService } = require('../dist/service/member.service');
const { RatingService } = require('../dist/service/rating.service');
const { Member } = require('../dist/entity/member.entity');
const { Rating } = require('../dist/entity/rating.entity');
const { configureApp } = require('../dist/configure-app');

const ratings = Array.from({ length: 23 }, (_, index) => ({
  ratingId: 23 - index, movieId: 100 + index, score: 4,
  comment: null, createdAt: new Date('2026-10-10'), updatedAt: new Date('2026-10-10'),
  member: { memberId: 1, password: 'not-for-the-response' },
}));
const members = {
  exists: mock.fn(async ({ where }) => where.nickname === 'taken' || where.email === 'taken@example.com'),
  findOneBy: mock.fn(async ({ memberId }) => [1, 2].includes(memberId) ? { memberId } : null),
};
const ratingRepository = {
  findAndCount: mock.fn(async ({ where, skip, take, order }) => {
    assert.deepEqual(order, { ratingId: 'DESC' });
    const source = where.member.memberId === 1 ? ratings : [];
    return [source.slice(skip, skip + take), source.length];
  }),
};
async function createApp(origin) {
  const module = await Test.createTestingModule({
    controllers: [MemberController, RatingController],
    providers: [MemberService, RatingService,
      { provide: getRepositoryToken(Member), useValue: members },
      { provide: getRepositoryToken(Rating), useValue: ratingRepository },
    ],
  }).compile();
  const app = module.createNestApplication({ logger: false });
  configureApp(app, origin);
  await app.init();
  return app;
}
let app;
before(async () => { app = await createApp('http://localhost:5173'); });
after(async () => { await app?.close(); });
beforeEach(() => {
  members.exists.mock.resetCalls();
  members.findOneBy.mock.resetCalls();
  ratingRepository.findAndCount.mock.resetCalls();
});

test('nickname boundaries and email availability', async () => {
  for (const nickname of ['ab', 'abcdefghijkl', '가나다']) {
    await request(app.getHttpServer()).get(`/members/nickname/${encodeURIComponent(nickname)}`)
      .expect(200, { available: true });
  }
  await request(app.getHttpServer()).get('/members/nickname/taken').expect(200, { available: false });
  await request(app.getHttpServer()).get('/members/email/new%40example.com').expect(200, { available: true });
  await request(app.getHttpServer()).get('/members/email/taken%40example.com').expect(200, { available: false });
});

test('invalid nickname/email returns 400 before any availability query', async () => {
  for (const url of ['/members/nickname/a', '/members/nickname/abcdefghijklm',
    '/members/email/not-an-email', '/members/email/a%40', '/members/email/a%20b%40example.com']) {
    const response = await request(app.getHttpServer()).get(url).expect(400);
    assert.equal(response.body.statusCode, 400);
    assert.ok(response.body.message.length);
  }
  assert.equal(members.exists.mock.callCount(), 0);
});

test('pagination defaults, next page, final page, and DTO privacy', async () => {
  const first = (await request(app.getHttpServer()).get('/members/1/ratings').expect(200)).body;
  assert.equal(first.items.length, 10);
  assert.deepEqual([first.page, first.size, first.totalItems, first.totalPages, first.hasNext, first.hasPrevious],
    [0, 10, 23, 3, true, false]);
  assert.equal(first.items[0].ratingId, 23);
  assert.equal('member' in first.items[0], false);
  const second = (await request(app.getHttpServer()).get('/members/1/ratings?page=1&size=10').expect(200)).body;
  assert.equal(second.items[0].ratingId, 13);
  assert.ok(first.items.every((a) => second.items.every((b) => a.ratingId !== b.ratingId)));
  const last = (await request(app.getHttpServer()).get('/members/1/ratings?page=2&size=10').expect(200)).body;
  assert.deepEqual([last.items.length, last.hasNext, last.hasPrevious], [3, false, true]);
});

test('empty member ratings and out-of-range pages return an empty list', async () => {
  const empty = (await request(app.getHttpServer()).get('/members/2/ratings').expect(200)).body;
  assert.deepEqual([empty.items, empty.totalItems, empty.totalPages, empty.hasNext], [[], 0, 0, false]);
  const past = (await request(app.getHttpServer()).get('/members/1/ratings?page=99&size=10').expect(200)).body;
  assert.deepEqual([past.items, past.totalItems, past.hasNext], [[], 23, false]);
});

test('invalid pagination is rejected before database queries', async () => {
  for (const query of ['page=-1', 'page=1.5', 'page=no', 'page=', 'page=0&page=1',
    'size=0', 'size=101', 'size=-1', 'size=1.5', 'size=', 'size=1e1',
    'page=9007199254740992', 'page=9007199254740991&size=100']) {
    await request(app.getHttpServer()).get(`/members/1/ratings?${query}`).expect(400);
  }
  assert.equal(members.findOneBy.mock.callCount(), 0);
  assert.equal(ratingRepository.findAndCount.mock.callCount(), 0);
});

test('missing member returns 404; malformed member ID returns 400', async () => {
  await request(app.getHttpServer()).get('/members/999/ratings').expect(404);
  await request(app.getHttpServer()).get('/members/abc/ratings').expect(400);
  assert.equal(ratingRepository.findAndCount.mock.callCount(), 0);
});

test('CORS permits the exact origin and omits permission for other origins', async () => {
  const allowed = await request(app.getHttpServer()).get('/members/nickname/demo')
    .set('Origin', 'http://localhost:5173').expect(200);
  assert.equal(allowed.headers['access-control-allow-origin'], 'http://localhost:5173');
  for (const origin of ['http://127.0.0.1:5173', 'http://localhost:5174', 'https://localhost:5173']) {
    const denied = await request(app.getHttpServer()).get('/members/nickname/demo').set('Origin', origin).expect(200);
    assert.equal(denied.headers['access-control-allow-origin'], undefined);
  }
  const invalid = await request(app.getHttpServer()).get('/members/nickname/x')
    .set('Origin', 'http://localhost:5173').expect(400);
  assert.equal(invalid.headers['access-control-allow-origin'], 'http://localhost:5173');
  const preflight = await request(app.getHttpServer()).options('/members/1/ratings')
    .set('Origin', 'http://localhost:5173').set('Access-Control-Request-Method', 'GET').expect(204);
  assert.equal(preflight.headers['access-control-allow-methods'], 'GET');
});

test('wildcard CORS grants browser read access to any origin without credentials', async () => {
  const wildcard = await createApp('*');
  try {
    const response = await request(wildcard.getHttpServer()).get('/members/nickname/demo')
      .set('Origin', 'http://127.0.0.1:5173').expect(200);
    assert.equal(response.headers['access-control-allow-origin'], '*');
    assert.equal(response.headers['access-control-allow-credentials'], undefined);
  } finally { await wildcard.close(); }
});
