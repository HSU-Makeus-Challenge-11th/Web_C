import { useState, type SubmitEvent } from "react";
import { Link } from "@tanstack/react-router";
import { useLoginMutation } from "../../hooks/use-login-mutation";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DEFAULT_FORM = {
  email: "",
  password: "",
};

type LoginFormKey = keyof typeof DEFAULT_FORM;

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
    >
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

export function LoginPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const loginMutation = useLoginMutation();

  const isEmailValid = EMAIL_REGEX.test(form.email.trim());
  const showEmailError = form.email.length > 0 && !isEmailValid;
  const canSubmit = isEmailValid && form.password.length > 0;

  const handleChangeField = (key: LoginFormKey, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || loginMutation.isPending) return;

    loginMutation.mutate({
      email: form.email.trim(),
      password: form.password,
    });
  };

  const inputWrapperClassName = (hasError: boolean) =>
    [
      "flex items-center gap-2 rounded-md border bg-white px-3 text-gray-400",
      hasError
        ? "border-red-400 focus-within:border-red-500"
        : "border-gray-200 focus-within:border-blue-500",
    ].join(" ");

  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gray-50 px-4 py-16">
      <form onSubmit={handleSubmit} noValidate className="w-full max-w-md">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">로그인</h1>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="mb-1.5 block text-xs font-semibold text-gray-900"
          >
            이메일
          </label>
          <div className={inputWrapperClassName(showEmailError)}>
            <MailIcon />
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={(e) => handleChangeField("email", e.target.value)}
              className="w-full py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400"
            />
          </div>
          {showEmailError && (
            <p className="mt-1.5 text-xs text-red-500">
              이메일 형식을 확인해 주세요.
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="mb-1.5 block text-xs font-semibold text-gray-900"
          >
            비밀번호
          </label>
          <div className={inputWrapperClassName(false)}>
            <LockIcon />
            <input
              id="password"
              type="password"
              placeholder="비밀번호"
              value={form.password}
              onChange={(e) => handleChangeField("password", e.target.value)}
              className="w-full py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!canSubmit || loginMutation.isPending}
          className="w-full rounded-md bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {loginMutation.isPending ? "로그인 중" : "로그인"}
        </button>

        <p className="mt-6 text-center text-xs text-gray-500">
          처음이신가요?{" "}
          <Link to="/signup" className="font-semibold text-blue-600">
            회원가입
          </Link>
        </p>
      </form>
    </main>
  );
}
