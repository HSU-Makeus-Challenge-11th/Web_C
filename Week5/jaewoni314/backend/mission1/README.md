# Week5 Backend - 화면과 API를 처음 연결하기 (NestJS + TypeORM)

영화 평점 서비스의 회원/평점 API 3개를 만들고, CORS를 설정해 5주차 프론트(UMCine) 화면과 연결했습니다.

## 실행 방법

1. `sql/01_schema_seed.sql`을 실행해 `umc_movie` DB와 `member`, `rating`, `favorite` 테이블, 더미 데이터를 만듭니다.
2. `.env.example`을 복사해 `.env`를 만들고 본인의 MySQL 정보를 넣습니다.
3. 의존성 설치 후 서버를 실행합니다.

```bash
npm install
npm run start:dev
```

## API 명세

| API | Method | URL | Request | Success Response (200) |
| --- | --- | --- | --- | --- |
| 닉네임 중복 체크 | GET | `/members/nickname/{nickname}` | Path: nickname (string) | `{ "available": true }` |
| 이메일 중복 체크 | GET | `/members/email/{email}` | Path: email (string) | `{ "available": true }` |
| 유저별 평점 조회 | GET | `/members/{memberId}/ratings` | Path: memberId (number) | `[{ "ratingId", "movieId", "score", "comment", "createdAt", "updatedAt" }]` (최신순) |

- 없는 `memberId`는 404 `존재하지 않는 유저입니다.`, 숫자가 아니면 400으로 응답합니다.

## CORS

`main.ts`에서 프론트 개발 서버 출처 `http://localhost:5173`만 허용합니다.

## 폴더 구조 (레이어 기준)

```
src/
├── controller/   member.controller.ts, rating.controller.ts
├── service/      member.service.ts, rating.service.ts
├── entity/       base-time.entity.ts, member.entity.ts, rating.entity.ts
├── dto/          check-response.dto.ts, rating-response.dto.ts
├── repository/   (NestJS는 TypeORM Repository를 Service에서 바로 주입받아 비어 있음)
├── app.module.ts
└── main.ts       CORS 설정
```

이 프로젝트는 ESM(`"type": "module"`)이라 상대 경로 import에 `.js` 확장자를 붙였습니다.
CORS 에러 확인용 간이 프론트는 `../practice/mock-frontend`에 있습니다.
