# Week7 Backend - 로그인과 JWT 인증, 내 데이터만 수정하기 (NestJS + TypeORM)

6주차 영화 평점 서비스에 로그인(JWT Access Token 발급)과 토큰 검사 Guard를 더했습니다. 평점 등록/수정/삭제는 경로에서 `memberId`를 없애고 토큰으로 요청자를 알아내며, 다른 회원의 평점은 수정하거나 삭제할 수 없습니다.

## 실행 방법

1. `sql/01_schema_seed.sql`을 실행해 `umc_movie` DB와 `member`, `rating`, `favorite` 테이블, 더미 데이터를 만듭니다. (5주차와 같은 스키마)
2. `.env.example`을 복사해 `.env`를 만들고 본인의 MySQL 정보(`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`)와 JWT 설정을 넣습니다.
   - `JWT_SECRET`: 토큰 서명에 쓰는 비밀키. 32자 이상의 무작위 문자열로 정하고(예: `openssl rand -base64 48`), 깃허브에 올리지 않습니다. (`.env`는 `.gitignore`에 들어 있습니다)
   - `JWT_ACCESS_EXPIRATION`: Access Token 유효시간(초). `3600`은 1시간이고, 비워 두면 3600을 씁니다.
   - `JWT_SECRET`이 비어 있거나 32자보다 짧을 때, `JWT_ACCESS_EXPIRATION`이 양의 정수(초)가 아닐 때(`1h`, `0` 등)는 서버가 켜지지 않고 이유를 알려 줍니다.
3. 의존성 설치 후 서버를 실행합니다.

```bash
npm install
npm run start:dev
```

시드 회원(`noco@umc.com`, `minseo@umc.com`)의 비밀번호는 bcrypt 해시가 아닌 더미 값이라 로그인할 수 없습니다. 회원가입 API로 새 회원을 만든 뒤 로그인해 주세요.

## 인증 방식

`POST /auth/login`으로 받은 `accessToken`을 로그인이 필요한 API의 `Authorization` 헤더에 담아 보냅니다.

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

- 토큰 payload에는 `sub`(회원 ID), `email`, `iat`, `exp`가 들어 있습니다. payload는 Base64URL로 인코딩만 되어 있어 누구나 읽을 수 있으므로 비밀번호 같은 값은 넣지 않았습니다.
- `AuthGuard`가 컨트롤러 앞에서 서명과 만료 시각을 검증하고, 토큰에서 꺼낸 회원 ID를 요청에 담아 둡니다. 컨트롤러는 `@LoginMember()`로 그 값을 받습니다.
- 인증(누구인지)은 `AuthGuard`가, 인가(이 평점이 내 것인지)는 Service가 확인합니다.

## 응답 형식

성공과 실패 모두 아래 구조로 응답합니다. (5주차 조회 API의 성공 응답은 프론트 화면과 맞춰 그대로 둡니다.)

```json
{ "isSuccess": true, "code": "COMMON200", "message": "로그인에 성공했습니다.", "result": { "nickname": "영화광", "accessToken": "eyJhbGciOi..." } }
{ "isSuccess": false, "code": "AUTH401_2", "message": "로그인이 필요한 요청입니다.", "result": null }
```

## API 명세

| API | Method | URL | 토큰 | Request Body | 성공 |
| --- | --- | --- | --- | --- | --- |
| 로그인 (7주차) | POST | `/auth/login` | - | `email`, `password` | 200, `result`: `{ nickname, accessToken }` |
| 내 정보 조회 (7주차) | GET | `/members/me` | 필요 | - | 200, `result`: `{ email, nickname, createdAt }` |
| 내 정보 수정 (7주차) | PATCH | `/members/me` | 필요 | `nickname` | 200, `result`: `{ email, nickname, createdAt }` |
| 평점 등록 | POST | `/ratings` | 필요 | `movieId`, `score`, `comment?` | 201, `result`: 평점 |
| 평점 수정 | PATCH | `/ratings/{ratingId}` | 필요 | `score`, `comment?` | 200, `result`: 평점 |
| 평점 삭제 | DELETE | `/ratings/{ratingId}` | 필요 | - | 200, `result`: null |
| 회원가입 (6주차) | POST | `/members` | - | `email`, `password`, `nickname` | 201, `result`: `{ memberId, email, nickname }` |
| 닉네임 중복 체크 (5주차) | GET | `/members/nickname/{nickname}` | - | - | 200, `{ "available": true }` |
| 이메일 중복 체크 (5주차) | GET | `/members/email/{email}` | - | - | 200, `{ "available": true }` |
| 유저별 평점 조회 (5주차) | GET | `/members/{memberId}/ratings` | - | - | 200, 평점 배열 (최신순) |

평점 응답(`result`)은 `{ ratingId, movieId, score, comment, createdAt, updatedAt }`입니다.

### 6주차에서 바뀐 점

| API | 6주차 | 7주차 |
| --- | --- | --- |
| 평점 등록 | `POST /members/{memberId}/ratings`, `result`: ratingId | `POST /ratings`, `result`: 평점 |
| 평점 수정 | `PATCH /members/{memberId}/ratings/{ratingId}`, `result`: null | `PATCH /ratings/{ratingId}`, `result`: 평점 |
| 평점 삭제 | `DELETE /members/{memberId}/ratings/{ratingId}`, 204 | `DELETE /ratings/{ratingId}`, 200, `result`: null |
| 누구의 요청인지 | 클라이언트가 경로로 알려 줌 | 서버가 토큰에서 알아냄 |
| 오류 code | `MEMBER4041`, `MEMBER4091`(이메일), `MEMBER4092`(닉네임), `RATING4031`, `RATING4041`, `RATING4091` | `MEMBER404_1`, `MEMBER409_2`(이메일), `MEMBER409_1`(닉네임), `RATING403_1`, `RATING404_1`, `RATING409_1` |

삭제는 204가 본문을 보내지 않는 상태 코드라 공통 응답 형식을 실을 수 없어서 200으로 바꿨습니다. 오류 code는 7주차 워크북 규칙에 맞춰 이름을 바꾸면서 이메일과 닉네임 중복의 번호가 서로 바뀌었고(닉네임이 `MEMBER409_1`), 회원과 평점을 찾을 수 없을 때의 메시지와 평점 등록/수정의 성공 메시지(`평점을 등록했습니다.`, `평점을 수정했습니다.`)도 워크북 문구로 바꿨습니다. 6주차의 `/members/{memberId}/ratings` 등록/수정/삭제 경로는 이제 404(`COMMON404`)입니다.

### 입력 규칙

- `email`: 이메일 형식, 254자 이하
- `password`: 회원가입은 영문 대문자/소문자/숫자/특수문자(`!@#$%^&*`)를 모두 포함한 8자 이상, bcrypt 해시(60자)로 저장하고 응답에 넣지 않음. 로그인은 문자열이고 비어 있지 않은지만 확인 (회원가입의 비밀번호 규칙은 검사하지 않음)
- `nickname`: 앞뒤 공백을 지운 뒤 2자 이상 12자 이하 (회원가입, 내 정보 수정 공통)
- `movieId`: 1 이상의 정수 (TMDB 영화 ID), `score`: 1~5 정수, `comment`: 선택, 500자 이하
- DTO에 없는 필드를 보내면 400 (평점 등록 바디에 `memberId`를 넣어도 400)
- 검증 메시지는 6주차 DTO의 문구를 그대로 쓰고(로그인의 `이메일을 입력해주세요.`, `비밀번호를 입력해주세요.`만 새로 추가), 여러 규칙이 함께 틀리면 입력 여부나 형식 같은 가장 기본인 규칙의 메시지를 먼저 보여 줍니다.

### 오류 코드

도메인별 오류 code는 `{도메인}{HTTP 상태 코드}_{일련번호}` 규칙이고, 공통 오류는 `COMMON{HTTP 상태 코드}`입니다.

| status | code | 상황 |
| --- | --- | --- |
| 400 | `COMMON400` | 입력 검증 실패, DTO에 없는 필드, 잘못된 JSON, 숫자가 아닌 경로 값 |
| 401 | `AUTH401_1` | 이메일 또는 비밀번호가 올바르지 않음 (없는 이메일과 틀린 비밀번호를 구분하지 않음) |
| 401 | `AUTH401_2` | 토큰이 없음 (`Authorization: Bearer {토큰}` 형식이 아님) |
| 401 | `AUTH401_3` | 위조되었거나 형식이 잘못된 토큰 |
| 401 | `AUTH401_4` | 만료된 토큰 |
| 403 | `RATING403_1` | 다른 회원의 평점을 수정/삭제 |
| 404 | `MEMBER404_1` | 존재하지 않는 회원 |
| 404 | `RATING404_1` | 존재하지 않는 평점 |
| 404 | `COMMON404` | 없는 경로 (6주차의 평점 등록/수정/삭제 경로 포함) |
| 409 | `MEMBER409_1` | 이미 사용 중인 닉네임 (회원가입, 내 정보 수정) |
| 409 | `MEMBER409_2` | 이미 사용 중인 이메일 (회원가입) |
| 409 | `RATING409_1` | 같은 영화에 이미 평점을 남김 |
| 413, 415 | `COMMON413`, `COMMON415` | 요청 본문이 너무 큼(100kb 초과), 지원하지 않는 본문 문자셋이나 압축 |
| 500 | `COMMON500` | 그 밖의 서버 오류 |

없는 평점이면 404를 먼저 주고, 평점이 있지만 요청자의 것이 아니면 403을 줍니다. 서비스에서 중복을 먼저 확인해도 동시에 들어온 요청은 DB UNIQUE 제약에서 막힐 수 있어서, 전역 예외 필터가 DB 오류(`ER_DUP_ENTRY`)도 제약 이름에 맞는 409 코드로 바꿔 응답합니다.

로그인은 없는 이메일과 틀린 비밀번호를 응답 내용과 응답 시간 모두 같게 처리합니다. 다만 회원가입 화면에서 쓰는 이메일 중복 체크 API(5주차)와 회원가입의 409는 원래 가입 여부를 알려 주는 기능이라, 실제 서비스라면 요청 횟수 제한을 함께 둬야 합니다.

## 폴더 구조 (레이어 기준)

```
src/
├── controller/   auth.controller.ts, member.controller.ts, rating.controller.ts
├── service/      auth.service.ts, member.service.ts, rating.service.ts
├── guard/        auth.guard.ts (토큰 검사, 회원 ID를 요청에 담음)
├── decorator/    login-member.decorator.ts (@LoginMember로 회원 ID 받기)
├── entity/       base-time.entity.ts, member.entity.ts, rating.entity.ts
├── dto/          요청 DTO(login-request, member-update-request, create-member, create-rating, update-rating)와 응답 DTO
├── common/       api-response.ts(공통 응답), error-code.ts(오류 코드), api.exception.ts, password.ts(bcrypt cost)
├── filter/       global-exception.filter.ts(전역 예외 처리)
├── repository/   (NestJS는 TypeORM Repository를 Service에서 바로 주입받아 비어 있음)
├── app.module.ts JwtModule 등록
└── main.ts       CORS, 전역 ValidationPipe, 전역 예외 필터
```

이 프로젝트는 ESM(`"type": "module"`)이라 상대 경로 import에 `.js` 확장자를 붙였습니다.
