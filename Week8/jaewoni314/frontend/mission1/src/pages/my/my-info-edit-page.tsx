import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { checkNickname } from "../../api/members/check-nickname";
import {
  duplicateCheckButtonClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "../../components/form/button-styles";
import { FormField } from "../../components/form/form-field";
import {
  getDuplicateCheckMessage,
  useDuplicateCheck,
} from "../../hooks/members/use-duplicate-check";
import { useMyInfoStore } from "../../stores/my-info-store";
import { cn } from "../../utils/cn";
import {
  MEMBER_INPUT_ERROR_MESSAGES,
  isValidNickname,
  isValidPassword,
} from "../../utils/members/member-validation";

const DEFAULT_PASSWORD_FORM = {
  currentPassword: "",
  newPassword: "",
  newPasswordConfirm: "",
};

type PasswordFormKey = keyof typeof DEFAULT_PASSWORD_FORM;

const sectionClass = "flex flex-col gap-5 rounded-xl border border-line p-6";

export function MyInfoEditPage() {
  const navigate = useNavigate();
  const myInfo = useMyInfoStore((state) => state.myInfo);
  const updateNickname = useMyInfoStore((state) => state.updateNickname);
  const [nicknameInput, setNicknameInput] = useState(myInfo.nickname);
  const [passwordForm, setPasswordForm] = useState(DEFAULT_PASSWORD_FORM);
  const nicknameCheck = useDuplicateCheck(checkNickname, "닉네임");

  // 닉네임: 바꾸지 않았다면 그대로 두고, 바꿨다면 형식과 중복 확인을 모두 통과해야 해요.
  const nickname = nicknameInput.trim();
  const isNicknameChanged = nickname !== myInfo.nickname;
  const isNicknameValid = isValidNickname(nickname);
  const nicknameStatus = nicknameCheck.getStatus(nickname);
  const isNicknameReady =
    !isNicknameChanged || (isNicknameValid && nicknameStatus === "available");

  // 비밀번호: 세 칸이 모두 비어 있으면 바꾸지 않아요. 한 칸이라도 입력하면 모두 조건을 맞춰야 해요.
  const { currentPassword, newPassword, newPasswordConfirm } = passwordForm;
  const isPasswordChanging = Object.values(passwordForm).some((value) => value.length > 0);
  const isCurrentPasswordFilled = currentPassword.length > 0;
  const isNewPasswordValid = isValidPassword(newPassword);
  const isNewPasswordDifferent = newPassword !== currentPassword;
  const isNewPasswordConfirmValid =
    newPasswordConfirm.length > 0 && newPassword === newPasswordConfirm;
  const isPasswordReady =
    !isPasswordChanging ||
    (isCurrentPasswordFilled &&
      isNewPasswordValid &&
      isNewPasswordDifferent &&
      isNewPasswordConfirmValid);

  // 바뀐 값이 있고, 바뀐 값이 모두 조건을 통과해야 저장할 수 있어요.
  const canSave = (isNicknameChanged || isPasswordChanging) && isNicknameReady && isPasswordReady;

  const nicknameMessage = !isNicknameChanged
    ? ({ message: "지금 사용 중인 닉네임이에요.", messageTone: "info" } as const)
    : isNicknameValid
      ? getDuplicateCheckMessage(nicknameStatus, "닉네임")
      : ({ message: MEMBER_INPUT_ERROR_MESSAGES.nickname, messageTone: "error" } as const);

  // 비밀번호 칸은 변경을 시작했을 때만 안내 문구를 보여 줘요.
  const currentPasswordMessage =
    isPasswordChanging && !isCurrentPasswordFilled ? "현재 비밀번호를 입력해 주세요." : undefined;
  const newPasswordMessage = !isPasswordChanging
    ? undefined
    : newPassword.length === 0
      ? ({ message: "새 비밀번호를 입력해 주세요.", messageTone: "error" } as const)
      : !isNewPasswordValid
        ? ({ message: MEMBER_INPUT_ERROR_MESSAGES.password, messageTone: "error" } as const)
        : !isNewPasswordDifferent
          ? ({ message: "현재 비밀번호와 다른 비밀번호를 입력해 주세요.", messageTone: "error" } as const)
          : ({ message: "사용할 수 있는 비밀번호예요.", messageTone: "success" } as const);
  const newPasswordConfirmMessage = !isPasswordChanging
    ? undefined
    : newPasswordConfirm.length === 0
      ? ({ message: "새 비밀번호를 한 번 더 입력해 주세요.", messageTone: "error" } as const)
      : isNewPasswordConfirmValid
        ? ({ message: "비밀번호가 일치해요.", messageTone: "success" } as const)
        : ({ message: MEMBER_INPUT_ERROR_MESSAGES.passwordConfirm, messageTone: "error" } as const);

  const handleChangePassword = (key: PasswordFormKey, value: string) => {
    setPasswordForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSave) return;

    // 8주차에 내 정보 수정 API를 연결하면 여기에서 서버에 수정 요청을 보내요.
    // 지금은 화면에 반영되는지 확인하려고 예시 회원 정보의 닉네임만 바꾸고, 비밀번호는 저장하지 않아요.
    if (isNicknameChanged) updateNickname(nickname);
    alert("내 정보를 수정했어요.");
    navigate({ to: "/my" });
  };

  return (
    <main className="mx-auto w-full max-w-[560px] px-6 pb-20 pt-12">
      <Link to="/my" className="text-sm font-medium text-muted hover:text-text">
        ← 내 정보
      </Link>
      <h1 className="mt-4 text-[32px] font-bold tracking-[-0.02em]">내 정보 수정</h1>
      <p className="mt-2 text-[15px] text-muted">닉네임과 비밀번호를 바꿀 수 있어요.</p>

      <form className="mt-8 flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
        <section className={sectionClass} aria-labelledby="basic-info-title">
          <h2 id="basic-info-title" className="text-lg font-bold">
            기본 정보
          </h2>

          <FormField
            label="이메일"
            icon="mail"
            type="email"
            value={myInfo.email}
            readOnly
            disabled
            message="이메일은 바꿀 수 없어요."
          />

          <FormField
            label="닉네임"
            icon="person"
            autoComplete="nickname"
            placeholder="2~12자로 입력해 주세요"
            value={nicknameInput}
            onChange={(event) => setNicknameInput(event.target.value)}
            // 요청 중에는 값을 바꾸지 못하게 해요.
            disabled={nicknameStatus === "checking"}
            {...nicknameMessage}
            action={
              <button
                type="button"
                className={duplicateCheckButtonClass}
                disabled={!isNicknameChanged || !isNicknameValid || nicknameStatus === "checking"}
                onClick={() => nicknameCheck.check(nickname)}
              >
                {nicknameStatus === "checking" ? "확인 중" : "중복 확인"}
              </button>
            }
          />
        </section>

        <section className={sectionClass} aria-labelledby="password-title">
          <div>
            <h2 id="password-title" className="text-lg font-bold">
              비밀번호 변경
            </h2>
            <p className="mt-1 text-sm text-muted">비밀번호를 바꾸지 않으려면 비워 두세요.</p>
          </div>

          <FormField
            label="현재 비밀번호"
            icon="lock"
            type="password"
            autoComplete="current-password"
            placeholder="지금 사용하는 비밀번호"
            value={currentPassword}
            onChange={(event) => handleChangePassword("currentPassword", event.target.value)}
            message={currentPasswordMessage}
            messageTone="error"
          />

          <FormField
            label="새 비밀번호"
            icon="lock"
            type="password"
            autoComplete="new-password"
            placeholder="영문 대소문자, 숫자, 특수문자 포함 8자 이상"
            value={newPassword}
            onChange={(event) => handleChangePassword("newPassword", event.target.value)}
            {...newPasswordMessage}
          />

          <FormField
            label="새 비밀번호 확인"
            icon="lock"
            type="password"
            autoComplete="new-password"
            placeholder="새 비밀번호를 한 번 더 입력해 주세요"
            value={newPasswordConfirm}
            onChange={(event) => handleChangePassword("newPasswordConfirm", event.target.value)}
            {...newPasswordConfirmMessage}
          />
        </section>

        <div className="flex gap-2">
          <Link to="/my" className={cn(secondaryButtonClass, "flex-1")}>
            취소
          </Link>
          <button type="submit" className={cn(primaryButtonClass, "flex-1")} disabled={!canSave}>
            저장하기
          </button>
        </div>
      </form>
    </main>
  );
}
