import { useState, type SubmitEvent } from "react";
// import { useNavigate } from "@tanstack/react-router";
import { cn } from "../../utils/cn";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { signup } from "../../api/members/signup";

// 이메일 형식 검사
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 영문 대소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 8자 이상
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

const DEFAULT_FORM = {
  email: "",
  nickname: "",
  password: "",
  passwordConfirm: "",
};

const DEFAULT_DUPLICATE_CHECK = {
  isChecking: false,
  isAvailable: false,
};

type DefaultFormKey = keyof typeof DEFAULT_FORM;
type DefaultFormValue = (typeof DEFAULT_FORM)[DefaultFormKey];
type DuplicateCheckKey = "email" | "nickname";

export function SignupPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [duplicateCheck, setDuplicateCheck] = useState({
    email: DEFAULT_DUPLICATE_CHECK,
    nickname: DEFAULT_DUPLICATE_CHECK,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const navigate = useNavigate();

  // 입력값의 유효성 검사
  const isEmailValid = EMAIL_REGEX.test(form.email.trim());
  const isNicknameValid =
    form.nickname.trim().length >= 2 && form.nickname.trim().length <= 12;
  const isPasswordValid = PASSWORD_REGEX.test(form.password);
  const isPasswordConfirmValid =
    form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;

  // 입력을 시작한 필드에만 오류 표시
  const showEmailError = form.email.length > 0 && !isEmailValid;
  const showNicknameError = form.nickname.length > 0 && !isNicknameValid;
  const showPasswordError = form.password.length > 0 && !isPasswordValid;
  const showPasswordConfirmError =
    form.passwordConfirm.length > 0 && !isPasswordConfirmValid;

  // 모든 입력값이 유효한지
  const isFormValid =
    isEmailValid &&
    isNicknameValid &&
    isPasswordValid &&
    isPasswordConfirmValid;

  // 입력 조건과 두 중복 확인을 모두 통과해야 제출 가능
  const canSubmit =
    isFormValid &&
    duplicateCheck.email.isAvailable &&
    duplicateCheck.nickname.isAvailable;

  const handleChangeField = (key: DefaultFormKey, value: DefaultFormValue) => {
    if (key === "email" || key === "nickname") {
      if (duplicateCheck[key].isChecking) return;
      // 확인한 값을 바꾸면 다시 중복 확인해야 함
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: DEFAULT_DUPLICATE_CHECK,
      }));
    }
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCheckDuplicate = async (key: DuplicateCheckKey) => {
    const isValid = key === "email" ? isEmailValid : isNicknameValid;
    if (!isValid || duplicateCheck[key].isChecking) return;

    const label = key === "email" ? "이메일" : "닉네임";
    setDuplicateCheck((prev) => ({
      ...prev,
      [key]: { isChecking: true, isAvailable: false },
    }));

    try {
      const response =
        key === "email"
          ? await checkEmailDuplicate(form.email.trim())
          : await checkNicknameDuplicate(form.nickname.trim());
      const isAvailable = response.available;
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isAvailable },
      }));
      alert(
        isAvailable
          ? `사용할 수 있는 ${label}이에요.`
          : `이미 사용 중인 ${label}이에요.`,
      );
    } catch {
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isAvailable: false },
      }));
      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isChecking: false },
      }));
    }
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    // 폼 제출 시 페이지 새로고침 방지
    e.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await signup({
        email: form.email.trim(),
        nickname: form.nickname.trim(),
        password: form.password,
      });
      alert(response.message);
      // 로그인 페이지 연결 후 주석 해제
      // navigate({ to: "/login" });
    } catch {
      alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClassName = (hasError: boolean) =>
    cn(
      "w-full rounded-md border bg-white px-3 py-2.5 text-sm outline-none placeholder:text-gray-400 disabled:bg-gray-100",
      hasError
        ? "border-red-400 focus:border-red-500"
        : "border-gray-200 focus:border-blue-500",
    );

  const checkButtonClassName =
    "absolute top-1/2 right-3 -translate-y-1/2 text-xs font-semibold text-blue-600 disabled:text-gray-300";

  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gray-50 px-4 py-16">
      {/* noValidate는 폼 제출 시 브라우저의 기본 유효성 검사를 끔 */}
      <form onSubmit={handleSubmit} noValidate className="w-full max-w-sm">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">회원가입</h1>

        {/* 이메일 */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="mb-1.5 block text-xs font-semibold text-gray-700"
          >
            이메일
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              value={form.email}
              disabled={duplicateCheck.email.isChecking}
              onChange={(e) => handleChangeField("email", e.target.value)}
              className={cn(inputClassName(showEmailError), "pr-20")}
            />
            <button
              type="button"
              disabled={!isEmailValid || duplicateCheck.email.isChecking}
              onClick={() => handleCheckDuplicate("email")}
              className={checkButtonClassName}
            >
              {duplicateCheck.email.isChecking ? "확인 중" : "중복 확인"}
            </button>
          </div>
          {showEmailError && (
            <p className="mt-1.5 text-xs text-red-500">
              이메일 형식을 확인해 주세요.
            </p>
          )}
        </div>

        {/* 닉네임 */}
        <div className="mb-4">
          <label
            htmlFor="nickname"
            className="mb-1.5 block text-xs font-semibold text-gray-700"
          >
            닉네임
          </label>
          <div className="relative">
            <input
              id="nickname"
              type="text"
              placeholder="2~12자"
              value={form.nickname}
              disabled={duplicateCheck.nickname.isChecking}
              onChange={(e) => handleChangeField("nickname", e.target.value)}
              className={cn(inputClassName(showNicknameError), "pr-20")}
            />
            <button
              type="button"
              disabled={!isNicknameValid || duplicateCheck.nickname.isChecking}
              onClick={() => handleCheckDuplicate("nickname")}
              className={checkButtonClassName}
            >
              {duplicateCheck.nickname.isChecking ? "확인 중" : "중복 확인"}
            </button>
          </div>
          {showNicknameError && (
            <p className="mt-1.5 text-xs text-red-500">
              닉네임은 2~12자로 입력해 주세요.
            </p>
          )}
        </div>

        {/* 비밀번호 */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="mb-1.5 block text-xs font-semibold text-gray-700"
          >
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            placeholder="8자 이상"
            value={form.password}
            onChange={(e) => handleChangeField("password", e.target.value)}
            className={inputClassName(showPasswordError)}
          />
          <p className="mt-1.5 text-xs text-gray-400">
            영문 대소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해 주세요.
          </p>
          {showPasswordError && (
            <p className="mt-1 text-xs text-red-500">
              비밀번호를 다시 한 번 확인해 주세요.
            </p>
          )}
        </div>

        {/* 비밀번호 확인 */}
        <div className="mb-6">
          <label
            htmlFor="passwordConfirm"
            className="mb-1.5 block text-xs font-semibold text-gray-700"
          >
            비밀번호 확인
          </label>
          <input
            id="passwordConfirm"
            type="password"
            placeholder="다시 입력"
            value={form.passwordConfirm}
            onChange={(e) =>
              handleChangeField("passwordConfirm", e.target.value)
            }
            className={inputClassName(showPasswordConfirmError)}
          />
          {showPasswordConfirmError && (
            <p className="mt-1.5 text-xs text-red-500">
              비밀번호가 일치하지 않아요.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className="w-full rounded-md bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {isSubmitting ? "가입 중" : "가입하기"}
        </button>

        <p className="mt-4 text-center text-xs text-gray-500">
          이미 계정이 있나요? {/* 로그인 페이지를 만들면 Link로 바꿀 예정 */}
          <span className="font-semibold text-blue-600">로그인</span>
        </p>
      </form>
    </main>
  );
}
