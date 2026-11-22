"use client";

import { useState, type SubmitEvent } from "react";
import Link from "next/link";
import { AccountPanel } from "../../components/account-panel";
import { useLoginMutation } from "../../hooks/use-login-mutation";
import { useAuthHydrated } from "../../hooks/use-auth-hydrated";
import { useAuthStore } from "../../stores/auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage() {
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const accessToken = useAuthStore((state) => state.accessToken);
  useEffect(() => {
    if (hydrated && accessToken) router.replace("/");
  }, [hydrated, accessToken, router]);
  const [form, setForm] = useState({ email: "", password: "" });
  const loginMutation = useLoginMutation();
  const canSubmit = EMAIL_REGEX.test(form.email.trim()) && form.password.length > 0;

  if (!hydrated || accessToken) return null;

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || loginMutation.isPending) return;

    loginMutation.mutate({
      email: form.email.trim(),
      password: form.password,
    });
  }

  return (
    <AccountPanel title="로그인" description="가입한 이메일과 비밀번호를 입력해 주세요.">
      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="account-label">
          이메일
          <input
            className="account-input"
            type="email"
            name="email"
            autoComplete="username"
            placeholder="name@example.com"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            required
          />
        </label>
        <label className="account-label">
          비밀번호
          <input
            className="account-input"
            type="password"
            name="password"
            autoComplete="current-password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            required
          />
        </label>
        <button type="submit" className="account-primary w-full" disabled={!canSubmit || loginMutation.isPending}>
          {loginMutation.isPending ? "로그인 중" : "로그인"}
        </button>
      </form>
      <div className="mt-6 border-t border-gray-200 pt-5 text-center text-sm">
        <Link href="/signup" className="font-semibold text-brand hover:underline">회원가입</Link>
      </div>
    </AccountPanel>
  );
}
