import type { SubmitEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { AccountPanel } from "../../components/account-panel";
import { useProfilePreview } from "../../stores/profile-preview-store";

export function LoginPage() {
  const navigate = useNavigate();
  const { profile, saveProfile } = useProfilePreview();

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email")).trim();
    if (email !== profile.email) {
      saveProfile({ email, nickname: "영화팬" });
    }
    void navigate({ to: "/me" });
  }

  return (
    <AccountPanel title="로그인" description="로그인 화면 미리보기입니다. 테스트용 이메일과 비밀번호를 입력해 주세요.">
      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="account-label">
          이메일
          <input className="account-input" type="email" name="email" autoComplete="username"
            placeholder="name@example.com" required />
        </label>
        <label className="account-label">
          비밀번호
          <input className="account-input" type="password" name="password" autoComplete="off"
            placeholder="테스트용 비밀번호" required />
        </label>
        <button type="submit" className="account-primary w-full">로그인</button>
      </form>
      <div className="mt-6 border-t border-gray-200 pt-5 text-center text-sm">
        <Link to="/signup" className="font-semibold text-brand hover:underline">회원가입</Link>
      </div>
    </AccountPanel>
  );
}
