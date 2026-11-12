import { Link } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { AuthLayout } from "../../components/auth/auth-layout";
import { primaryButtonClass } from "../../components/form/button-styles";
import { FormField } from "../../components/form/form-field";
import { useLoginMutation } from "../../hooks/auth/use-login-mutation";
import { cn } from "../../utils/cn";
import {
  MEMBER_INPUT_ERROR_MESSAGES,
  isValidEmail,
} from "../../utils/members/member-validation";

const DEFAULT_FORM = {
  email: "",
  password: "",
};

type LoginFormKey = keyof typeof DEFAULT_FORM;

export function LoginPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const loginMutation = useLoginMutation();

  const email = form.email.trim();
  const isEmailValid = isValidEmail(email);
  // 로그인에서는 비밀번호 형식을 알려 주지 않고, 입력했는지만 확인해요.
  const isPasswordFilled = form.password.length > 0;
  const canSubmit = isEmailValid && isPasswordFilled;

  // 입력을 시작한 필드에만 오류를 보여 줘요.
  const showEmailError = form.email.length > 0 && !isEmailValid;

  const handleChangeField = (key: LoginFormKey, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || loginMutation.isPending) return;

    loginMutation.mutate({ email, password: form.password });
  };

  return (
    <AuthLayout
      title="로그인"
      description="UMCine 계정으로 로그인해 주세요."
      footer={
        <>
          아직 회원이 아니신가요?{" "}
          <Link to="/signup" className="font-semibold text-accent hover:underline">
            회원가입
          </Link>
        </>
      }
    >
      <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
        <FormField
          label="이메일"
          icon="mail"
          type="email"
          autoComplete="email"
          placeholder="example@umc.com"
          value={form.email}
          onChange={(event) => handleChangeField("email", event.target.value)}
          // 요청 중에는 값을 바꾸지 못하게 해요.
          disabled={loginMutation.isPending}
          message={showEmailError ? MEMBER_INPUT_ERROR_MESSAGES.email : undefined}
          messageTone="error"
        />

        <FormField
          label="비밀번호"
          icon="lock"
          type="password"
          autoComplete="current-password"
          placeholder="비밀번호를 입력해 주세요"
          value={form.password}
          onChange={(event) => handleChangeField("password", event.target.value)}
          disabled={loginMutation.isPending}
        />

        <button
          type="submit"
          className={cn(primaryButtonClass, "mt-3")}
          disabled={!canSubmit || loginMutation.isPending}
        >
          {loginMutation.isPending ? "로그인 중" : "로그인"}
        </button>
      </form>
    </AuthLayout>
  );
}
