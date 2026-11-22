import { LoginPage } from "@/screens/auth/login-page";
import { GuestGuard } from "./guest-guard";

// 주소: /login
// 이미 로그인했으면 홈으로 보냄 (GuestGuard가 담당)
export default function Page() {
  return (
    <GuestGuard>
      <LoginPage />
    </GuestGuard>
  );
}
