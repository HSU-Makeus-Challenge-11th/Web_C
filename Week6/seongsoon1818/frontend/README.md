# UMCine — Week 6

TMDB 영화 목록·검색·상세 요청을 TanStack Query로 관리합니다.
실제 HTTP 요청은 ky, 북마크는 Zustand와 localStorage를 사용합니다.

## 실행

```powershell
pnpm install
```

`.env.local`이 없다면 `.env.example`을 복사하고 값을 채웁니다.
이미 설정한 파일이 있다면 그대로 사용하세요.

```dotenv
VITE_TMDB_API_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_ACCESS_TOKEN=발급받은_API_READ_ACCESS_TOKEN
```

[TMDB API 설정](https://www.themoviedb.org/settings/api)의 API Read Access Token을 사용합니다.
토큰 앞에 `Bearer `를 붙이지 않습니다. 환경 변수를 수정하면 개발 서버를 다시 시작합니다.

```powershell
pnpm dev
```

## 화면과 query key

| 화면 | URL 예시 | query key |
| --- | --- | --- |
| 목록 | `/?page=2` | `["movies", "list", { page }]` |
| 검색 | `/search?query=love&page=2` | `["movies", "search", { query: normalizedQuery, page }]` |
| 상세 | `/movies/155` | `["movies", "detail", movieId]` |

요청 결과를 바꾸는 검색어·페이지·영화 ID를 key에 포함합니다.
검색어가 비어 있거나 영화 ID가 올바르지 않으면 `enabled: false`로 요청하지 않습니다.
로딩·오류·빈 결과·성공 상태를 구분하고 오류 화면의 다시 시도 버튼은 `refetch()`를 호출합니다.

## queryOptions로 요청 설정 재사용

`src/queries/movie-query-options.ts`에서 목록·검색·상세의 `queryKey`와 `queryFn`을 함께 정의합니다.
기존 API 요청 타입을 재사용하며, `queryOptions`가 응답 타입을 추론하므로 화면에서 별도의 제네릭을 지정하지 않습니다.

```tsx
const moviesQuery = useQuery(movieListQueryOptions({ page }));

const searchQuery = useQuery({
  ...movieSearchQueryOptions({ query: normalizedQuery, page }),
  enabled: normalizedQuery.length > 0,
});

const movieDetailQuery = useQuery({
  ...movieDetailQueryOptions(movieId),
  enabled: isValidMovieId,
});
```

요청 실행 여부를 정하는 `enabled`는 화면에 두고, 캐시 시간은 `main.tsx`의 공통 설정을 사용합니다.
리팩터링 전후의 query key와 요청 인자는 같습니다.
참고: [TanStack Query의 queryOptions](https://tanstack.com/query/latest/docs/framework/react/guides/query-options)

## 캐시와 요청 확인

`main.tsx`의 설정:

- `staleTime: 60_000`: 성공 데이터를 1분 동안 fresh로 취급합니다.
- `gcTime: 300_000`: 사용하지 않는 캐시는 5분 후 정리합니다.
- Query 개발자 도구는 개발 서버에서 표시합니다.

1. 브라우저에서 앱을 열고 화면 구석의 TanStack Query 아이콘을 누릅니다.
2. F12 → Network → Fetch/XHR에서 `api.themoviedb.org` 요청을 확인합니다.
3. 목록 → 영화 상세 → 브라우저 뒤로가기를 1분 안에 수행합니다.
4. Query 개발자 도구에는 목록·상세 key가 남고, 목록으로 돌아올 때 추가 목록 요청이 없어야 합니다.
5. 검색 결과의 1페이지 → 2페이지 → 뒤로가기도 같은 방법으로 확인합니다.

1분이 지나면 데이터는 stale이 되며, 이후 화면을 다시 열 때 캐시를 먼저 표시하면서 갱신할 수 있습니다.
1분마다 자동으로 요청하는 설정은 아닙니다.
브라우저 새로고침은 앱과 메모리 캐시를 다시 생성하므로, 앱 안에서 화면을 재방문하는 것과 구분합니다.

자세한 구현 위치와 검증 결과는 [6주차 미션 기록](docs/week6-query-mission.md)에 정리했습니다.

## 검증

```powershell
pnpm build
pnpm lint
```

## 주요 파일

- `src/main.tsx`: QueryClient, Provider, 캐시 시간, Query Devtools
- `src/pages/movies/`: useQuery와 화면 상태, URL 페이지 관리
- `src/queries/movie-query-options.ts`: queryOptions로 목록·검색·상세의 요청 설정 재사용
- `src/api/movies/`: ky API 함수와 응답 타입
- `src/adapters/movie-adapter.ts`: TMDB 응답을 영화 카드 UI 타입으로 변환
- `src/components/root-layout.tsx`: 공통 레이아웃과 TMDB 출처 표기

순수 fetch 실습은 개발 서버의 `/fetch-example.html`에서 별도로 실행할 수 있습니다.
`.env.local`은 Git에 올리지 않습니다. VITE_ 환경 변수는 브라우저 빌드에 포함됩니다.

This product uses the TMDB API but is not endorsed or certified by TMDB.
