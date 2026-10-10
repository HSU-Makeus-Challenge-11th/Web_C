# UMCine — Week 5

TMDB의 인기 영화, 영화 검색, 상세 정보를 보여 주는 React + TypeScript 프로젝트입니다.
요청은 ky와 useEffect로 처리하고, 북마크는 Zustand store와 localStorage에 저장합니다.

## 실행

```powershell
pnpm install
Copy-Item .env.example .env.local
```

이미 `.env.local`이 있으면 복사 명령을 건너뛰고 값을 수정하세요.

```dotenv
VITE_TMDB_API_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_ACCESS_TOKEN=발급받은_API_READ_ACCESS_TOKEN
```

[TMDB API 설정](https://www.themoviedb.org/settings/api)에서 **API Read Access Token**을 가져오세요.
API Key 대신 Read Access Token 값을 넣고, 앞에 `Bearer `를 붙이지 않습니다.
환경 변수를 바꾸면 개발 서버를 재시작해야 합니다.

```powershell
pnpm dev
```

## 확인할 화면

- `/`: 인기 영화 목록 및 페이지 이동
- `/search`: 빈 검색어 안내
- `/search?query=인터스텔라`: 검색 결과 (직접 접근과 새로고침 지원)
- `/movies/157336`: TMDB 영화 상세
- `/movies/abc`: 잘못된 영화 번호 안내, API 요청 없음
- 존재하지 않는 양의 정수 영화 ID: 404 전용 안내

목록·검색·상세는 로딩, 오류, 빈 결과를 구분합니다.
이미지가 없는 영화는 대체 영역을 보여 주며, 검색어를 바꾸면 이전 응답을 무시합니다.
환경 변수가 빠져 있으면 앱에서 설정 안내를 보여 줍니다.

## 검증

```powershell
pnpm build
pnpm lint
```

라우트는 Vite의 TanStack Router 플러그인이 `src/routeTree.gen.ts`로 생성합니다.
생성 파일은 직접 수정하지 않습니다. Tailwind CSS는 Vite 플러그인으로 처리합니다.

## 주요 코드

- `src/App.tsx`: RouterProvider와 환경 변수 안내
- `src/api/tmdb-client.ts`: ky 2.x의 baseUrl과 Bearer 인증
- `src/api/movies/`: 목록·검색·상세 요청과 응답 타입, 순수 fetch 예제
- `src/pages/movies/`: 요청 상태 및 화면 표시
- `src/utils/movies/tmdb-image.ts`: TMDB 이미지 주소 생성

`.env.local`은 Git에 올리지 않습니다. VITE_ 환경 변수는 브라우저 빌드에 포함됩니다.
이 프로젝트는 워크북의 프론트 직접 호출 실습 방식입니다.

This product uses the TMDB API but is not endorsed or certified by TMDB.

## 5주차 필수 미션

구현 위치와 실제 API 검증 결과는 [필수 미션 기록](docs/week5-mission.md)에 정리했습니다.

순수 fetch 실습은 개발 서버의 `/fetch-example.html`에서 실행합니다.
F12 → Network → Fetch/XHR를 연 뒤 **인기 영화 요청** 버튼을 누르면 요청을 한 번 보내고 응답 JSON을 표시합니다.
일반 앱의 목록·검색·상세 요청은 ky를 사용합니다.

## 5주차 선택 미션

- 목록·검색·상세 요청 실패 시 **다시 시도** 버튼으로 마지막 요청 조건을 재사용합니다.
- `/?page=3`, `/search?query=love&page=2`처럼 URL에서 페이지 번호를 관리합니다.
- 새 검색은 1페이지로 시작하고, 새로고침·뒤로/앞으로 이동 시 URL의 페이지를 복원합니다.
- `toMovieCardData` adapter가 TMDB 응답을 기존 camelCase 카드 UI 데이터로 변환합니다.

추가·수정한 파일과 검증 결과는 [선택 미션 변경 기록](docs/week5-optional-mission.md)에 정리했습니다.
