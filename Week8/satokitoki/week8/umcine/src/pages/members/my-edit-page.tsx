import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type SubmitEvent,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { getMe, type MemberInfo } from "../../api/members/me";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { useUpdateMeMutation } from "../../hooks/use-update-me-mutation";
import { cn } from "../../utils/cn";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-9 w-9 text-gray-900"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6v1H4z" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-3.5 w-3.5"
    >
      <path d="M4 20h4L19 9l-4-4L4 16v4z" />
    </svg>
  );
}

export function MyEditPage() {
  // 헤더와 같은 query key라서 이미 불러온 정보가 있으면 캐시를 그대로 씁니다
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  if (meQuery.isPending) {
    return (
      <main className="min-h-[calc(100vh-64px)] bg-gray-50 p-10 text-sm text-gray-500">
        내 정보를 불러오는 중이에요.
      </main>
    );
  }

  if (meQuery.isError) {
    return (
      <main className="min-h-[calc(100vh-64px)] bg-gray-50 p-10 text-sm text-red-500">
        내 정보를 불러오지 못했어요.
      </main>
    );
  }

  return <MyEditForm member={meQuery.data} />;
}

function MyEditForm({ member }: { member: MemberInfo }) {
  const navigate = useNavigate();
  const updateMeMutation = useUpdateMeMutation();

  const [nickname, setNickname] = useState(member.nickname);
  const [isNicknameChecked, setIsNicknameChecked] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const trimmedNickname = nickname.trim();
  const isNicknameValid =
    trimmedNickname.length >= 2 && trimmedNickname.length <= 12;
  const isNicknameChanged = trimmedNickname !== member.nickname;
  const showNicknameError = nickname.length > 0 && !isNicknameValid;

  // 닉네임을 바꿨고, 중복 확인까지 통과해야 저장 가능
  const canSubmit = isNicknameValid && isNicknameChanged && isNicknameChecked;

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleChangeNickname = (value: string) => {
    setNickname(value);
    setIsNicknameChecked(value.trim() === member.nickname);
  };

  const handleCheckNickname = async () => {
    if (!isNicknameValid || isChecking) return;
    setIsChecking(true);
    try {
      const response = await checkNicknameDuplicate(trimmedNickname);
      setIsNicknameChecked(response.available);
      alert(
        response.available
          ? "사용할 수 있는 닉네임이에요."
          : "이미 사용 중인 닉네임이에요.",
      );
    } catch {
      setIsNicknameChecked(false);
      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsChecking(false);
    }
  };

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_SIZE) {
      alert("프로필 이미지는 최대 5MB까지 올릴 수 있어요.");
      e.target.value = "";
      return;
    }
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || updateMeMutation.isPending) return;

    updateMeMutation.mutate(
      { nickname: trimmedNickname },
      // 저장에 성공하면 내 정보 화면으로 돌아갑니다
      { onSuccess: () => navigate({ to: "/my" }) },
    );
  };

  const handleWithdraw = () => {
    alert("회원 탈퇴 기능은 준비 중이에요.");
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-gray-50">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="mx-auto flex min-h-[calc(100vh-64px)] max-w-6xl flex-col px-6 py-10"
      >
        {/* 제목 영역 */}
        <div className="mb-12 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">내 정보 수정</h1>
            <p className="mt-2 text-sm text-gray-500">
              닉네임과 프로필 이미지만 변경할 수 있어요.
            </p>
          </div>
          <button
            type="submit"
            disabled={!canSubmit || updateMeMutation.isPending}
            className="rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {updateMeMutation.isPending ? "저장 중" : "변경사항 저장"}
          </button>
        </div>

        <div className="grid gap-10 md:grid-cols-2">
          {/* 프로필 이미지 */}
          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="relative h-20 w-20 rounded-full bg-gray-200"
              aria-label="프로필 이미지 변경"
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="프로필 미리보기"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center">
                  <UserIcon />
                </span>
              )}
              <span className="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-gray-900 bg-white text-gray-900">
                <PencilIcon />
              </span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleChangeImage}
              className="hidden"
            />
            <p className="mt-3 text-sm font-semibold text-gray-900">
              프로필 이미지
            </p>
            <p className="mt-0.5 text-xs text-gray-400">선택 사항 · 최대 5MB</p>
          </div>

          {/* 입력 영역 */}
          <div>
            <div className="mb-5">
              <label
                htmlFor="nickname"
                className="mb-1.5 block text-xs font-semibold text-gray-900"
              >
                닉네임
              </label>
              <div className="relative">
                <input
                  id="nickname"
                  type="text"
                  value={nickname}
                  disabled={isChecking}
                  onChange={(e) => handleChangeNickname(e.target.value)}
                  className={cn(
                    "w-full rounded-md border bg-white px-4 py-3 pr-20 text-sm text-gray-900 outline-none",
                    showNicknameError
                      ? "border-red-400 focus:border-red-500"
                      : "border-gray-200 focus:border-blue-500",
                  )}
                />
                <button
                  type="button"
                  onClick={handleCheckNickname}
                  disabled={
                    !isNicknameValid || !isNicknameChanged || isChecking
                  }
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-xs font-semibold text-blue-600 disabled:text-gray-300"
                >
                  {isChecking ? "확인 중" : "중복 확인"}
                </button>
              </div>
              {showNicknameError && (
                <p className="mt-1.5 text-xs text-red-500">
                  닉네임은 2~12자로 입력해 주세요.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-semibold text-gray-900"
              >
                이메일
              </label>
              <input
                id="email"
                type="email"
                value={member.email}
                readOnly
                className="w-full rounded-md border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none"
              />
            </div>
          </div>
        </div>

        {/* 회원 탈퇴 */}
        <div className="mt-auto flex items-center justify-between rounded-lg border border-red-400 bg-red-50 px-5 py-5">
          <div>
            <p className="text-sm font-bold text-red-600">회원 탈퇴</p>
            <p className="mt-1 text-xs text-red-500">
              탈퇴하면 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수
              없습니다.
            </p>
          </div>
          <button
            type="button"
            onClick={handleWithdraw}
            className="rounded-md border border-red-500 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            회원 탈퇴
          </button>
        </div>
      </form>
    </main>
  );
}
