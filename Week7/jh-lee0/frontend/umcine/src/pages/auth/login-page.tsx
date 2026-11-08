import { useState } from "react";
import { Link } from "@tanstack/react-router";

const DEFAULT_FORM = {
  email: "",
  password: "",
};

type LoginFormKey = keyof typeof DEFAULT_FORM;

export function LoginPage() {
  const [form, setForm] = useState(DEFAULT_FORM);

  const handleChangeField = (key: LoginFormKey, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    // 폼 제출 시 페이지 새로고침 방지
    e.preventDefault();

    // 8주차에서 로그인 API 요청 추가
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
              onChange={(e) => handleChangeField("password", e.target.value)}
              className="w-full bg-transparent text-sm outline-none placeholder:text-[#9CA3AF]"
            />
          </div>
        </div>

        <button
          type="submit"
          className="h-12 w-full rounded-md bg-[#2563EB] text-sm font-bold text-white"
        >
          로그인
        </button>

        <p className="mt-6 text-center text-xs text-[#6B7280]">
          처음이신가요?{" "}
          <Link to="/signup" className="font-bold text-[#2563EB]">
            회원가입
          </Link>
        </p>
      </form>
    </div>
  );
}