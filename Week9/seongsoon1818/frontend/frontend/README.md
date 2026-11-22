# UMCine — Next.js App Router

영화 목록, 검색, 상세, 회원·평점, 로그인, 내 정보 화면을 Next.js App Router로 제공합니다.

## 실행

```powershell
pnpm install
pnpm dev
```

`.env.example`을 참고해 `.env` 또는 `.env.local`에 다음 값을 설정합니다.

```dotenv
NEXT_PUBLIC_TMDB_API_BASE_URL=https://api.themoviedb.org/3
NEXT_PUBLIC_TMDB_ACCESS_TOKEN=발급받은_API_READ_ACCESS_TOKEN
NEXT_PUBLIC_BACKEND_API_BASE_URL=http://localhost:3000
```

TMDB API Read Access Token 앞에 `Bearer `를 붙이지 않습니다. `NEXT_PUBLIC_` 값은 브라우저 번들에 포함됩니다. 토큰을 숨겨야 한다면 영화 요청을 서버 API로 옮겨야 합니다.

## 라우트

| 경로 | 화면 |
| --- | --- |
| `/` (`?page=2`) | 인기 영화 목록 |
| `/search` (`?query=love&page=2`) | 영화 검색 |
| `/movies/155` | 영화 상세와 내 평점 |
| `/members` | 회원 확인과 평점 목록 |
| `/login`, `/signup` | 로그인, 회원가입 |
| `/me`, `/me/edit` | 내 정보와 수정 |

`src/app`의 Server Component가 URL 매개변수를 읽고, `src/screens`의 Client Component가 TanStack Query, 폼, 브라우저 상태를 처리합니다. 공통 Query Provider와 저장소 재수화는 `src/app/providers.tsx`에 있습니다. 인증 정보가 localStorage에 있으므로 `/me` 접근 제어는 재수화 뒤 클라이언트에서 수행됩니다.

## 검증

```powershell
pnpm build
pnpm lint
pnpm typecheck
```

This product uses the TMDB API but is not endorsed or certified by TMDB.

