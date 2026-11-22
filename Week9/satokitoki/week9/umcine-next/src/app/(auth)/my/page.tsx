import type { Metadata } from "next";
import { MyPage } from "../../../screens/members/my-page";

export const metadata: Metadata = {
  title: "내 정보 | UMCine",
};

export default function Page() {
  return <MyPage />;
}
