const assert = require('node:assert/strict');
const { test } = require('node:test');
require('reflect-metadata');
const { ValidationPipe } = require('@nestjs/common');
const { CreateCategoryRequestDto } = require('../dist/category/dto/request/create-category.request.dto');
const { CategoryResponseDto } = require('../dist/category/dto/response/category.response.dto');
const { CreateUserRequestDto } = require('../dist/user/dto/request/create-user.request.dto');
const { UserResponseDto } = require('../dist/user/dto/response/user.response.dto');
const { RentalResponseDto } = require('../dist/rental/dto/response/rental.response.dto');

const pipe = new ValidationPipe({
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
  forbidUnknownValues: true,
  transformOptions: { enableImplicitConversion: false },
});

function validate(body, metatype) {
  return pipe.transform(body, { type: 'body', metatype });
}

test('category request requires a non-blank name of at most 64 characters', async () => {
  const dto = await validate({ name: ' 과학 ' }, CreateCategoryRequestDto);
  assert.ok(dto instanceof CreateCategoryRequestDto);
  assert.equal(dto.name, '과학');
  assert.equal((await validate({ name: '가'.repeat(64) }, CreateCategoryRequestDto)).name.length, 64);
  for (const body of [{}, { name: null }, { name: 1 }, { name: '' }, { name: ' ' },
    { name: '가'.repeat(65) }, { name: '과학', id: 1 }]) {
    await assert.rejects(validate(body, CreateCategoryRequestDto), error => error.getStatus() === 400);
  }
});

test('user request allows missing or NULL name but validates supplied text', async () => {
  assert.equal((await validate({}, CreateUserRequestDto)).name, undefined);
  assert.equal((await validate({ name: null }, CreateUserRequestDto)).name, null);
  assert.equal((await validate({ name: ' 사용자 ' }, CreateUserRequestDto)).name, '사용자');
  for (const body of [{ name: '' }, { name: ' ' }, { name: true }, { name: [] },
    { name: '가'.repeat(65) }, { name: '사용자', admin: true }]) {
    await assert.rejects(validate(body, CreateUserRequestDto), error => error.getStatus() === 400);
  }
});

test('category and user responses expose scalar fields without circular relations', () => {
  const category = { id: 1, name: '과학' };
  category.books = [{ category }];
  const user = { id: 7, name: null, password: 'private' };
  user.rentals = [{ user }];
  assert.deepEqual(JSON.parse(JSON.stringify(new CategoryResponseDto(category))), { id: 1, name: '과학' });
  assert.deepEqual(JSON.parse(JSON.stringify(new UserResponseDto(user))), { id: 7, name: null });
});

test('rental response serializes dates to ISO strings and preserves a NULL return date', () => {
  const rental = {
    id: 42, user_id: 7, book_id: 3,
    rented_at: new Date('2026-10-04T01:00:00.000Z'),
    due_at: new Date('2026-10-11T01:00:00.000Z'),
    returned_at: null,
  };
  rental.user = { rentals: [rental] };
  const dto = new RentalResponseDto(rental);
  assert.deepEqual(JSON.parse(JSON.stringify(dto)), {
    id: 42, user_id: 7, book_id: 3,
    rented_at: '2026-10-04T01:00:00.000Z',
    due_at: '2026-10-11T01:00:00.000Z',
    returned_at: null,
  });
  rental.returned_at = new Date('2026-10-05T01:00:00.000Z');
  assert.equal(new RentalResponseDto(rental).returned_at, '2026-10-05T01:00:00.000Z');
});
