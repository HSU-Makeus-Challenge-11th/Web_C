const assert = require('node:assert/strict');
const { after, before, beforeEach, mock, test } = require('node:test');
require('reflect-metadata');
const { NestFactory } = require('@nestjs/core');
const { DataSource, Repository, SelectQueryBuilder, QueryFailedError } = require('typeorm');
const { getRepositoryToken } = require('@nestjs/typeorm');
// 연결 자체는 대체하므로 테스트에 실제 DB 설정이나 실행 중인 MySQL이 필요하지 않습니다.
Object.assign(process.env, { DB_HOST: '127.0.0.1', DB_PORT: '3306', DB_USER: 'test', DB_PASSWORD: 'test', DB_NAME: 'test' });
const { AppModule } = require('../dist/app/app.module');
const { Book } = require('../dist/book/book.entity');
const { Category } = require('../dist/category/category.entity');
const { Rental } = require('../dist/rental/rental.entity');

let app;
let baseUrl;
let calls;
let databaseResult;
let databaseError;
let databaseResults;
let initialize;
let destroy;

async function executeOperation(call) {
  calls.push(call);
  if (databaseResults.length > 0) {
    const result = databaseResults.shift();
    if (result instanceof Error) throw result;
    return result;
  }
  if (databaseError) throw databaseError;
  assert.notEqual(databaseResult, undefined, 'Unexpected database request');
  return databaseResult;
}

before(async () => {
  // TypeORM 메타데이터와 QueryBuilder는 실제로 생성하고 DB 실행 경계만 대체합니다.
  initialize = mock.method(DataSource.prototype, 'initialize', async function () {
    await this.buildMetadatas();
    this.isInitialized = true;
    return this;
  });
  destroy = mock.method(DataSource.prototype, 'destroy', async function () {
    this.isInitialized = false;
  });
  mock.method(SelectQueryBuilder.prototype, 'getRawMany', async function () {
    const [sql, params] = this.getQueryAndParameters();
    return executeOperation({ operation: 'select', sql, params });
  });
  mock.method(Repository.prototype, 'existsBy', async function (where) {
    return executeOperation({ operation: 'exists', target: this.metadata.name, where });
  });
  mock.method(Repository.prototype, 'save', async function (data) {
    const result = await executeOperation({ operation: 'save', target: this.metadata.name, data });
    return { ...data, ...result };
  });
  mock.method(Repository.prototype, 'insert', async function (data) {
    return executeOperation({ operation: 'insert', target: this.metadata.name, data });
  });
  mock.method(Repository.prototype, 'update', async function (criteria, data) {
    return executeOperation({ operation: 'update', target: this.metadata.name, criteria, data });
  });
  app = await NestFactory.create(AppModule, { logger: false, abortOnError: false });
  assert.equal(initialize.mock.callCount(), 1, 'Feature modules must share one DataSource');
  await app.listen(0, '127.0.0.1');
  baseUrl = await app.getUrl();
});

after(async () => {
  if (app) await app.close();
  assert.equal(destroy.mock.callCount(), 1, 'Nest must close the shared DataSource');
  mock.restoreAll();
});

beforeEach(() => {
  calls = [];
  databaseResult = undefined;
  databaseError = undefined;
  databaseResults = [];
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

test('GET root remains registered through AppModule', async () => {
  const response = await fetch(`${baseUrl}/`);
  assert.equal(response.status, 200);
  assert.equal(await response.text(), 'Hello NestJS!');
  assert.equal(calls.length, 0);
});

test('feature modules inject real TypeORM repositories backed by one DataSource', () => {
  const source = app.get(DataSource);
  for (const entity of [Book, Category, Rental]) {
    const repository = app.get(getRepositoryToken(entity));
    assert.ok(repository instanceof Repository);
    assert.equal(repository.manager.connection, source);
    assert.equal(repository.metadata.target, entity);
  }
  assert.equal(source.entityMetadatas.length, 4);
  assert.equal(source.options.synchronize, false);
  assert.equal(source.options.dropSchema, false);
  assert.equal(source.options.migrationsRun, false);
});

test('GET books returns titles, category names and boolean availability', async () => {
  databaseResult = [
    { id: 4, title: '과학 도서', categoryName: '과학', activeRentalCount: 0 },
    { id: 3, title: '대여 중인 도서', categoryName: '과학', activeRentalCount: '2' },
  ];
  assert.deepEqual(await request('/books'), { status: 200, body: [
    { id: 4, title: '과학 도서', categoryName: '과학', isAvailable: true },
    { id: 3, title: '대여 중인 도서', categoryName: '과학', isAvailable: false },
  ] });
  assert.equal(calls.length, 1);
});

test('POST book validates the category and returns the generated ID with 201', async () => {
  databaseResults = [true, { id: 3 }];
  const response = await request('/books', 'POST', {
    title: '과학 도서', auth: '저자', categoryId: 2,
  });
  assert.equal(response.status, 201);
  assert.deepEqual(response.body, { bookId: 3, message: '도서 등록이 완료되었습니다!' });
  assert.deepEqual(calls[0], { operation: 'exists', target: 'Category', where: { id: 2 } });
  assert.equal(calls[1].operation, 'save');
  assert.ok(calls[1].data instanceof Book);
  assert.equal(calls[1].data.title, '과학 도서');
  assert.equal(calls[1].data.auth, '저자');
  assert.equal(calls[1].data.category_id, 2);
  assert.equal(calls[1].data.id, undefined);
  assert.equal(databaseResults.length, 0);
});

test('POST book trims text and keeps IDs generated by the database', async () => {
  databaseResults = [true, { id: 4 }];
  const response = await request('/books', 'POST', { title: '  과학 도서  ', auth: ' 저자 ', categoryId: 2 });
  assert.equal(response.status, 201);
  assert.deepEqual(response.body, { bookId: 4, message: '도서 등록이 완료되었습니다!' });
  assert.equal(calls[1].data.title, '과학 도서');
  assert.equal(calls[1].data.auth, '저자');
  assert.equal(calls[1].data.category_id, 2);
  assert.equal(calls[1].data.id, undefined);
});

test('POST book accepts 64-character titles and author names', async () => {
  databaseResults = [true, { id: 4 }];
  const body = { title: '가'.repeat(64), auth: '나'.repeat(64), categoryId: 2 };
  assert.equal((await request('/books', 'POST', body)).status, 201);
  assert.equal(calls[1].data.title, body.title);
  assert.equal(calls[1].data.auth, body.auth);
});

test('invalid book bodies fail validation before querying the database', async () => {
  const valid = { title: '과학 도서', auth: '저자', categoryId: 2 };
  for (const body of [
    undefined, {}, [], { title: '책' }, { auth: '저자' },
    ...[undefined, null, 1, true, [], {}, '', '   ', '가'.repeat(65)].map(title => ({ ...valid, title })),
    ...[undefined, null, 1, true, [], '', '  ', '가'.repeat(65)].map(auth => ({ ...valid, auth })),
    ...[undefined, null, 0, -1, 1.5, true, [], {}, '', ' ', '1e2', 2147483648].map(categoryId => ({ ...valid, categoryId })),
    { ...valid, id: 3 }, { ...valid, description: '설명' }, { ...valid, created_at: '2026-10-04' },
    { name: '과학 도서', auth: '저자', category_id: 2 },
    { ...valid, unexpected: 'field' },
  ]) {
    assert.equal((await request('/books', 'POST', body)).status, 400, JSON.stringify(body));
  }
  assert.equal(calls.length, 0);
});

test('book response DTOs exclude internal fields and entity relations', async () => {
  const book = { id: 3, title: '과학 도서', categoryName: null, isAvailable: true };
  databaseResult = [{ ...book, activeRentalCount: '0', auth: '저자', category_id: null, internal_note: 'private', category: null, rentals: [{ id: 1 }] }];
  for (const path of ['/books', '/books/category/2']) {
    assert.deepEqual(await request(path), { status: 200, body: [book] });
  }
});

test('GET category binds the path ID and returns the book rows', async () => {
  databaseResult = [{ id: 3, title: '과학 도서', categoryName: '과학', activeRentalCount: 1 }];
  const response = await request('/books/category/2');
  assert.equal(response.status, 200);
  assert.deepEqual(response.body, [{ id: 3, title: '과학 도서', categoryName: '과학', isAvailable: false }]);
  assert.deepEqual(calls.map(call => call.params), [[2]]);
});

test('GET category returns an empty array when there are no matching books', async () => {
  databaseResult = [];
  assert.deepEqual(await request('/books/category/999'), { status: 200, body: [] });
});

test('invalid category IDs return 400 without querying the database', async () => {
  for (const id of ['0', '-1', 'abc', '1.5', '1e2', '2147483648', '9007199254740992', '1%20OR%201=1']) {
    assert.equal((await request(`/books/category/${id}`)).status, 400, id);
  }
  assert.equal(calls.length, 0);
});

test('POST rental binds userId/bookId and returns the generated ID with 201', async () => {
  databaseResult = { identifiers: [{ id: 42 }] };
  const response = await request('/rentals', 'POST', { userId: 7, bookId: 3 });
  assert.equal(response.status, 201);
  assert.deepEqual(response.body, { rentalId: 42, message: '도서 대여가 완료되었습니다!' });
  assert.equal(calls[0].operation, 'insert');
  assert.equal(calls[0].target, 'Rental');
  assert.equal(calls[0].data.user_id, 7);
  assert.equal(calls[0].data.book_id, 3);
  assert.equal(calls[0].data.returned_at, null);
});

test('digit-only body IDs are converted to numbers', async () => {
  databaseResult = { identifiers: [{ id: 42 }] };
  assert.equal((await request('/rentals', 'POST', { userId: '7', bookId: '3' })).status, 201);
  databaseResults = [true, { id: 4 }];
  assert.equal((await request('/books', 'POST', {
    title: '과학 도서', auth: '저자', categoryId: '2',
  })).status, 201);
  assert.equal(calls[0].data.user_id, 7);
  assert.equal(calls[0].data.book_id, 3);
  assert.deepEqual(calls[1].where, { id: 2 });
  assert.equal(calls[2].data.category_id, 2);
});

test('POST book rejects a missing category without inserting a book', async () => {
  databaseResults = [false];
  const response = await request('/books', 'POST', { title: '도서', auth: '저자', categoryId: 999 });
  assert.equal(response.status, 404);
  assert.equal(response.body.message, '카테고리를 찾을 수 없습니다.');
  assert.deepEqual(calls, [{ operation: 'exists', target: 'Category', where: { id: 999 } }]);
});

test('POST book handles a category removed after the existence check', async () => {
  databaseResults = [true, new QueryFailedError('INSERT', [], Object.assign(new Error('Foreign key violation'), {
    code: 'ER_NO_REFERENCED_ROW_2',
  }))];
  const response = await request('/books', 'POST', { title: '도서', auth: '저자', categoryId: 2 });
  assert.equal(response.status, 404);
  assert.equal(response.body.message, '카테고리를 찾을 수 없습니다.');
  assert.equal(calls.length, 2);
});

test('POST book preserves unexpected database failures as generic 500 responses', async () => {
  databaseResults = [true, new Error('Private database details')];
  const response = await request('/books', 'POST', { title: '도서', auth: '저자', categoryId: 2 });
  assert.equal(response.status, 500);
  assert.equal(response.body.message, 'Internal server error');
});

test('missing or malformed rental body IDs return 400 before database access', async () => {
  for (const body of [
    undefined, {}, [], { userId: 1 }, { bookId: 1 },
    { userId: 0, bookId: 1 }, { userId: 1, bookId: -1 },
    { userId: 1.5, bookId: 1 }, { userId: 1, bookId: null },
    { userId: true, bookId: 1 }, { userId: [], bookId: 1 },
    { userId: {}, bookId: 1 }, { userId: '1 OR 1=1', bookId: 1 },
    { userId: '1e2', bookId: 1 }, { userId: ' ', bookId: 1 },
    { userId: 1, bookId: 2147483648 },
    { userId: 1, bookId: 9007199254740992 },
    { userId: 1, bookId: 3, rented_at: '2026-10-01' },
    { userId: 1, bookId: 3, unexpected: 'field' },
  ]) {
    assert.equal((await request('/rentals', 'POST', body)).status, 400, JSON.stringify(body));
  }
  assert.equal(calls.length, 0);
});

test('foreign key violations return 400 with a useful message', async () => {
  databaseError = new QueryFailedError('INSERT', [], Object.assign(new Error('Foreign key violation'), {
    code: 'ER_NO_REFERENCED_ROW_2',
  }));
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
  databaseResult = { affected: 1 };
  const response = await request('/rentals/42/return', 'PATCH');
  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { rentalId: 42, message: '도서 반납이 완료되었습니다!' });
  assert.equal(calls[0].operation, 'update');
  assert.equal(calls[0].target, 'Rental');
  assert.deepEqual(calls[0].criteria, { id: 42 });
});

test('PATCH return reports 404 for a missing rental', async () => {
  databaseResult = { affected: 0 };
  const response = await request('/rentals/999/return', 'PATCH');
  assert.equal(response.status, 404);
  assert.equal(response.body.message, '대여 기록을 찾을 수 없습니다.');
});

test('invalid rental IDs return 400 without updating the database', async () => {
  for (const id of ['0', '-1', 'abc', '1.5', '1e2', '2147483648', '9007199254740992']) {
    assert.equal((await request(`/rentals/${id}/return`, 'PATCH')).status, 400, id);
  }
  assert.equal(calls.length, 0);
});
