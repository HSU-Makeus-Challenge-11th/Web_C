import type { Metadata } from "next";
import { LoginPage } from "@/screens/auth/login-page";

export const metadata: Metadata = { title: "로그인" };

// 8주차 routes/login.tsx → app/login/page.tsx (/login)
export default function Page() {
  return <LoginPage />;
}
