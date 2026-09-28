const assert = require('node:assert/strict');
const { after, before, beforeEach, test } = require('node:test');
require('reflect-metadata');
const { Module } = require('@nestjs/common');
const { NestFactory } = require('@nestjs/core');
const { BookController } = require('../dist/book.controller');
const { BookService } = require('../dist/book.service');
const { BookRepository } = require('../dist/book.repository');
const { RentalController } = require('../dist/rental.controller');
const { RentalService } = require('../dist/rental.service');
const { RentalRepository } = require('../dist/rental.repository');
const { DATABASE_CONNECTION } = require('../dist/database.provider');

let app;
let baseUrl;
let calls;
let databaseResult;
let databaseError;

class ApiTestModule {}
Module({
  controllers: [BookController, RentalController],
  providers: [
    BookService, BookRepository, RentalService, RentalRepository,
    {
      provide: DATABASE_CONNECTION,
      useValue: {
        async execute(sql, params) {
          calls.push({ sql, params });
          if (databaseError) throw databaseError;
          assert.notEqual(databaseResult, undefined, 'Unexpected database request');
          return [databaseResult, []];
        },
      },
    },
  ],
})(ApiTestModule);

before(async () => {
  app = await NestFactory.create(ApiTestModule, { logger: false });
  await app.listen(0, '127.0.0.1');
  baseUrl = await app.getUrl();
});

after(async () => {
  if (app) await app.close();
});

beforeEach(() => {
  calls = [];
  databaseResult = undefined;
  databaseError = undefined;
});

async function request(path, method = 'GET', body) {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    ...(body === undefined ? {} : {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
  });
  return { status: response.status, body: await response.json() };
}

test('GET category binds the path ID and returns the book rows', async () => {
  databaseResult = [{ id: 3, category_id: 2, name: '과학 도서', auth: '저자' }];
  const response = await request('/books/category/2');
  assert.equal(response.status, 200);
  assert.deepEqual(response.body, databaseResult);
  assert.deepEqual(calls.map(call => call.params), [[2]]);
});

test('GET category returns an empty array when there are no matching books', async () => {
  databaseResult = [];
  assert.deepEqual(await request('/books/category/999'), { status: 200, body: [] });
});

test('invalid category IDs return 400 without querying the database', async () => {
  for (const id of ['0', '-1', 'abc', '1.5', '1e2', '9007199254740992', '1%20OR%201=1']) {
    assert.equal((await request(`/books/category/${id}`)).status, 400, id);
  }
  assert.equal(calls.length, 0);
});

test('POST rental binds userId/bookId and returns the generated ID with 201', async () => {
  databaseResult = { insertId: 42, affectedRows: 1 };
  const response = await request('/rentals', 'POST', { userId: 7, bookId: 3 });
  assert.equal(response.status, 201);
  assert.deepEqual(response.body, { rentalId: 42, message: '도서 대여가 완료되었습니다!' });
  assert.deepEqual(calls.map(call => call.params), [[7, 3]]);
});

test('missing or malformed rental body IDs return 400 before database access', async () => {
  for (const body of [
    undefined, {}, [], { userId: 1 }, { bookId: 1 },
    { userId: 0, bookId: 1 }, { userId: 1, bookId: -1 },
    { userId: 1.5, bookId: 1 }, { userId: 1, bookId: null },
    { userId: true, bookId: 1 }, { userId: [], bookId: 1 },
    { userId: {}, bookId: 1 }, { userId: '1 OR 1=1', bookId: 1 },
    { userId: 1, bookId: 9007199254740992 },
  ]) {
    assert.equal((await request('/rentals', 'POST', body)).status, 400, JSON.stringify(body));
  }
  assert.equal(calls.length, 0);
});

test('foreign key violations return 400 with a useful message', async () => {
  databaseError = Object.assign(new Error('Foreign key violation'), {
    code: 'ER_NO_REFERENCED_ROW_2',
  });
  const response = await request('/rentals', 'POST', { userId: 999, bookId: 3 });
  assert.equal(response.status, 400);
  assert.equal(response.body.message, '등록된 userId와 bookId인지 확인해주세요.');
});

test('unexpected database failures return 500 without exposing database details', async () => {
  databaseError = new Error('Private database connection details');
  const response = await request('/rentals', 'POST', { userId: 1, bookId: 3 });
  assert.equal(response.status, 500);
  assert.equal(response.body.message, 'Internal server error');
});

test('PATCH return binds the rental ID and reports success', async () => {
  databaseResult = { affectedRows: 1 };
  const response = await request('/rentals/42/return', 'PATCH');
  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { rentalId: 42, message: '도서 반납이 완료되었습니다!' });
  assert.deepEqual(calls.map(call => call.params), [[42]]);
});

test('PATCH return reports 404 for a missing rental', async () => {
  databaseResult = { affectedRows: 0 };
  const response = await request('/rentals/999/return', 'PATCH');
  assert.equal(response.status, 404);
  assert.equal(response.body.message, '대여 기록을 찾을 수 없습니다.');
});

test('invalid rental IDs return 400 without updating the database', async () => {
  for (const id of ['0', '-1', 'abc', '1.5', '9007199254740992']) {
    assert.equal((await request(`/rentals/${id}/return`, 'PATCH')).status, 400, id);
  }
  assert.equal(calls.length, 0);
});
