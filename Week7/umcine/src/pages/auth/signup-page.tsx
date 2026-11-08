import { useState } from "react";

// 중복 확인 API
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { Link } from "@tanstack/react-router";

// 회원가입 API
import { signup } from "../../api/members/signup";
// import { useNavigate } from "@tanstack/react-router";

// 이메일 형식 검사
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 영문 대소문자, 숫자, 특수문자를 포함해 8자 이상
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

const DEFAULT_FORM = {
  email: "",
  nickname: "",
  password: "",
  passwordConfirm: "",
};

type DefaultFormKey = keyof typeof DEFAULT_FORM;
type DefaultFormValue = (typeof DEFAULT_FORM)[DefaultFormKey];

// 중복 확인 기본 상태
const DEFAULT_DUPLICATE_CHECK = {
  isChecking: false,
  isAvailable: false,
};

type DuplicateCheckKey = "email" | "nickname";

export function SignupPage() {
  const [form, setForm] = useState(DEFAULT_FORM);

  // 이메일, 닉네임 중복 확인 상태
  const [duplicateCheck, setDuplicateCheck] = useState({
    email: DEFAULT_DUPLICATE_CHECK,
    nickname: DEFAULT_DUPLICATE_CHECK,
  });

  // 입력값 유효성 검사
  const isEmailValid = EMAIL_REGEX.test(form.email.trim());

  const isNicknameValid =
    form.nickname.trim().length >= 2 && form.nickname.trim().length <= 12;

  const isPasswordValid = PASSWORD_REGEX.test(form.password);

  const isPasswordConfirmValid =
    form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;

  // 오류 표시 여부
  const showEmailError = form.email.length > 0 && !isEmailValid;

  const showNicknameError = form.nickname.length > 0 && !isNicknameValid;

  const showPasswordError = form.password.length > 0 && !isPasswordValid;

  const showPasswordConfirmError =
    form.passwordConfirm.length > 0 && !isPasswordConfirmValid;

  // 모든 입력값이 유효한지 검사
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

  // 입력값 변경
  const handleChangeField = (key: DefaultFormKey, value: DefaultFormValue) => {
    if (key === "email" || key === "nickname") {
      if (duplicateCheck[key].isChecking) return;

      // 확인한 값을 바꾸면 다시 중복 확인해야 함
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: DEFAULT_DUPLICATE_CHECK,
      }));
    }

    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // 이메일, 닉네임 중복 확인
  const handleCheckDuplicate = async (key: DuplicateCheckKey) => {
    const isValid = key === "email" ? isEmailValid : isNicknameValid;

    if (!isValid || duplicateCheck[key].isChecking) return;

    const label = key === "email" ? "이메일" : "닉네임";

    setDuplicateCheck((prev) => ({
      ...prev,
      [key]: {
        isChecking: true,
        isAvailable: false,
      },
    }));

    try {
      const response =
        key === "email"
          ? await checkEmailDuplicate(form.email.trim())
          : await checkNicknameDuplicate(form.nickname.trim());

      const isAvailable = response.available;

      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          isAvailable,
        },
      }));

      alert(
        isAvailable
          ? `사용할 수 있는 ${label}이에요.`
          : `이미 사용 중인 ${label}이에요.`,
      );
    } catch {
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          isAvailable: false,
        },
      }));

      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          isChecking: false,
        },
      }));
    }
  };

  // 폼 제출
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const navigate = useNavigate();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
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

  return (
    <div className="min-h-screen bg-white text-[#191c20]">
      {/* 회원가입 영역 */}
      <main className="flex min-h-[calc(100vh-72px)] flex-col">
        <section className="flex flex-1 items-center justify-center bg-[#f5f6f8] px-5 py-12">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="w-full max-w-[440px]"
          >
            <h1 className="mb-7 text-[28px] font-extrabold tracking-tight">
              회원가입
            </h1>

            {/* 이메일 */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="mb-2 block text-[14px] font-bold"
              >
                이메일
              </label>

              <div className="flex h-[52px] items-center rounded-xl border border-gray-200 bg-white px-3 focus-within:border-blue-500">
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={form.email}
                  disabled={duplicateCheck.email.isChecking}
                  onChange={(e) => handleChangeField("email", e.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-gray-400 disabled:bg-gray-50"
                />

                <button
                  type="button"
                  disabled={!isEmailValid || duplicateCheck.email.isChecking}
                  onClick={() => handleCheckDuplicate("email")}
                  className="ml-2 shrink-0 text-[12px] font-bold text-blue-600 hover:text-blue-800 disabled:cursor-not-allowed disabled:text-gray-300"
                >
                  {duplicateCheck.email.isChecking ? "확인 중" : "중복 확인"}
                </button>
              </div>

              {showEmailError && (
                <p className="mt-1 text-xs text-red-500">
                  올바른 이메일 형식을 입력해주세요.
                </p>
              )}
            </div>

            {/* 닉네임 */}
            <div className="mb-4">
              <label
                htmlFor="nickname"
                className="mb-2 block text-[14px] font-bold"
              >
                닉네임
              </label>

              <div className="flex h-[52px] items-center rounded-xl border border-gray-200 bg-white px-3 focus-within:border-blue-500">
                <input
                  id="nickname"
                  type="text"
                  placeholder="2~12자"
                  value={form.nickname}
                  disabled={duplicateCheck.nickname.isChecking}
                  onChange={(e) =>
                    handleChangeField("nickname", e.target.value)
                  }
                  className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-gray-400 disabled:bg-gray-50"
                />

                <button
                  type="button"
                  disabled={
                    !isNicknameValid || duplicateCheck.nickname.isChecking
                  }
                  onClick={() => handleCheckDuplicate("nickname")}
                  className="ml-2 shrink-0 text-[12px] font-bold text-blue-600 hover:text-blue-800 disabled:cursor-not-allowed disabled:text-gray-300"
                >
                  {duplicateCheck.nickname.isChecking ? "확인 중" : "중복 확인"}
                </button>
              </div>

              {showNicknameError && (
                <p className="mt-1 text-xs text-red-500">
                  닉네임은 2자 이상 12자 이하로 입력해주세요.
                </p>
              )}
            </div>

            {/* 비밀번호 */}
            <div className="mb-4">
              <label
                htmlFor="password"
                className="mb-2 block text-[14px] font-bold"
              >
                비밀번호
              </label>

              <input
                id="password"
                type="password"
                placeholder="8자 이상"
                value={form.password}
                onChange={(e) => handleChangeField("password", e.target.value)}
                className="h-[52px] w-full rounded-xl border border-gray-200 bg-white px-3 text-[14px] outline-none placeholder:text-gray-400 focus:border-blue-500"
              />

              {showPasswordError && (
                <p className="mt-1 text-xs text-red-500">
                  비밀번호는 영문 대소문자, 숫자, 특수문자를 포함해 8자
                  이상이어야 합니다.
                </p>
              )}

              <p className="mt-1 text-[12px] text-gray-400">
                영문 대소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해
                주세요
              </p>
            </div>

            {/* 비밀번호 확인 */}
            <div className="mb-5">
              <label
                htmlFor="passwordConfirm"
                className="mb-2 block text-[14px] font-bold"
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
                className="h-[52px] w-full rounded-xl border border-gray-200 bg-white px-3 text-[14px] outline-none placeholder:text-gray-400 focus:border-blue-500"
              />

              {showPasswordConfirmError && (
                <p className="mt-1 text-xs text-red-500">
                  비밀번호가 일치하지 않습니다.
                </p>
              )}
            </div>

            {/* 가입하기 */}
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="h-[52px] w-full rounded-xl bg-[#2563eb] text-[15px] font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {isSubmitting ? "가입 중" : "가입하기"}
            </button>

            {/* 로그인 안내 */}
            <p className="mt-5 text-center text-[13px] text-gray-400">
              이미 계정이 있으신가요?{" "}
              <Link
                to="/login"
                className="font-semibold text-blue-600 hover:text-blue-800"
              >
                로그인
              </Link>
            </p>
          </form>
        </section>
      </main>
    </div>
  );
}
