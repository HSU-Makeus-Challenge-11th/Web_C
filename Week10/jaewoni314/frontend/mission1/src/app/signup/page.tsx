import type { Metadata } from "next";
import { SignupPage } from "@/screens/auth/signup-page";

export const metadata: Metadata = { title: "회원가입" };

// 8주차 routes/signup.tsx → app/signup/page.tsx (/signup)
export default function Page() {
  return <SignupPage />;
}
