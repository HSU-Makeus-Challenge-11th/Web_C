import type { Metadata } from "next";
import { SignupPage } from "@/views/auth/signup-page";

export const metadata: Metadata = {
  title: "회원가입",
};

export default function Page() {
  return <SignupPage />;
}
