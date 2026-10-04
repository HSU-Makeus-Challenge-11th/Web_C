const assert = require('node:assert/strict');
const { test } = require('node:test');
const { createHash } = require('node:crypto');
require('reflect-metadata');
const { NestFactory } = require('@nestjs/core');
const { ConfigModule, ConfigService } = require('@nestjs/config');
const { DataSource } = require('typeorm');
const mysql = require('mysql2/promise');
const { AppModule } = require('../dist/app/app.module');
const { createDatabaseOptions } = require('../dist/database/database.config');
const { Book } = require('../dist/book/book.entity');
const { Category } = require('../dist/category/category.entity');
const { Rental } = require('../dist/rental/rental.entity');
const { BookRepository } = require('../dist/book/book.repository');
const { CategoryRepository } = require('../dist/category/category.repository');
const { RentalRepository } = require('../dist/rental/rental.repository');

// 감사용 연결은 영구 테이블을 조회만 합니다. 내용은 로그에 출력하지 않습니다.
async function snapshot(connection) {
  const result = {};
  for (const table of ['book', 'category', 'user', 'rental']) {
    const [schema] = await connection.query(`SHOW CREATE TABLE \`${table}\``);
    const [rows] = await connection.query(`SELECT * FROM \`${table}\` ORDER BY id`);
    result[table] = createHash('sha256').update(JSON.stringify({ schema, rows })).digest('hex');
  }
  return result;
}

test('real MySQL: ORM queries and writes preserve the permanent schema and data', { timeout: 30000 }, async () => {
  await ConfigModule.envVariablesLoaded;
  const options = createDatabaseOptions(new ConfigService());
  const audit = await mysql.createConnection({
    host: options.host, port: options.port, user: options.username,
    password: options.password, database: options.database,
  });
  let before;
  let app;
  let runner;
  try {
    before = await snapshot(audit);
    app = await NestFactory.create(AppModule, { logger: false, abortOnError: false });
    const source = app.get(DataSource);
    assert.equal(source.isInitialized, true);
    await app.listen(0, '127.0.0.1');
    const baseUrl = await app.getUrl();

    // 실제 HTTP 목록 응답을 기존 데이터와 비교합니다. 쓰기 API는 호출하지 않습니다.
    const [storedBooks] = await audit.query('SELECT id, name, category_id FROM book ORDER BY id DESC');
    const [storedCategories] = await audit.query('SELECT id, name FROM category');
    const [activeRentals] = await audit.query('SELECT book_id FROM rental WHERE returned_at IS NULL');
    const names = new Map(storedCategories.map(c => [c.id, c.name]));
    const unavailable = new Set(activeRentals.map(r => r.book_id));
    const expected = storedBooks.map(b => ({
      id: b.id, title: b.name, categoryName: names.get(b.category_id) ?? null,
      isAvailable: !unavailable.has(b.id),
    }));
    const response = await fetch(`${baseUrl}/books`, { signal: AbortSignal.timeout(5000) });
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), expected);

    // 전용 연결의 임시 테이블에만 씁니다. 기존 영구 테이블과는 독립적입니다.
    runner = source.createQueryRunner();
    await runner.connect();
    await runner.query('CREATE TEMPORARY TABLE category (id INT PRIMARY KEY, name VARCHAR(64) NOT NULL)');
    await runner.query('CREATE TEMPORARY TABLE book (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(64) NOT NULL, auth VARCHAR(64) NOT NULL, category_id INT NULL)');
    await runner.query('CREATE TEMPORARY TABLE rental (id INT PRIMARY KEY AUTO_INCREMENT, user_id INT NOT NULL, book_id INT NOT NULL, rented_at DATETIME NOT NULL, due_at DATETIME NOT NULL, returned_at DATETIME NULL)');
    // 세 임시 테이블이 모두 생성된 후에만 테스트 데이터를 넣습니다.
    await runner.query("INSERT INTO category VALUES (1, 'science'), (2, 'history')");
    await runner.query("INSERT INTO book VALUES (3,'mixed','author',1),(1,'never rented','author',1),(5,'uncategorized','author',NULL),(2,'returned','author',2),(4,'multiple returns','author',2)");
    await runner.query("INSERT INTO rental VALUES (1,1,2,NOW(),NOW(),NOW()),(2,1,3,NOW(),NOW(),NOW()),(3,1,3,NOW(),NOW(),NULL),(4,1,4,NOW(),NOW(),NOW()),(5,1,4,NOW(),NOW(),NOW()),(6,1,3,NOW(),NOW(),NULL)");

    const books = new BookRepository(runner.manager.getRepository(Book));
    const categories = new CategoryRepository(runner.manager.getRepository(Category));
    const rentals = new RentalRepository(runner.manager.getRepository(Rental));
    const listed = await books.findAll();
    assert.deepEqual(listed.map(b => b.id), [5, 4, 3, 2, 1]);
    assert.deepEqual(listed.map(b => b.isAvailable), [true, true, false, true, true]);
    assert.deepEqual(listed.map(b => b.categoryName), [null, 'history', 'science', 'history', 'science']);
    assert.deepEqual((await books.findByCategory(1)).map(b => b.id), [3, 1]);
    assert.deepEqual(await books.findByCategory(999), []);
    assert.equal(await categories.exists(1), true);
    assert.equal(await categories.exists(999), false);

    const bookId = await books.create({ title: 'new book', auth: 'new author', categoryId: 1 });
    assert.equal(bookId, 6);
    const stored = await runner.manager.getRepository(Book).findOneByOrFail({ id: bookId });
    assert.equal(stored.title, 'new book');
    assert.equal(stored.auth, 'new author');
    assert.equal(stored.category_id, 1);
    const rentalId = await rentals.create(1, bookId);
    const [timing] = await runner.query('SELECT TIMESTAMPDIFF(DAY, rented_at, due_at) AS days, ABS(TIMESTAMPDIFF(SECOND, rented_at, NOW())) AS age, returned_at FROM rental WHERE id = ?', [rentalId]);
    assert.equal(Number(timing.days), 7);
    assert.ok(Number(timing.age) < 30);
    assert.equal(timing.returned_at, null);
    assert.equal((await books.findAll()).find(b => b.id === bookId).isAvailable, false);
    assert.equal(await rentals.returnRental(rentalId), 1);
    assert.equal((await books.findAll()).find(b => b.id === bookId).isAvailable, true);
    assert.equal(await rentals.returnRental(999), 0);
    // 여러 미반납 건 중 하나만 반납한 경우에는 여전히 대여 불가입니다.
    assert.equal(await rentals.returnRental(3), 1);
    assert.equal((await books.findAll()).find(b => b.id === 3).isAvailable, false);
    assert.equal(await rentals.returnRental(6), 1);
    assert.equal((await books.findAll()).find(b => b.id === 3).isAvailable, true);
  } finally {
    try {
      if (runner && !runner.isReleased) {
        try { await runner.query('DROP TEMPORARY TABLE IF EXISTS rental, book, category'); }
        finally { await runner.release(); }
      }
    } finally {
      try {
        if (app) {
          const source = app.get(DataSource);
          await app.close();
          assert.equal(source.isInitialized, false);
        }
        if (before) assert.deepEqual(await snapshot(audit), before, 'Permanent tables must remain unchanged');
      } finally { await audit.end(); }
    }
  }
});
