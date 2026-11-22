import type { Metadata } from "next";
import { MyEditPage } from "../../../../screens/members/my-edit-page";

export const metadata: Metadata = {
  title: "내 정보 수정 | UMCine",
};

export default function Page() {
  return <MyEditPage />;
}
