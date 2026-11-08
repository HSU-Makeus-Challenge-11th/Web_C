import { Link, useNavigate } from "@tanstack/react-router";
import { isHTTPError } from "ky";
import { useState, type SubmitEvent } from "react";
import { checkEmail } from "../../api/members/check-email";
import { checkNickname } from "../../api/members/check-nickname";
import { signup } from "../../api/members/signup";
import { AuthLayout } from "../../components/auth/auth-layout";
import {
  duplicateCheckButtonClass,
  primaryButtonClass,
} from "../../components/form/button-styles";
import { FormField } from "../../components/form/form-field";
import {
  getDuplicateCheckMessage,
  useDuplicateCheck,
} from "../../hooks/members/use-duplicate-check";
import { getApiErrorMessage } from "../../utils/get-api-error-message";
import {
  MEMBER_INPUT_ERROR_MESSAGES,
  isValidEmail,
  isValidNickname,
  isValidPassword,
} from "../../utils/members/member-validation";

const DEFAULT_FORM = {
  email: "",
  nickname: "",
  password: "",
  passwordConfirm: "",
};

type SignupFormKey = keyof typeof DEFAULT_FORM;

export function SignupPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const emailCheck = useDuplicateCheck(checkEmail, "이메일");
  const nicknameCheck = useDuplicateCheck(checkNickname, "닉네임");
  const navigate = useNavigate();

  const email = form.email.trim();
  const nickname = form.nickname.trim();

  // 입력값의 유효성 검사
  const isEmailValid = isValidEmail(email);
  const isNicknameValid = isValidNickname(nickname);
  const isPasswordValid = isValidPassword(form.password);
  const isPasswordConfirmValid =
    form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;

  // 확인한 값과 지금 값이 다르면 "idle"이라서, 값을 바꾸면 다시 확인해야 해요.
  const emailStatus = emailCheck.getStatus(email);
  const nicknameStatus = nicknameCheck.getStatus(nickname);

  // 입력 조건과 두 중복 확인을 모두 통과해야 제출할 수 있어요.
  const canSubmit =
    isEmailValid &&
    isNicknameValid &&
    isPasswordValid &&
    isPasswordConfirmValid &&
    emailStatus === "available" &&
    nicknameStatus === "available";

  // 입력을 시작한 필드에만 안내 문구를 보여 줘요.
  const emailMessage =
    form.email.length === 0
      ? undefined
      : isEmailValid
        ? getDuplicateCheckMessage(emailStatus, "이메일")
        : ({ message: MEMBER_INPUT_ERROR_MESSAGES.email, messageTone: "error" } as const);
  const nicknameMessage =
    form.nickname.length === 0
      ? undefined
      : isNicknameValid
        ? getDuplicateCheckMessage(nicknameStatus, "닉네임")
        : ({ message: MEMBER_INPUT_ERROR_MESSAGES.nickname, messageTone: "error" } as const);
  const passwordMessage =
    form.password.length === 0
      ? undefined
      : isPasswordValid
        ? ({ message: "사용할 수 있는 비밀번호예요.", messageTone: "success" } as const)
        : ({ message: MEMBER_INPUT_ERROR_MESSAGES.password, messageTone: "error" } as const);
  const passwordConfirmMessage =
    form.passwordConfirm.length === 0
      ? undefined
      : isPasswordConfirmValid
        ? ({ message: "비밀번호가 일치해요.", messageTone: "success" } as const)
        : ({ message: MEMBER_INPUT_ERROR_MESSAGES.passwordConfirm, messageTone: "error" } as const);

  const handleChangeField = (key: SignupFormKey, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    // 폼 제출 시 페이지 새로고침 방지
    event.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await signup({ email, nickname, password: form.password });
      alert(response.message);
      navigate({ to: "/login" });
    } catch (error) {
      // 중복 확인 뒤 다른 사람이 같은 값으로 먼저 가입하면 서버가 409로 막아요.
      // "사용할 수 있어요" 결과가 더는 맞지 않으므로 지우고 다시 확인하게 해요.
      if (isHTTPError(error) && error.response.status === 409) {
        emailCheck.reset();
        nicknameCheck.reset();
      }
      // 실패하면 입력값을 그대로 두어 다시 요청할 수 있어요.
      alert(getApiErrorMessage(error, "회원가입에 실패했어요. 다시 시도해 주세요."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="회원가입"
      description="UMCine에서 보고 싶은 영화를 기록해 보세요."
      footer={
        <>
          이미 계정이 있나요?{" "}
          <Link to="/login" className="font-semibold text-accent hover:underline">
            로그인
          </Link>
        </>
      }
    >
      {/* noValidate는 폼 제출 시 브라우저의 기본 유효성 검사를 꺼요. */}
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
          disabled={emailStatus === "checking"}
          {...emailMessage}
          action={
            <button
              type="button"
              className={duplicateCheckButtonClass}
              disabled={!isEmailValid || emailStatus === "checking"}
              onClick={() => emailCheck.check(email)}
            >
              {emailStatus === "checking" ? "확인 중" : "중복 확인"}
            </button>
          }
        />

        <FormField
          label="닉네임"
          icon="person"
          autoComplete="nickname"
          placeholder="2~12자로 입력해 주세요"
          value={form.nickname}
          onChange={(event) => handleChangeField("nickname", event.target.value)}
          disabled={nicknameStatus === "checking"}
          {...nicknameMessage}
          action={
            <button
              type="button"
              className={duplicateCheckButtonClass}
              disabled={!isNicknameValid || nicknameStatus === "checking"}
              onClick={() => nicknameCheck.check(nickname)}
            >
              {nicknameStatus === "checking" ? "확인 중" : "중복 확인"}
            </button>
          }
        />

        <FormField
          label="비밀번호"
          icon="lock"
          type="password"
          autoComplete="new-password"
          placeholder="영문 대소문자, 숫자, 특수문자 포함 8자 이상"
          value={form.password}
          onChange={(event) => handleChangeField("password", event.target.value)}
          {...passwordMessage}
        />

        <FormField
          label="비밀번호 확인"
          icon="lock"
          type="password"
          autoComplete="new-password"
          placeholder="비밀번호를 한 번 더 입력해 주세요"
          value={form.passwordConfirm}
          onChange={(event) => handleChangeField("passwordConfirm", event.target.value)}
          {...passwordConfirmMessage}
        />

        <button
          type="submit"
          className={`${primaryButtonClass} mt-3`}
          disabled={!canSubmit || isSubmitting}
        >
          {isSubmitting ? "가입 중" : "가입하기"}
        </button>
      </form>
    </AuthLayout>
  );
}
