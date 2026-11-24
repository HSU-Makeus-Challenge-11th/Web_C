# UMCine (Next.js)

Vite + TanStack Router로 만든 UMCine를 Next.js(App Router)로 옮긴 프로젝트예요.

## 실행

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # 빌드 후 경로별 렌더링 방식 확인
```

## 환경 변수 (`.env.local`)

```
NEXT_PUBLIC_TMDB_API_BASE_URL=
NEXT_PUBLIC_TMDB_ACCESS_TOKEN=
NEXT_PUBLIC_API_BASE_URL=
```

Vite의 `VITE_*`는 `NEXT_PUBLIC_*`로 바꿨어요. 브라우저에서 읽는 값이라 이름 앞에 `NEXT_PUBLIC_`이 필요해요.

## 구조

- `src/app`: App Router 페이지(Server Component). 제목(metadata)과 라우트만 담당해요.
- `src/views`: 화면 본문(Client Component). 기존 `pages` 폴더 이름을 바꿨어요. Next.js는 `pages`를 Pages Router로 인식해요.
- `src/providers`: QueryClientProvider, 로그인 토큰 복원(AuthHydrator)
- `src/components/auth`: 로그인 여부에 따라 화면을 막거나 이동시키는 가드
