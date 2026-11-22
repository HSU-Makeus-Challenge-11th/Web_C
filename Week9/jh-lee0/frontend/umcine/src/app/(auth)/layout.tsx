import type { ReactNode } from "react";
import { AuthGuard } from "./auth-guard";

// 8주차 미션: 로그인한 사람만 들어갈 수 있는 페이지들의 공통 레이아웃
// 폴더 이름이 ( )로 감싸져 있어서 주소에는 안 나타남 (/my, /my/edit 그대로)
// 로그인 안 했으면 로그인 페이지로 보냄 (검사는 브라우저에서 하므로 AuthGuard(Client Component)가 담당)
export default function AuthLayout({ children }: { children: ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
