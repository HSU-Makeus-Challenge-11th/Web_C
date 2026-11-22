import type { Metadata } from "next";
import { GuestGuard } from "@/components/auth/auth-guards";
import { LoginPage } from "@/views/auth/login-page";

export const metadata: Metadata = {
  title: "로그인",
};

export default function Page() {
  return (
    <GuestGuard>
      <LoginPage />
    </GuestGuard>
  );
}
