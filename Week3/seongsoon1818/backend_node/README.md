# 도서 조회 및 대여 API

NestJS와 `mysql2/promise`를 사용합니다. 기존 `Controller → Service → Repository` 구조에서 SQL의 `?`에 값을 바인딩합니다.

## 실행

이 폴더에서 `npm install` 후 `npm start`를 실행합니다. 서버 주소는 `http://localhost:3000`입니다.
DB 연결은 `.env`의 `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`을 사용합니다.

현재 DB의 대여 기본 키는 `rental.id`입니다. API에서는 이를 `rentalId`로 주고받습니다.
DB 테이블을 자동으로 생성하거나 변경하지 않습니다.

## 1. 카테고리별 도서 조회

```http
GET http://localhost:3000/books/category/1
```

```sql
SELECT * FROM book WHERE category_id = ?;
```

`200 OK`와 해당 카테고리의 도서 배열을 반환합니다. JSON 필드는 DB 컬럼 이름과 같으며,
조회 결과가 없으면 `[]`을 반환합니다.

## 2. 도서 대여

```http
POST http://localhost:3000/rentals
Content-Type: application/json

{
  "userId": 1,
  "bookId": 3
}
```

`userId`와 `bookId`는 DB에 실제로 존재하는 값으로 바꿔주세요.

```sql
INSERT INTO rental (user_id, book_id, rented_at, due_at)
VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY));
```

성공하면 `201 Created`와 생성된 대여 ID를 반환합니다.

```json
{ "rentalId": 42, "message": "도서 대여가 완료되었습니다!" }
```

대여 시각과 7일 뒤 반납 기한은 MySQL 서버 시간을 기준으로 저장됩니다.

## 3. 도서 반납

```http
PATCH http://localhost:3000/rentals/42/return
```

본문 없이 요청합니다. `42`는 대여 API가 반환한 `rentalId`로 바꿉니다.
현재 DB에 맞춰 과제 명세의 `rental_id` 대신 `id`를 사용합니다.

```sql
UPDATE rental SET returned_at = NOW() WHERE id = ?;
```

성공하면 `200 OK`를 반환합니다.

```json
{ "rentalId": 42, "message": "도서 반납이 완료되었습니다!" }
```

같은 대여 기록을 다시 반납하면 반납 시각이 다시 갱신됩니다.

## 오류 응답과 테스트

- ID가 없거나 양의 정수가 아니면 `400 Bad Request`입니다.
- 대여 시 사용자/도서 외래 키 제약 조건을 위반하면 `400 Bad Request`입니다.
- 반납할 대여 기록이 없으면 `404 Not Found`입니다.

```bash
npm test
```

빌드 후 실제 NestJS HTTP 서버로 경로/본문 바인딩, 정상 응답, 입력 검증 및 오류 처리를 검사합니다.
자동 테스트는 DB 연결을 대체하므로 실행 중인 MySQL이나 실제 데이터 변경이 필요하지 않습니다.
