# Week4 Backend - ORM으로 첫 API 리팩터링하기 (NestJS + TypeORM)

3주차에 Raw SQL로 만든 도서 API를 TypeORM 엔티티, Repository, DTO 기반으로 리팩터링했습니다.

## 실행 방법

1. 2주차에 만든 `book_rental` 데이터베이스가 필요합니다. (`Week2/jaewoni314/backend/practice/01_schema.sql` → `02_seed.sql`)
2. 중복 제목 방지(선택 미션 3)를 쓰려면 `sql/01_add_unique_title.sql`을 실행합니다.
3. `.env.example`을 복사해 `.env`를 만들고 본인의 MySQL 정보를 넣습니다.
4. 의존성 설치 후 개발 서버를 실행합니다.

```bash
npm install
npm run start:dev
```

## API 목록

| 메서드 | 경로 | 설명 | 구분 |
| --- | --- | --- | --- |
| GET | `/books` | 도서 전체 목록 (최신 등록순, 카테고리 이름 포함) | 실습 1 / 선택 1 |
| GET | `/books?keyword=코드` | 제목 검색 | 선택 2 |
| POST | `/books` | 신규 도서 등록 (201) | 실습 2 |

### 오류 응답

| 상황 | 상태 코드 |
| --- | --- |
| `title`이 비어 있거나 100자 초과, `categoryId`가 정수가 아님 | 400 |
| 존재하지 않는 `categoryId` | 404 |
| 이미 등록된 제목 | 409 |

### 요청 예시

```bash
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{"categoryId": 2, "title": "코스모스", "description": "칼 세이건의 우주 이야기"}'
```

## 파일 구조

```
src/
├── main.ts                     전역 ValidationPipe
├── app.module.ts               TypeOrmModule.forRootAsync (synchronize: false)
└── books/
    ├── books.module.ts         TypeOrmModule.forFeature([Book, Category])
    ├── books.controller.ts     /books 라우팅
    ├── books.service.ts        Repository로 조회·저장, 404/409 처리
    ├── entities/
    │   ├── book.entity.ts      Book N : 1 Category (@ManyToOne)
    │   └── category.entity.ts
    └── dto/
        ├── create-book.dto.ts    요청 검증 (class-validator)
        └── book-response.dto.ts  응답 형식 (Entity를 그대로 노출하지 않음)
```

3주차의 대여(rental) API는 이번 주차 범위가 아니라 포함하지 않았습니다.
