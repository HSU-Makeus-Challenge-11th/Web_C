import type { Metadata } from "next";
import { MembersPage } from "@/screens/members/members-page";

export const metadata: Metadata = { title: "회원 API 연습" };

// 8주차 routes/members.tsx → app/members/page.tsx (/members)
export default function Page() {
  return <MembersPage />;
}
