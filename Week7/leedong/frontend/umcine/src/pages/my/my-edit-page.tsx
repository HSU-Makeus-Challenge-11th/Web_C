import { useEffect, useRef, useState, type ChangeEvent, type SubmitEvent } from "react";

// TODO: 8주차에서 내 정보 조회 API로 교체
const MEMBER = {
  nickname: "umc_user",
  email: "name@example.com",
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

const labelClass = "text-xs font-extrabold text-[#17191e]";
const inputClass =
  "h-[50px] w-full rounded-lg border border-[#e3e6eb] bg-white px-4 text-sm outline-none placeholder:text-[#9aa1ad] focus:border-[#2563eb] disabled:bg-white disabled:text-[#17191e]";
const errorClass = "text-xs font-semibold text-[#e5484d]";

export function MyEditPage() {
  const [nickname, setNickname] = useState(MEMBER.nickname);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 미리보기 주소가 바뀌거나 페이지를 떠날 때 이전 주소를 해제해요.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const trimmedNickname = nickname.trim();
  const isNicknameValid =
    trimmedNickname.length >= 2 && trimmedNickname.length <= 12;
  const showNicknameError = nickname.length > 0 && !isNicknameValid;
  // 닉네임이 바뀌었거나 이미지를 골랐을 때만 저장할 수 있어요.
  const hasChanges = trimmedNickname !== MEMBER.nickname || previewUrl !== null;
  const canSubmit = isNicknameValid && hasChanges;

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // 같은 파일을 다시 골라도 change 이벤트가 발생하게 해요.
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageError("이미지 파일만 선택할 수 있어요.");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setImageError("이미지는 최대 5MB까지 선택할 수 있어요.");
      return;
    }
    setImageError("");
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;
    // TODO: 8주차에서 내 정보 수정 API 연동
  };

  return (
    <div className="flex min-h-[calc(100vh-91px)] flex-col bg-[#f6f7f9]">
      <main className="flex flex-1 flex-col px-20 pb-8 pt-6">
        <form onSubmit={handleSubmit} noValidate>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-[38px] font-bold leading-[44px] tracking-[-1.71px]">
                내 정보 수정
              </h1>
              <p className="mt-1 text-xs text-[#606774]">
                닉네임과 프로필 이미지만 변경할 수 있어요.
              </p>
            </div>
            <button
              type="submit"
              disabled={!canSubmit}
              className="h-10 rounded-lg bg-[#2563eb] px-4 text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:bg-[#b6c8f5]"
            >
              변경사항 저장
            </button>
          </div>

          <div className="mt-12 grid grid-cols-2">
            {/* 프로필 이미지 */}
            <div className="flex flex-col items-center pt-4">
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[#e3e6eb]">
                  {previewUrl ? (
                    <img
                      className="h-full w-full object-cover"
                      src={previewUrl}
                      alt="선택한 프로필 이미지 미리보기"
                    />
                  ) : (
                    <img className="h-8 w-8" src="/icons/person.svg" alt="" />
                  )}
                </div>
                <button
                  type="button"
                  aria-label="프로필 이미지 변경"
                  className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <img className="h-6 w-6" src="/icons/edit.svg" alt="" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleChangeImage}
                />
              </div>
              <p className="mt-3 text-xs font-extrabold">프로필 이미지</p>
              <p className="mt-1 text-[10px] text-[#969da8]">선택 사항 · 최대 5MB</p>
              {imageError && <p className={`${errorClass} mt-2`}>{imageError}</p>}
            </div>

            {/* 닉네임, 이메일 */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="edit-nickname" className={labelClass}>
                  닉네임
                </label>
                <div className="relative">
                  <input
                    id="edit-nickname"
                    type="text"
                    className={`${inputClass} pr-24`}
                    placeholder="2~12자"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                  />
                  {/* TODO: 8주차에서 닉네임 중복 확인 API 연동 */}
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-extrabold text-[#2563eb]"
                  >
                    중복 확인
                  </button>
                </div>
                {showNicknameError && (
                  <p className={errorClass}>
                    닉네임은 2자 이상 12자 이하로 입력해 주세요.
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="edit-email" className={labelClass}>
                  이메일
                </label>
                <input
                  id="edit-email"
                  type="email"
                  className={inputClass}
                  value={MEMBER.email}
                  disabled
                />
              </div>
            </div>
          </div>
        </form>

        <section className="mt-auto flex items-center justify-between rounded-[10px] border border-[#e5484d] bg-[#fdecec] px-5 py-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-xs font-extrabold text-[#d92d20]">회원 탈퇴</h2>
            <p className="text-[11px] text-[#e5484d]">
              탈퇴하면 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수 없습니다.
            </p>
          </div>
          {/* TODO: 8주차에서 회원 탈퇴 API 연동 (확인 절차 포함) */}
          <button
            type="button"
            className="h-9 rounded-lg border border-[#e5484d] bg-white px-4 text-xs font-extrabold text-[#d92d20]"
          >
            회원 탈퇴
          </button>
        </section>
      </main>
    </div>
  );
}
