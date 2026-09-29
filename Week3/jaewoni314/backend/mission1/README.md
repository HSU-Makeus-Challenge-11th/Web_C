# Week3 Backend - 첫 API 만들고 검증하기 (NestJS)

3계층 아키텍처(Controller - Service - Repository)와 생 SQL(Raw SQL)로 만든 도서 대여 API입니다.
ORM과 DTO 없이 `mysql2` 드라이버로 직접 쿼리를 실행합니다.

## 실행 방법

1. 2주차에 만든 `book_rental` 데이터베이스가 필요합니다. (`Week2/jaewoni314/backend/practice/01_schema.sql` → `02_seed.sql`)
2. `.env.example`을 복사해 `.env`를 만들고 본인의 MySQL 정보를 넣습니다.
3. 의존성 설치 후 개발 서버를 실행합니다.

```bash
npm install
npm run start:dev
```

## API 목록

| 메서드 | 경로 | 설명 | 구분 |
| --- | --- | --- | --- |
| GET | `/books` | 도서 전체 목록 조회 | 실습 1 |
| POST | `/books` | 신규 도서 등록 | 실습 2 |
| GET | `/books/category/:categoryId` | 특정 카테고리 도서 목록 조회 | 미션 (필수) |
| POST | `/rentals` | 신규 도서 대여 기록 생성 | 미션 (필수) |
| PATCH | `/rentals/:rentalId/return` | 도서 반납 처리 | 미션 (선택) |

### 요청 예시

```bash
# 도서 등록
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{"categoryId": 1, "title": "클린 코드", "description": "애자일 소프트웨어 장인 정신"}'

# 대여 기록 생성 (rented_at은 현재 시간, due_at은 7일 뒤)
curl -X POST http://localhost:3000/rentals \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "bookId": 3}'

# 반납 처리
curl -X PATCH http://localhost:3000/rentals/3/return
```

## 파일 구조

```
src/
├── database.provider.ts   mysql2 커넥션 풀(10개) Provider
├── book.controller.ts     /books 라우팅
├── book.service.ts        도서 비즈니스 로직
├── book.repository.ts     도서 SQL (SELECT, INSERT)
├── rental.controller.ts   /rentals 라우팅
├── rental.service.ts      대여 비즈니스 로직
├── rental.repository.ts   대여 SQL (INSERT, UPDATE)
└── app.module.ts          ConfigModule과 위 부품 등록
```

모든 쿼리는 값 자리를 `?`로 두고 파라미터 바인딩해 SQL Injection을 막습니다.
