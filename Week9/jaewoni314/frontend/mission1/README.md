# Week9 Frontend - UMCine를 Next.js로 옮기기

8주차 UMCine(Vite + React + TanStack Router/Query + ky + Zustand)의 기능을 그대로 유지하면서 **Next.js 16 App Router** 프로젝트로 마이그레이션했습니다.
백엔드는 같은 브랜치의 [Week9 NestJS 서버](../../backend/mission1/README.md)(`http://localhost:3000`)를 사용합니다.

미션 기록(캡처, 핵심 키워드, 트러블 슈팅)은 [docs/mission-record.md](docs/mission-record.md)에 정리했습니다.

## 실행 방법

```bash
cp .env.example .env.local   # TMDB 토큰(TMDB_ACCESS_TOKEN)과 백엔드 주소 입력
pnpm install
pnpm dev                     # http://localhost:5173
pnpm build && pnpm start     # 프로덕션 빌드 확인
```

- 백엔드(NestJS)가 3000번 포트를 쓰고 CORS로 `http://localhost:5173`만 허용해서, Next.js 개발 서버도 8주차 Vite와 같은 **5173번**으로 띄웁니다. (`next dev -p 5173`)
- `TMDB_ACCESS_TOKEN`에는 `NEXT_PUBLIC_`을 붙이지 않습니다. 서버(Route Handler, `generateMetadata`)에서만 읽어 브라우저 번들에 들어가지 않습니다.

## 8주차 → 9주차 라우트 대응표

| 주소 | 8주차 (TanStack Router) | 9주차 (Next.js App Router) |
| --- | --- | --- |
| `/` (`?page=`) | `routes/index.tsx` + `validateSearch` | `app/page.tsx` + `useSearchParams` (Suspense) |
| `/search` (`?query=`) | `routes/search.tsx` | `app/search/page.tsx` |
| `/movies/550` | `routes/movies.$movieId.tsx` | `app/movies/[movieId]/page.tsx` + `generateMetadata` |
| `/login`, `/signup`, `/members` | `routes/login.tsx` 등 | `app/login/page.tsx` 등 |
| `/my`, `/my/edit` (로그인 전용) | `routes/(protected)/route.tsx` + `beforeLoad` | `app/(protected)/layout.tsx` + `ProtectedLayout` |
| 공통 헤더/푸터 | `routes/__root.tsx` + `<Outlet />` | `app/layout.tsx` + `{children}` |
| 없는 주소 | `notFoundComponent` | `app/not-found.tsx` |
| (새로 추가) TMDB 프록시 | - | `app/api/tmdb/[...path]/route.ts` |

| TanStack Router API | Next.js API |
| --- | --- |
| `<Link to="/movies/$movieId" params={{ movieId }}>` | `<Link href={`/movies/${movieId}`}>` (`next/link`) |
| `useNavigate()` → `navigate({ to })` | `useRouter()` → `router.push(href)` (`next/navigation`) |
| `useSearch({ from })` | `useSearchParams().get(...)` |
| `useParams({ from })` | page의 `params` (Server Component에서 `await`) |
| `<Link activeProps>` | `usePathname()`으로 직접 비교 (`NavLink`) |
| `beforeLoad` + `redirect()` | Client Component에서 토큰을 읽은 뒤 `router.replace()` |
| `import.meta.env.VITE_*` | `process.env.NEXT_PUBLIC_*` (브라우저) / `process.env.*` (서버 전용) |

## 폴더 구조

```
src/
├── app/                  App Router (page, layout은 Server Component)
│   ├── layout.tsx        Root Layout: 메타데이터, next/font(Pretendard), QueryProvider, Header/Footer
│   ├── page.tsx          / (영화 목록)
│   ├── search/           /search
│   ├── movies/[movieId]/ /movies/:id (generateMetadata)
│   ├── login/ signup/ members/
│   ├── (protected)/      Route Group: layout.tsx(로그인 확인) + my/, my/edit/
│   ├── api/tmdb/[...path]/route.ts  TMDB 프록시 (토큰을 서버에서만 붙임)
│   └── not-found.tsx
├── screens/              화면 컴포넌트 ("use client"). 8주차 src/pages에서 이름만 바꿈
├── components/           layout(header, nav-link, footer, protected-layout), providers, movies, my, ratings, form, auth
├── api/                  ky 클라이언트, query/mutation options (8주차와 같음)
├── hooks/ stores/ utils/ 8주차와 같음 (라우터 API만 next/navigation으로 교체)
└── config/               env.ts(브라우저용), server-env.ts(서버 전용, server-only)
```
