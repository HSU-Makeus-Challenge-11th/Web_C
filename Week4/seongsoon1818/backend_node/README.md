# 도서 조회 및 대여 API

NestJS와 TypeORM을 사용합니다. `Controller → Service → 기능별 Repository → TypeORM Repository` 순서로 DB에 접근합니다.
`mysql2` 패키지는 TypeORM이 MySQL에 접속할 때 사용하는 드라이버입니다.

## 프로젝트 구조

```text
src/
├── main.ts
├── app/
│   ├── app.module.ts
│   ├── app.controller.ts
│   └── app.service.ts
├── book/
│   ├── book.module.ts
│   ├── book.controller.ts
│   ├── book.service.ts
│   ├── book.repository.ts
│   ├── book.entity.ts
│   └── dto/
│       ├── request/   # 도서 등록, 카테고리별 조회
│       └── response/  # 도서 정보, 등록 결과
├── rental/
│   ├── rental.module.ts
│   ├── rental.controller.ts
│   ├── rental.service.ts
│   ├── rental.repository.ts
│   ├── rental.entity.ts
│   └── dto/
│       ├── request/   # 대여, 반납
│       └── response/  # 대여 정보, 처리 결과
├── category/
│   ├── category.module.ts
│   ├── category.repository.ts
│   ├── category.entity.ts
│   └── dto/
│       ├── request/   # 카테고리 등록
│       └── response/  # 카테고리 정보
├── user/
│   ├── user.entity.ts
│   └── dto/
│       ├── request/   # 사용자 등록
│       └── response/  # 사용자 정보
├── database/
│   ├── database.module.ts
│   └── database.config.ts
└── common/
    └── decorators/
        └── is-positive-id.decorator.ts
```

- `AppModule`은 전역 설정을 읽고 `DatabaseModule`, `BookModule`, `RentalModule`을 조합하며 전역 `ValidationPipe`를 등록합니다.
- 기능 모듈은 자신의 Controller, Service, Repository를 등록합니다.
- `DatabaseModule`은 `TypeOrmModule.forRootAsync()`로 하나의 TypeORM `DataSource`를 등록합니다.
- 도서·대여·카테고리 모듈은 각각 `TypeOrmModule.forFeature()`로 자신의 엔티티 Repository를 등록하고 `@InjectRepository()`로 주입받습니다. 세 Repository는 같은 `DataSource`를 공유합니다.
- `BookModule`은 `CategoryModule`이 내보내는 `CategoryRepository`로 카테고리 존재 여부를 확인합니다.
- 엔티티와 DTO는 해당 기능 폴더에 둡니다. 카테고리 등록 API와 사용자 API는 아직 없으며, 해당 요청/응답 DTO는 추후 사용할 수 있습니다.
- `Book`, `Category`, `Rental`, `User` 엔티티를 모두 연결에 등록합니다. `User`도 `Rental.user` 관계의 대상으로 필요합니다.

## ORM 적용 방식

| 기능 | 사용한 TypeORM API |
| --- | --- |
| 도서 목록 / 카테고리별 조회 | `createQueryBuilder()`로 엔티티 관계 JOIN, 미반납 건수 집계, ID 내림차순 정렬 |
| 도서 등록 | `Repository.create()`와 `Repository.save()` |
| 카테고리 존재 확인 | `Repository.existsBy({ id })` |
| 대여 등록 | `Repository.insert()` |
| 반납 | `Repository.update()` |

`book.category`, `book.rentals` 관계를 이용해 JOIN을 구성합니다. QueryBuilder의 조건식과 집계식은 TypeORM이 최종 SQL로 조합합니다.
대여 날짜는 `insert()`/`update()`의 DB 함수 표현식으로 계산하여 기존 MySQL 서버 시간 기준을 유지합니다.
애플리케이션에서 직접 `mysql2` 풀을 만들거나 `pool.query()`/`pool.execute()`를 호출하는 코드는 제거했습니다.

## 실행

이 폴더에서 `npm install` 후 `npm start`를 실행합니다. 서버 주소는 `http://localhost:3000`입니다.
이미 실행 중인 서버는 종료한 뒤 `npm start`로 다시 실행해야 변경된 코드가 적용됩니다.
DB 연결은 `.env`의 `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`을 사용합니다.
`DB_USER`, `DB_PASSWORD`, `DB_NAME`이 없으면 시작 시 오류를 표시합니다. `DB_PORT`는 정수로 변환하고 범위를 검사합니다.
시작 시 TypeORM이 실제 DB에 연결하며, 서버 종료 시 연결도 정리합니다.

현재 DB의 대여 기본 키는 `rental.id`입니다. API에서는 이를 `rentalId`로 주고받습니다.
`synchronize: false`, `dropSchema: false`, `migrationsRun: false`로 설정하여 기존 테이블을 자동으로 생성·변경·삭제하거나 마이그레이션을 실행하지 않습니다.
기존 테이블명, 컬럼명, NULL 허용 여부와 외래 키 관계를 그대로 사용합니다. 스키마 변경 명령을 실행할 필요가 없습니다.

`npm run build`는 `scripts/clean-dist.cjs`로 프로젝트의 `dist`를 정리한 뒤 컴파일합니다.
파일을 옮겼을 때 예전 경로의 JavaScript가 빌드 결과에 남지 않도록 합니다.

## 1. 도서 목록과 카테고리별 조회

```http
GET http://localhost:3000/books
```

```json
[
  {
    "id": 4,
    "title": "과학 도서",
    "categoryName": "과학",
    "isAvailable": true
  }
]
```

카테고리로 필터링하려면 `GET http://localhost:3000/books/category/1`을 사용합니다.
두 API 모두 `200 OK`와 같은 형태의 도서 배열을 반환하며 조회 결과가 없으면 `[]`입니다.
Postman에서도 반드시 `GET`을 선택하고 Body는 비워 둡니다.

- 기존 DB의 `book.name`을 API에서는 `title`로 반환합니다. 엔티티의 `title`도 `name` 컬럼에 매핑됩니다.
- `category`를 LEFT JOIN하여 이름을 가져옵니다. 기존 데이터에 카테고리가 없으면 `categoryName`은 `null`입니다.
- 해당 도서에 `returned_at IS NULL`인 대여 기록이 하나라도 있으면 `isAvailable: false`입니다. 연체 상태도 미반납이므로 대여 불가입니다.
- 반납한 이력만 있거나 대여한 적이 없으면 `isAvailable: true`입니다. 미반납 관계를 JOIN한 뒤 `COUNT`와 `GROUP BY`로 집계하므로 대여 이력이 여러 개여도 도서는 한 번만 반환됩니다.
- 등록 시각 컬럼을 추가하지 않으므로 `id DESC`로 정렬합니다. 이는 ID 기준 최신순이며 기존에 수동 입력한 ID의 실제 등록 시각까지 보장하지는 않습니다.
- 설명과 등록 시각은 엔티티·DB·요청·응답에 추가하지 않습니다.

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

TypeORM `Repository.insert()`로 대여를 저장합니다. `rented_at`은 `CURRENT_TIMESTAMP`,
`due_at`은 `DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 7 DAY)` 표현식으로 계산합니다.

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

TypeORM `Repository.update({ id: rentalId }, ...)`로 `returned_at`을 DB 서버의 현재 시각으로 변경합니다.

성공하면 `200 OK`를 반환합니다.

```json
{ "rentalId": 42, "message": "도서 반납이 완료되었습니다!" }
```

같은 대여 기록을 다시 반납하면 반납 시각이 다시 갱신됩니다.

## 4. 도서 등록

```http
POST http://localhost:3000/books
Content-Type: application/json

{
  "title": "과학 도서",
  "auth": "저자",
  "categoryId": 2
}
```

`title`, `auth`, `categoryId`는 모두 필수입니다.
`title`, `auth`는 앞뒤 공백을 제거한 뒤 1~64자 문자열이어야 합니다.
`categoryId`는 양의 정수이며 존재하는 카테고리 ID여야 합니다. 생략/`null`은 `400`, 존재하지 않는 ID는 `404`입니다.
`id`는 요청으로 받지 않고 DB의 AUTO_INCREMENT로 생성합니다.
`name`, `category_id`, `id`, `description`, `created_at` 등 DTO에 없는 필드를 보내면 `400`입니다.

DB 구조는 유지합니다. `title`은 `book.name`, `categoryId`는 `book.category_id`에 저장하며,
기존 `auth` 컬럼의 NOT NULL 제약에 맞춰 저자도 필수로 입력받습니다.
카테고리를 먼저 조회하고, 확인 직후 카테고리가 삭제되어 저장에 실패한 경우도 `404`로 처리합니다.

성공하면 `201 Created`와 다음 JSON을 반환합니다.

```json
{ "bookId": 3, "message": "도서 등록이 완료되었습니다!" }
```

## Request / Response DTO 사용

엔티티는 DB 컬럼과 관계를 정의하고, DTO는 API에서 받거나 내보내는 데이터를 정의합니다.
DTO를 추가해도 DB 테이블이나 연결 설정은 변경되지 않습니다.

| 기능 | Request DTO | Response DTO | 연결 상태 |
| --- | --- | --- | --- |
| 도서 등록 | `CreateBookRequestDto` | `CreateBookResponseDto` | `POST /books` |
| 도서 목록 | 없음 | `BookResponseDto[]` | `GET /books` |
| 카테고리별 조회 | `FindBooksByCategoryRequestDto` (경로) | `BookResponseDto[]` | `GET /books/category/:categoryId` |
| 대여 | `CreateRentalRequestDto` | `RentalActionResponseDto` | `POST /rentals` |
| 반납 | `ReturnRentalRequestDto` (경로) | `RentalActionResponseDto` | `PATCH /rentals/:rentalId/return` |
| 대여 정보 | 없음 | `RentalResponseDto` | 조회 API 추가 시 사용 |
| 카테고리 | `CreateCategoryRequestDto` | `CategoryResponseDto` | API 추가 시 사용 |
| 사용자 | `CreateUserRequestDto` | `UserResponseDto` | API 추가 시 사용 |

요청은 `@Body() body: CreateBookRequestDto`처럼 클래스로 선언합니다.
런타임 검증에 클래스가 필요하므로 Controller의 Request DTO는 `import type`으로 가져오지 않습니다.
`ValidationPipe`가 DTO로 변환하고 데코레이터 규칙을 검사한 다음 Service에 전달합니다.

- 필수값 누락, 타입/길이 오류, DTO에 정의되지 않은 필드는 `400 Bad Request`입니다.
- ID는 DB의 signed INT 범위인 `1~2147483647`입니다. `"7"` 같은 숫자 문자열도 허용하지만 `true`, `"1e2"`, 소수, 공백은 거부합니다.
- `CreateCategoryRequestDto.name`은 필수 1~64자 문자열입니다.
- `CreateUserRequestDto.name`은 DB의 nullable 설정에 맞춰 생략/`null`을 허용합니다. 문자열을 보낸 경우 공백 제거 후 1~64자여야 합니다. 향후 저장 로직에서 생략된 값은 `null`로 처리하면 됩니다.
- 대여 날짜는 서버가 결정하므로 대여 Request DTO에는 `userId`, `bookId`만 있습니다.

응답은 Service에서 `new BookResponseDto(book)`처럼 실제 DTO 인스턴스로 변환합니다.
반환 타입만 선언해서는 실행 시 불필요한 필드가 제거되지 않습니다.
각 생성자는 공개할 필드만 복사하므로 엔티티의 관계 배열이나 추가 내부 필드는 응답에 들어가지 않습니다.
`RentalResponseDto`의 날짜는 ISO 8601 문자열이며, 미반납 상태의 `returned_at`은 `null`입니다.
도서 API는 `title`/`categoryId` 요청 및 `title`/`categoryName`/`isAvailable` 응답으로 변경되었습니다.
대여 요청의 `userId`/`bookId` 이름은 유지합니다.

`AppModule`, `DatabaseModule`은 모듈 구성과 DB 연결 역할을 하므로 별도의 요청/응답 DTO를 만들지 않습니다.

## 오류 응답과 테스트

- 필수 ID가 없거나 양의 정수 범위를 벗어나면 `400 Bad Request`입니다.
- 도서 등록 시 존재하지 않는 카테고리 ID이면 `404 Not Found`입니다.
- 대여 시 사용자/도서 외래 키 제약 조건을 위반하면 `400 Bad Request`입니다.
- 반납할 대여 기록이 없으면 `404 Not Found`입니다.

```bash
npm test
```

빌드 후 실제 `AppModule`로 NestJS HTTP 서버를 시작하여 모듈의 의존성 주입, 경로/본문 바인딩,
정상 응답, 입력 검증 및 오류 처리를 검사합니다. 기능 모듈들이 하나의 TypeORM `DataSource`를 공유하고 종료 시 정리하는지도 확인합니다.
아직 API가 없는 카테고리/사용자의 입력 검증과 응답 필드 제한, 대여 정보의 날짜 직렬화도 별도로 검사합니다.
기본 테스트는 TypeORM의 메타데이터와 QueryBuilder를 실제로 구성하되 DB 실행 부분을 대체하므로 실행 중인 MySQL이 필요하지 않습니다.
스키마 자동 변경 설정이 꺼져 있는지와 엔티티의 기존 컬럼/외래 키 매핑도 검사합니다.

실제 MySQL까지 확인하려면 `.env`에 연결 정보를 설정하고 다음 명령을 실행합니다.

```bash
npm run test:mysql
```

이 테스트는 실제 HTTP 도서 목록을 기존 DB 데이터와 비교합니다.
등록·대여·반납은 전용 QueryRunner 연결의 TEMPORARY TABLE에서 실행하며, 정렬·카테고리 필터·중복 없는 목록·미반납 상태·7일 기한을 검사합니다.
테스트가 끝나면 임시 테이블을 정리하고, 기존 네 테이블의 구조와 데이터를 전후 비교하여 변경되지 않았는지 확인합니다.
