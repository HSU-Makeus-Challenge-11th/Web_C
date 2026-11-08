# Week6 Backend - 입력한 데이터를 저장하기 (NestJS + TypeORM)

5주차 영화 평점 서비스에 회원가입과 평점 등록/수정/삭제 API를 더하고, 성공과 실패를 같은 응답 형식으로 맞췄습니다.

## 실행 방법

1. `sql/01_schema_seed.sql`을 실행해 `umc_movie` DB와 `member`, `rating`, `favorite` 테이블, 더미 데이터를 만듭니다. (5주차와 같은 스키마)
2. `.env.example`을 복사해 `.env`를 만들고 본인의 MySQL 정보를 넣습니다.
3. 의존성 설치 후 서버를 실행합니다.

```bash
npm install
npm run start:dev
```

## 응답 형식

6주차에 추가한 API는 성공과 실패 모두 아래 구조로 응답합니다. (5주차 조회 API의 성공 응답은 프론트 화면과 맞춰 그대로 두고, 실패 응답만 같은 구조로 바뀝니다.)

```json
{ "isSuccess": true, "code": "COMMON201", "message": "회원가입에 성공했습니다.", "result": { "memberId": 1, "email": "umc@example.com", "nickname": "moviefan" } }
{ "isSuccess": false, "code": "MEMBER409_2", "message": "이미 사용 중인 이메일입니다.", "result": null }
```

## API 명세

| API | Method | URL | Request Body | 성공 |
| --- | --- | --- | --- | --- |
| 회원가입 | POST | `/members` | `email`, `password`, `nickname` | 201, `result`: `{ memberId, email, nickname }` |
| 평점 등록 | POST | `/members/{memberId}/ratings` | `movieId`, `score`, `comment?` | 201, `result`: ratingId |
| 평점 수정 | PATCH | `/members/{memberId}/ratings/{ratingId}` | `score`, `comment?` | 200, `result`: null |
| 평점 삭제 | DELETE | `/members/{memberId}/ratings/{ratingId}` | - | 204 (본문 없음) |
| 닉네임 중복 체크 (5주차) | GET | `/members/nickname/{nickname}` | - | 200, `{ "available": true }` |
| 이메일 중복 체크 (5주차) | GET | `/members/email/{email}` | - | 200, `{ "available": true }` |
| 유저별 평점 조회 (5주차) | GET | `/members/{memberId}/ratings` | - | 200, 평점 배열 (최신순) |

### 입력 규칙

- `email`: 이메일 형식, 254자 이하
- `password`: 영문 대문자/소문자/숫자/특수문자(`!@#$%^&*`)를 모두 포함한 8자 이상, bcrypt 해시(60자)로 저장하고 응답에 넣지 않음
- `nickname`: 2자 이상 12자 이하
- `movieId`: 1 이상의 정수 (TMDB 영화 ID), `score`: 1~5 정수, `comment`: 선택, 500자 이하
- DTO에 없는 필드를 보내면 400

### 오류 코드

도메인별 오류 code는 `{도메인}{HTTP 상태 코드}_{일련번호}` 규칙이고, 공통 오류는 `COMMON{HTTP 상태 코드}`입니다.

| status | code | 상황 |
| --- | --- | --- |
| 400 | `COMMON400` | 입력 검증 실패, DTO에 없는 필드, 잘못된 JSON, 숫자가 아닌 경로 값 |
| 403 | `RATING403_1` | 다른 회원의 평점을 수정/삭제 |
| 404 | `MEMBER404_1` | 존재하지 않는 회원 |
| 404 | `RATING404_1` | 존재하지 않는 평점 |
| 409 | `MEMBER409_1` | 이미 사용 중인 닉네임 |
| 409 | `MEMBER409_2` | 이미 사용 중인 이메일 |
| 409 | `RATING409_1` | 같은 영화에 이미 평점을 남김 |
| 500 | `COMMON500` | 그 밖의 서버 오류 |

서비스에서 중복을 먼저 확인해도 동시에 들어온 요청은 DB UNIQUE 제약에서 막힐 수 있습니다. 전역 예외 필터가 이 DB 오류(`ER_DUP_ENTRY`)도 제약 이름에 맞는 409 코드로 바꿔 응답합니다.

## 폴더 구조 (레이어 기준)

```
src/
├── controller/   member.controller.ts, rating.controller.ts
├── service/      member.service.ts, rating.service.ts
├── entity/       base-time.entity.ts, member.entity.ts, rating.entity.ts
├── dto/          요청 DTO(create-member, create-rating, update-rating)와 응답 DTO
├── common/       api-response.ts(공통 응답), error-code.ts(오류 코드), api.exception.ts
├── filter/       global-exception.filter.ts(전역 예외 처리)
├── repository/   (NestJS는 TypeORM Repository를 Service에서 바로 주입받아 비어 있음)
├── app.module.ts
└── main.ts       CORS, 전역 ValidationPipe, 전역 예외 필터
```

이 프로젝트는 ESM(`"type": "module"`)이라 상대 경로 import에 `.js` 확장자를 붙였습니다.
