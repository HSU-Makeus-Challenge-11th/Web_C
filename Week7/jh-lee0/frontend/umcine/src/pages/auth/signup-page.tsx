import { useState } from "react";
import { checkEmailDuplicate } from "@/api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "@/api/members/check-nickname-duplicate";
import { signup } from "@/api/members/signup";
// import { useNavigate } from "@tanstack/react-router";

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

// 중복 확인 메모지의 기본값
const DEFAULT_DUPLICATE_CHECK = {
  isChecking: false, // 지금 서버에 물어보는 중인지
  isAvailable: false, // 서버가 써도 된다고 했는지
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
  // 가입 요청을 보내는 중인지
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
      // 서버에 물어보는 중이면 값 변경 막기
      if (duplicateCheck[key].isChecking) return;
      // 확인한 값을 바꾸면 다시 중복 확인해야 함
      setDuplicateCheck((prev) => ({ ...prev, [key]: DEFAULT_DUPLICATE_CHECK }));
    }
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCheckDuplicate = async (key: DuplicateCheckKey) => {
    const isValid = key === "email" ? isEmailValid : isNicknameValid;
    // 형식이 틀렸거나 이미 물어보는 중이면 중단
    if (!isValid || duplicateCheck[key].isChecking) return;

    const label = key === "email" ? "이메일" : "닉네임";

    // 메모: "지금 물어보는 중"
    setDuplicateCheck((prev) => ({
      ...prev,
      [key]: { isChecking: true, isAvailable: false },
    }));

    try {
      // 서버에 물어보기
      const response =
        key === "email"
          ? await checkEmailDuplicate(form.email.trim())
          : await checkNicknameDuplicate(form.nickname.trim());

      const isAvailable = response.available;

      // 메모: 서버 대답 저장
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
      // 서버가 꺼져 있거나 오류가 나면 실패 처리
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isAvailable: false },
      }));
      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      // 성공이든 실패든 "물어보는 중" 끝
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isChecking: false },
      }));
    }
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    // 폼 제출 시 페이지 새로고침 방지
    e.preventDefault();
    // 제출 조건이 안 맞거나 이미 보내는 중이면 중단
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // 서버에 가입 요청 (passwordConfirm은 보내지 않음)
      const response = await signup({
        email: form.email.trim(),
        nickname: form.nickname.trim(),
        password: form.password,
      });

      // 서버가 보낸 메시지 보여주기
      alert(response.message);
      // 로그인 페이지 연결 후 주석 해제
      // navigate({ to: "/login" });
    } catch {
      // 실패하면 입력값은 그대로 두고 다시 시도할 수 있음
      alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // noValidate는 폼 제출 시 브라우저의 기본 유효성 검사를 끔
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F6F7F9] px-4">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-[430px]"
      >
        <h1 className="mb-5 text-[28px] font-bold text-[#111111]">회원가입</h1>

        {/* 이메일 */}
        <div className="mb-5">
          <label className="mb-2 block text-xs font-bold text-[#111111]">
            이메일
          </label>
          <div className="flex h-12 items-center rounded-md border border-[#E3E5EA] bg-white px-4">
            <input
              type="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={(e) => handleChangeField("email", e.target.value)}
              disabled={duplicateCheck.email.isChecking}
              className="w-full bg-transparent text-sm outline-none placeholder:text-[#9CA3AF]"
            />
            <button
              type="button"
              disabled={!isEmailValid || duplicateCheck.email.isChecking}
              onClick={() => handleCheckDuplicate("email")}
              className="shrink-0 text-xs font-bold text-[#4A65E5] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {duplicateCheck.email.isChecking ? "확인 중" : "중복 확인"}
            </button>
          </div>
          {showEmailError && (
            <p className="mt-1.5 text-xs text-red-500">
              이메일 형식이 올바르지 않아요.
            </p>
          )}
        </div>

        {/* 닉네임 */}
        <div className="mb-5">
          <label className="mb-2 block text-xs font-bold text-[#111111]">
            닉네임
          </label>
          <div className="flex h-12 items-center rounded-md border border-[#E3E5EA] bg-white px-4">
            <input
              type="text"
              placeholder="2-12자"
              value={form.nickname}
              onChange={(e) => handleChangeField("nickname", e.target.value)}
              disabled={duplicateCheck.nickname.isChecking}
              className="w-full bg-transparent text-sm outline-none placeholder:text-[#9CA3AF]"
            />
            <button
              type="button"
              disabled={!isNicknameValid || duplicateCheck.nickname.isChecking}
              onClick={() => handleCheckDuplicate("nickname")}
              className="shrink-0 text-xs font-bold text-[#4A65E5] disabled:cursor-not-allowed disabled:opacity-40"
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
        <div className="mb-5">
          <label className="mb-2 block text-xs font-bold text-[#111111]">
            비밀번호
          </label>
          <input
            type="password"
            placeholder="8자 이상"
            value={form.password}
            onChange={(e) => handleChangeField("password", e.target.value)}
            className="h-12 w-full rounded-md border border-[#E3E5EA] bg-white px-4 text-sm outline-none placeholder:text-[#9CA3AF]"
          />
          <p className="mt-1.5 text-[11px] text-[#9CA3AF]">
            영문 대소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해 주세요.
          </p>
          {showPasswordError && (
            <p className="mt-1 text-xs text-red-500">
              비밀번호 조건을 확인해 주세요.
            </p>
          )}
        </div>

        {/* 비밀번호 확인 */}
        <div className="mb-5">
          <label className="mb-2 block text-xs font-bold text-[#111111]">
            비밀번호 확인
          </label>
          <input
            type="password"
            placeholder="다시 입력"
            value={form.passwordConfirm}
            onChange={(e) =>
              handleChangeField("passwordConfirm", e.target.value)
            }
            className="h-12 w-full rounded-md border border-[#E3E5EA] bg-white px-4 text-sm outline-none placeholder:text-[#9CA3AF]"
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
          className="h-12 w-full rounded-md bg-[#4A65E5] text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "가입 중" : "가입하기"}
        </button>

        <p className="mt-4 text-center text-[11px] text-[#6B7280]">
          이미 계정이 있나요?{" "}
          <span className="font-bold text-[#4A65E5]">로그인</span>
        </p>
      </form>
    </div>
  );
}