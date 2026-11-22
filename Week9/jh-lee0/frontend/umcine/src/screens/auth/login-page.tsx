"use client";

import { useState } from "react";
import Link from "next/link";
import { useLoginMutation } from "@/hooks/use-login-mutation"; // ★ 2.4 추가: 로그인 mutation 훅

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // ★ 2.4 추가: 이메일 형식 검사

const DEFAULT_FORM = { // 이메일, 비밀번호를 하나의 객체로 묶어 관리
  email: "",
  password: "",
};

type LoginFormKey = keyof typeof DEFAULT_FORM; // email, password만 될 수 있는 타입인 LoginFormKey를 정의

export function LoginPage() {
  const [form, setForm] = useState(DEFAULT_FORM); // 여기서 form은 객체

  // form에서 칸 하나(key)를 새 값(value)로 바꾸는 함수
  // setForm은 위의 useState 함수
  const handleChangeField = (key: LoginFormKey, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }; // ...prev는  email: from.email, password: from.password와 같다! 객체를 풀어서 복사하는 것

  const loginMutation = useLoginMutation(); // ★ 2.4 추가: 훅 실행

  // ★ 2.4 추가: 이메일 형식이 맞고 비밀번호가 비어 있지 않아야 제출 가능
  const canSubmit = EMAIL_REGEX.test(form.email.trim()) && form.password.length > 0;

  // ★ 2.4 변경: 비어 있던 handleSubmit에 로그인 요청 추가
  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    // 폼 제출 시 페이지 새로고침 방지
    e.preventDefault();

    if (!canSubmit || loginMutation.isPending) return; // 조건 안 맞거나 보내는 중이면 중단

    loginMutation.mutate({
      email: form.email.trim(),
      password: form.password,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F6F7F9] px-4">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-[430px]"
      >
        <h1 className="mb-5 text-[32px] font-bold text-[#111111]">로그인</h1>

        {/* 이메일 */}
        <div className="mb-5">
          <label className="mb-2 block text-xs font-bold text-[#111111]">
            이메일
          </label>
          <div className="flex h-12 items-center gap-2 rounded-md border border-[#E3E5EA] bg-white px-4">
            {/* 메일 아이콘 */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6B7280"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
            <input
              type="email"
              placeholder="name@example.com"
              // 입력칸 연결: 이메일 칸(59~60)
              value={form.email}
              onChange={(e) => handleChangeField("email", e.target.value)}
              className="w-full bg-transparent text-sm outline-none placeholder:text-[#9CA3AF]"
            />
          </div>
        </div>

        {/* 비밀번호 */}
        <div className="mb-4">
          <label className="mb-2 block text-xs font-bold text-[#111111]">
            비밀번호
          </label>
          <div className="flex h-12 items-center gap-2 rounded-md border border-[#E3E5EA] bg-white px-4">
            {/* 자물쇠 아이콘 */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6B7280"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0"
            >
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
            <input
              type="password"
              placeholder="비밀번호"
              value={form.password}
              // 입력칸 연결: 비밀번호 칸(92~93)
              onChange={(e) => handleChangeField("password", e.target.value)}
              className="w-full bg-transparent text-sm outline-none placeholder:text-[#9CA3AF]"
            />
          </div>
        </div>

        {/* ★ 2.4 변경: 조건 안 맞거나 보내는 중이면 비활성화, 보내는 중이면 "로그인 중" 표시 */}
        <button
          type="submit"
          disabled={!canSubmit || loginMutation.isPending}
          className="h-12 w-full rounded-md bg-[#2563EB] text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loginMutation.isPending ? "로그인 중" : "로그인"}
        </button>

        <p className="mt-6 text-center text-xs text-[#6B7280]">
          처음이신가요?{" "}
          <Link href="/signup" className="font-bold text-[#2563EB]">
            회원가입
          </Link>
        </p>
      </form>
    </div>
  );
}