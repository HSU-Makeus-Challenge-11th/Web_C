const assert = require('node:assert/strict');
const { test } = require('node:test');
require('reflect-metadata');
const { ConfigService } = require('@nestjs/config');
const { DataSource } = require('typeorm');
const { createDatabaseOptions } = require('../dist/database/database.config');
const { Book } = require('../dist/book/book.entity');
const { Rental } = require('../dist/rental/rental.entity');

function config(overrides = {}) {
  const service = new ConfigService({
    DB_HOST: 'localhost', DB_PORT: '3306', DB_USER: 'test',
    DB_PASSWORD: 'test', DB_NAME: 'test', ...overrides,
  });
  service.skipProcessEnv = true;
  return service;
}

test('database options use numeric ports and never change the existing schema', () => {
  const options = createDatabaseOptions(config());
  assert.equal(options.port, 3306);
  assert.equal(options.synchronize, false);
  assert.equal(options.dropSchema, false);
  assert.equal(options.migrationsRun, false);
  for (const port of ['', 'invalid', '0', '-1', '65536', '3306.5']) {
    assert.throws(() => createDatabaseOptions(config({ DB_PORT: port })), /DB_PORT/);
  }
  for (const key of ['DB_USER', 'DB_PASSWORD', 'DB_NAME']) {
    assert.throws(() => createDatabaseOptions(config({ [key]: undefined })), /does not exist/);
  }
});

test('entity metadata preserves column names and all three existing foreign keys', async () => {
  const source = new DataSource(createDatabaseOptions(config()));
  // 실제 DB에 연결하지 않고 엔티티 사이의 관계와 컬럼 매핑을 검증합니다.
  await source.buildMetadatas();
  const book = source.getMetadata(Book);
  assert.deepEqual(book.columns.map(c => c.databaseName).sort(), ['auth', 'category_id', 'id', 'name']);
  assert.equal(book.findColumnWithPropertyName('title').databaseName, 'name');
  assert.equal(book.findColumnWithPropertyName('auth').isNullable, false);
  assert.equal(book.findColumnWithPropertyName('category_id').isNullable, true);
  assert.equal(book.primaryColumns[0].isGenerated, true);
  assert.deepEqual(book.foreignKeys.map(fk => [fk.name, fk.columnNames, fk.referencedTablePath]), [
    ['category_id_fk', ['category_id'], 'category'],
  ]);
  const rental = source.getMetadata(Rental);
  assert.deepEqual(rental.columns.map(c => c.databaseName).sort(), ['book_id', 'due_at', 'id', 'rented_at', 'returned_at', 'user_id']);
  assert.deepEqual(rental.foreignKeys.map(fk => [fk.name, fk.columnNames, fk.referencedTablePath]), [
    ['fk_user_id', ['user_id'], 'user'],
    ['fk_book_id', ['book_id'], 'book'],
  ]);
  assert.equal(rental.findColumnWithPropertyName('returned_at').isNullable, true);
});
