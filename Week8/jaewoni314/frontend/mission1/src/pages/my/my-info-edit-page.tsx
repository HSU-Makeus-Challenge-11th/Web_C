import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { checkNickname } from "../../api/members/check-nickname";
import type { MemberInfo } from "../../api/members/me";
import { memberQueries } from "../../api/members/member-queries";
import {
  duplicateCheckButtonClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "../../components/form/button-styles";
import { FormField } from "../../components/form/form-field";
import { StatusMessage } from "../../components/movies/status-message";
import {
  getDuplicateCheckMessage,
  useDuplicateCheck,
} from "../../hooks/members/use-duplicate-check";
import { useUpdateMeMutation } from "../../hooks/members/use-update-me-mutation";
import { cn } from "../../utils/cn";
import { getApiErrorMessage } from "../../utils/get-api-error-message";
import {
  MEMBER_INPUT_ERROR_MESSAGES,
  isValidNickname,
} from "../../utils/members/member-validation";

export function MyInfoEditPage() {
  const meQuery = useQuery(memberQueries.me());

  if (meQuery.isPending) {
    return (
      <main className="mx-auto w-full max-w-[560px] px-6">
        <StatusMessage>내 정보를 불러오는 중이에요.</StatusMessage>
      </main>
    );
  }

  if (meQuery.isError) {
    return (
      <main className="mx-auto w-full max-w-[560px] px-6">
        <StatusMessage isError>
          {getApiErrorMessage(meQuery.error, "내 정보를 불러오지 못했어요.")}
        </StatusMessage>
      </main>
    );
  }

  // 조회가 끝난 뒤에 폼을 그려서, 입력창의 처음 값을 서버의 닉네임으로 채워요.
  return <MyInfoEditForm me={meQuery.data} />;
}

function MyInfoEditForm({ me }: { me: MemberInfo }) {
  const [nicknameInput, setNicknameInput] = useState(me.nickname);
  const nicknameCheck = useDuplicateCheck(checkNickname, "닉네임");
  const updateMeMutation = useUpdateMeMutation();

  // 바꾼 닉네임이 형식과 중복 확인을 모두 통과해야 저장할 수 있어요.
  const nickname = nicknameInput.trim();
  const isNicknameChanged = nickname !== me.nickname;
  const isNicknameValid = isValidNickname(nickname);
  const nicknameStatus = nicknameCheck.getStatus(nickname);
  const canSubmit = isNicknameChanged && isNicknameValid && nicknameStatus === "available";

  const nicknameMessage = !isNicknameChanged
    ? ({ message: "지금 사용 중인 닉네임이에요.", messageTone: "info" } as const)
    : isNicknameValid
      ? getDuplicateCheckMessage(nicknameStatus, "닉네임")
      : ({ message: MEMBER_INPUT_ERROR_MESSAGES.nickname, messageTone: "error" } as const);

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || updateMeMutation.isPending) return;

    updateMeMutation.mutate({ nickname });
  };

  return (
    <main className="mx-auto w-full max-w-[560px] px-6 pb-20 pt-12">
      <Link to="/my" className="text-sm font-medium text-muted hover:text-text">
        ← 내 정보
      </Link>
      <h1 className="mt-4 text-[32px] font-bold tracking-[-0.02em]">내 정보 수정</h1>
      {/* 내 정보 수정 API(PATCH /members/me)는 닉네임만 바꿀 수 있어서, 7주차에 퍼블리싱한 비밀번호 변경 칸은 뺐어요. */}
      <p className="mt-2 text-[15px] text-muted">닉네임을 바꿀 수 있어요.</p>

      <form className="mt-8 flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
        <section className="flex flex-col gap-5 rounded-xl border border-line p-6" aria-labelledby="basic-info-title">
          <h2 id="basic-info-title" className="text-lg font-bold">
            기본 정보
          </h2>

          <FormField
            label="이메일"
            icon="mail"
            type="email"
            value={me.email}
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
            // 중복 확인이나 저장 요청 중에는 값을 바꾸지 못하게 해요.
            disabled={nicknameStatus === "checking" || updateMeMutation.isPending}
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

        <div className="flex gap-2">
          <Link to="/my" className={cn(secondaryButtonClass, "flex-1")}>
            취소
          </Link>
          <button
            type="submit"
            className={cn(primaryButtonClass, "flex-1")}
            disabled={!canSubmit || updateMeMutation.isPending}
          >
            {updateMeMutation.isPending ? "저장 중" : "저장하기"}
          </button>
        </div>
      </form>
    </main>
  );
}
