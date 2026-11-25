import { serverEnv } from "@/config/server-env";

// 화면에서 쓰는 TMDB 경로만 열어 둬요. 이 Route Handler가 아무 TMDB API나 대신 호출해 주는 통로가 되지 않게 해요.
const ALLOWED_PATHS = [/^movie\/popular$/, /^movie\/\d+$/, /^search\/movie$/];

// Vite에서는 TMDB 토큰(VITE_TMDB_ACCESS_TOKEN)이 브라우저 번들에 들어가 개발자 도구에서 보였어요.
// 이제 브라우저는 우리 서버의 /api/tmdb/...로 요청하고, 토큰은 서버에서만 붙여 TMDB로 전달해요.
export async function GET(request: Request, { params }: RouteContext<"/api/tmdb/[...path]">) {
  const { path } = await params;
  const tmdbPath = path.join("/");

  if (!ALLOWED_PATHS.some((pattern) => pattern.test(tmdbPath))) {
    return Response.json({ status_message: "지원하지 않는 TMDB 경로예요." }, { status: 404 });
  }

  const { search } = new URL(request.url);
  const response = await fetch(`${serverEnv.tmdbApiBaseUrl}/${tmdbPath}${search}`, {
    headers: { Authorization: `Bearer ${serverEnv.tmdbAccessToken}` },
  });

  // TMDB의 상태 코드(404 등)를 그대로 돌려줘야 화면의 오류 처리와 TanStack Query 재시도 규칙이 그대로 동작해요.
  return new Response(response.body, {
    status: response.status,
    headers: { "Content-Type": response.headers.get("Content-Type") ?? "application/json" },
  });
}
