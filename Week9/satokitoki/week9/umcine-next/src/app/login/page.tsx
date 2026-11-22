import type { Metadata } from "next";
import { LoginPage } from "../../screens/auth/login-page";

export const metadata: Metadata = {
  title: "로그인 | UMCine",
};

export default function Page() {
  return <LoginPage />;
}
