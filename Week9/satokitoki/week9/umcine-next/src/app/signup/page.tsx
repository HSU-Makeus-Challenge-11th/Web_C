import type { Metadata } from "next";
import { SignupPage } from "../../screens/auth/signup-page";

export const metadata: Metadata = {
  title: "회원가입 | UMCine",
};

export default function Page() {
  return <SignupPage />;
}
