import { useState } from "react";

// 8주차에서 내 정보 조회 API로 바꿀 임시 데이터
const MY_INFO = {
  nickname: "gs0428",
  email: "gwangsoo@cinemalab.kr",
};

// 사람 모양 아이콘
function UserIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="#111111">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6v1H4z" />
    </svg>
  );
}

// 연필 아이콘
function PencilIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="#111111">
      <path d="M3 17.25V21h3.75L17.8 9.94l-3.75-3.75L3 17.25zM20.7 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
    </svg>
  );
}

export function MyEditPage() {
  const [nickname, setNickname] = useState(MY_INFO.nickname);
  // 선택한 프로필 이미지 미리보기 주소
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileImageUrl(URL.createObjectURL(file));
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    // 폼 제출 시 페이지 새로고침 방지
    e.preventDefault();

    // 8주차에서 내 정보 수정 API 요청 추가
  };

  return (
    <div className="bg-[#F6F7F9]">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="mx-auto flex min-h-[calc(100vh-90px)] max-w-[1280px] flex-col px-4 py-8"
      >
        {/* 제목 + 저장 버튼 */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-[#111111]">
              내 정보 수정
            </h1>
            <p className="mt-2 text-[13px] text-[#6B7280]">
              닉네임과 프로필 이미지만 변경할 수 있어요.
            </p>
          </div>
          <button
            type="submit"
            className="mt-2 h-10 rounded-md bg-[#2563EB] px-4 text-sm font-bold text-white"
          >
            변경사항 저장
          </button>
        </div>

        <div className="mt-10 flex flex-col gap-10 md:flex-row">
          {/* 왼쪽: 프로필 이미지 */}
          <div className="flex flex-1 flex-col items-center pt-3">
            <label className="relative cursor-pointer">
              <div className="flex h-[82px] w-[82px] items-center justify-center overflow-hidden rounded-full bg-[#E5E7EB]">
                {profileImageUrl ? (
                  <img
                    src={profileImageUrl}
                    alt="프로필 이미지"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserIcon />
                )}
              </div>
              <span className="absolute -right-1 bottom-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#111111] bg-white">
                <PencilIcon />
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleChangeImage}
                className="hidden"
              />
            </label>
            <p className="mt-2 text-sm font-bold text-[#111111]">
              프로필 이미지
            </p>
            <p className="mt-1 text-[10px] text-[#9CA3AF]">
              선택 사항 · 최대 5MB
            </p>
          </div>

          {/* 오른쪽: 닉네임, 이메일 */}
          <div className="flex-1">
            <div className="mb-5">
              <label className="mb-2 block text-xs font-bold text-[#111111]">
                닉네임
              </label>
              <div className="flex h-12 items-center rounded-md border border-[#E3E5EA] bg-white px-4">
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full bg-transparent text-sm outline-none"
                />
                <button
                  type="button"
                  className="shrink-0 text-xs font-bold text-[#2563EB]"
                >
                  중복 확인
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-[#111111]">
                이메일
              </label>
              {/* 이메일은 변경 불가라 읽기 전용 */}
              <input
                type="email"
                value={MY_INFO.email}
                readOnly
                className="h-12 w-full rounded-md border border-[#E3E5EA] bg-white px-4 text-sm outline-none"
              />
            </div>
          </div>
        </div>

        {/* 회원 탈퇴 영역 (mt-auto로 맨 아래에 붙임) */}
        <div className="mt-auto flex items-center justify-between rounded-lg border border-[#EF4444] bg-[#FDECEC] px-5 py-5">
          <div>
            <p className="text-sm font-bold text-[#DC2626]">회원 탈퇴</p>
            <p className="mt-1 text-[11px] text-[#DC2626]">
              탈퇴하면 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수
              없습니다.
            </p>
          </div>
          <button
            type="button"
            className="h-10 shrink-0 rounded-md border border-[#DC2626] bg-white px-4 text-sm font-bold text-[#DC2626]"
          >
            회원 탈퇴
          </button>
        </div>
      </form>
    </div>
  );
}