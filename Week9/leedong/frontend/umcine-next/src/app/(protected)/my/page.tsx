import type { Metadata } from "next";
import { MyPage } from "@/views/my/my-page";

export const metadata: Metadata = {
  title: "내 정보",
};

export default function Page() {
  return <MyPage />;
}
