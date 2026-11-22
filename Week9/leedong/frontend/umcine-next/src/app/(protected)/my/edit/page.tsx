import type { Metadata } from "next";
import { MyEditPage } from "@/views/my/my-edit-page";

export const metadata: Metadata = {
  title: "내 정보 수정",
};

export default function Page() {
  return <MyEditPage />;
}
