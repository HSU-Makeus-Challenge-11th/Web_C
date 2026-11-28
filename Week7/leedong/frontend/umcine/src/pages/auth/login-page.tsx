import { useState, type SubmitEvent } from "react";
import { Link } from "@tanstack/react-router";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DEFAULT_FORM = {
  email: "",
  password: "",
};

type FormKey = keyof typeof DEFAULT_FORM;

const labelClass = "text-xs font-extrabold text-[#17191e]";
const inputClass =
  "h-[50px] w-full rounded-lg border border-[#e3e6eb] bg-white pl-11 pr-4 text-sm outline-none placeholder:text-[#9aa1ad] focus:border-[#2563eb]";
const iconClass =
  "pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#606774]";
const errorClass = "text-xs font-semibold text-[#e5484d]";

function MailIcon() {
  return (
    <svg
      className={iconClass}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      className={iconClass}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

export function LoginPage() {
  const [form, setForm] = useState(DEFAULT_FORM);

  const isEmailValid = EMAIL_REGEX.test(form.email.trim());
  const isPasswordValid = form.password.length > 0;
  const showEmailError = form.email.length > 0 && !isEmailValid;
  const canSubmit = isEmailValid && isPasswordValid;

  const handleChangeField = (key: FormKey, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;
    // TODO: 8주차에서 로그인 API 연동
  };

  return (
    <main className="flex min-h-[calc(100vh-91px)] items-center justify-center bg-[#f6f7f9] px-5 py-10">
      <div className="w-full max-w-[430px]">
        <h1 className="text-[28px] font-extrabold tracking-[-0.7px]">로그인</h1>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-4 flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="login-email" className={labelClass}>
              이메일
            </label>
            <div className="relative">
              <MailIcon />
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                className={inputClass}
                placeholder="name@example.com"
                value={form.email}
                onChange={(e) => handleChangeField("email", e.target.value)}
              />
            </div>
            {showEmailError && (
              <p className={errorClass}>올바른 이메일 형식이 아니에요.</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="login-password" className={labelClass}>
              비밀번호
            </label>
            <div className="relative">
              <LockIcon />
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                className={inputClass}
                placeholder="비밀번호"
                value={form.password}
                onChange={(e) => handleChangeField("password", e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-2 h-12 w-full rounded-lg bg-[#2563eb] text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:bg-[#b6c8f5]"
          >
            로그인
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-[#606774]">
          처음이신가요?{" "}
          <Link to="/signup" className="font-extrabold text-[#2563eb]">
            회원가입
          </Link>
        </p>
      </div>
    </main>
  );
}