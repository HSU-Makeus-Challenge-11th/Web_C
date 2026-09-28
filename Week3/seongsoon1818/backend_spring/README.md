# 도서 조회 및 대여 API

Java 21, Spring Boot 3.5.0, MySQL을 사용합니다. 요청은 `Controller → Service → Repository` 순서로 처리하며, Repository에서 `JdbcTemplate`으로 생 SQL을 실행합니다. 요청값은 `?`에 바인딩합니다.

## 실행

`application.yaml`에서 사용하는 환경 변수 세 개를 설정합니다. PowerShell에서 다음 값을 자신의 MySQL 연결 정보로 바꿔 실행하세요.

```powershell
cd Week3/backend_spring
$env:DB_URL = "jdbc:mysql://localhost:3306/your_database?serverTimezone=Asia/Seoul&characterEncoding=UTF-8"
$env:DB_USER = "your_username"
$env:DB_PW = "your_password"
.\gradlew.bat bootRun
```

IntelliJ에서 실행한다면 Run Configuration의 Environment variables에 `DB_URL`, `DB_USER`, `DB_PW`를 등록합니다. 기본 서버 주소는 `http://localhost:8080`입니다.

DB에는 `book.category_id`와 아래 컬럼을 가진 `rental` 테이블이 있어야 합니다.

```text
id         INT PRIMARY KEY AUTO_INCREMENT
user_id    INT NOT NULL
book_id    INT NOT NULL
rented_at  DATETIME NOT NULL
due_at     DATETIME NOT NULL
returned_at DATETIME NULL
```

현재 DB의 대여 기본 키 컬럼은 `id`이며, API에서는 이 값을 `rentalId`라는 이름으로 주고받습니다. `../../Week2/01_schema.sql`의 기본 키 이름(`rental_id`)과 다르므로 현재 DB 구조를 기준으로 사용하세요. 애플리케이션은 스키마와 예제 데이터를 자동으로 생성하지 않습니다.

## Postman 사용

1. Postman의 **Import**에서 `postman/BookRental.postman_collection.json`을 가져옵니다.
2. 컬렉션의 **Variables**에서 `baseUrl`, `categoryId`, `userId`, `bookId`를 설정합니다. `userId`, `bookId`는 DB에 실제 존재하는 ID여야 합니다. 기본값은 Week2 예제 데이터에 맞춰져 있습니다.
3. `1. 카테고리별 도서 조회`, `2. 도서 대여`, `3. 도서 반납` 순서로 **Send**를 누르거나 Collection Runner로 실행합니다.

대여 성공 시 응답의 `rentalId`가 컬렉션 변수로 자동 저장되어 반납 요청에 사용됩니다. 각 요청의 Tests 스크립트는 응답 상태와 내용을 확인합니다.

### 1. 카테고리별 도서 조회

```http
GET http://localhost:8080/books/category/1
```

```sql
SELECT * FROM book WHERE category_id = ?;
```

- `categoryId`는 `@PathVariable`로 받습니다.
- 성공: `200 OK`, 해당 카테고리의 도서 목록을 JSON 배열로 반환합니다.
- 조회 결과가 없으면 빈 배열 `[]`을 반환합니다. JSON 필드 이름은 DB 컬럼 이름과 같습니다.

### 2. 도서 대여

```http
POST http://localhost:8080/rentals
Content-Type: application/json

{
  "userId": 1,
  "bookId": 3
}
```

Postman에서 **Body → raw → JSON**을 선택합니다. 요청 필드 이름은 `userId`, `bookId`입니다.

```sql
INSERT INTO rental (user_id, book_id, rented_at, due_at)
VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY));
```

성공: `201 Created`. 아래 `rentalId` 값은 생성된 ID에 따라 달라집니다.

```json
{
  "rentalId": 3,
  "message": "도서 대여가 완료되었습니다!"
}
```

`rented_at`과 `due_at`은 MySQL 서버의 현재 시간을 기준으로 정해집니다. `returned_at`은 반납 전까지 `NULL`입니다. ID가 누락되거나 0 이하인 경우, 외래 키 제약 조건에 위배되는 경우 `400 Bad Request`를 반환합니다.

### 3. 도서 반납

```http
PATCH http://localhost:8080/rentals/3/return
```

Body 없이 호출합니다. 경로의 `3`은 대여 API 응답의 `rentalId`로 바꿉니다.

```sql
UPDATE rental SET returned_at = NOW() WHERE id = ?;
```

성공: `200 OK`.

```json
{
  "rentalId": 3,
  "message": "도서 반납이 완료되었습니다!"
}
```

대여 기록이 없으면 `404 Not Found`, ID가 0 이하이거나 숫자가 아니면 `400 Bad Request`입니다. 같은 기록을 다시 반납하면 요청한 SQL에 따라 반납 시각이 다시 갱신됩니다.

## DB에서 결과 확인

Postman에서 받은 대여 ID를 넣어 조회합니다.

```sql
SELECT id, user_id, book_id, rented_at, due_at, returned_at,
       TIMESTAMPDIFF(DAY, rented_at, due_at) AS rental_days
FROM rental
WHERE id = 3;
```

대여 직후 `rental_days = 7`, `returned_at IS NULL`인지 확인합니다. 반납 후에는 `returned_at`에 현재 시각이 들어갑니다.

## 자동 테스트

```powershell
.\gradlew.bat test
```

`BookRentalApiTests`는 실제 Controller와 Service를 사용하고 Repository를 모킹하여 경로/본문 바인딩, 생성 ID 응답, 잘못된 요청 및 없는 대여 기록의 HTTP 상태를 검사합니다. 실제 MySQL의 SQL 실행과 시간 저장 결과는 위 Postman 및 DB 조회 절차로 확인할 수 있습니다.
