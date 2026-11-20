import type { Metadata } from "next";
import { MyInfoPage } from "@/screens/my/my-info-page";

export const metadata: Metadata = { title: "마이페이지" };

// 로그인 확인은 브라우저에서 localStorage의 토큰을 읽은 뒤에야 할 수 있어서, (protected)/layout.tsx는 그 전까지 이 페이지를 그리지 않아요.
// Cache Components는 개발 중에 "그리지 않은(dropped) 페이지라 즉시 이동(instant navigation)을 확인할 수 없다"고 알려 주는데,
// 일부러 기다리는 페이지라 instant = false로 검사에서 빼요. (미리 렌더링과 스트리밍은 그대로 해요.)
export const instant = false;

// 8주차 routes/(protected)/my/index.tsx → app/(protected)/my/page.tsx (/my)
export default function Page() {
  return <MyInfoPage />;
}
