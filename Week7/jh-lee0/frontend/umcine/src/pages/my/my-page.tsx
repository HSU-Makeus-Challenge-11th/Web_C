import { Link } from "@tanstack/react-router";

// 8주차에서 내 정보 조회 API로 바꿀 임시 데이터 (피그마 시안 값)
const MY_INFO = {
  nickname: "gs0428",
  email: "gwangsoo@cinemalab.kr",
};

// 임시 즐겨찾기 목록 (posterUrl에 이미지 주소를 넣으면 포스터가 보임)
const FAVORITE_MOVIES = [
  {
    id: 1,
    title: "스파이더맨: 브랜드 뉴 데이",
    releaseDate: "2026.07.29",
    posterUrl: "",
  },
  { id: 2, title: "오디세이", releaseDate: "2026.08.05", posterUrl: "" },
  {
    id: 3,
    title: "미니언즈 & 몬스터즈",
    releaseDate: "2026.07.15",
    posterUrl: "",
  },
];

// 사람 모양 아이콘
function UserIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="#111111">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6v1H4z" />
    </svg>
  );
}

export function MyPage() {
  return (
    <div className="min-h-screen bg-[#F6F7F9]">
      <div className="mx-auto max-w-[1280px] px-4 py-8">
        {/* 제목 + 정보 수정 버튼 */}
        <div className="flex items-center justify-between">
          <h1 className="text-[28px] font-bold text-[#111111]">내 정보</h1>
          <Link
            to="/my/edit"
            className="flex h-10 items-center rounded-md bg-[#2563EB] px-4 text-sm font-bold text-white"
          >
            정보 수정
          </Link>
        </div>

        {/* 기본 정보 */}
        <section className="mt-7 border-t border-b border-[#E3E5EA] py-5">
          <h2 className="mb-4 text-base font-bold text-[#111111]">기본 정보</h2>
          <div className="flex items-center gap-7">
            <div className="flex h-[82px] w-[82px] shrink-0 items-center justify-center rounded-full bg-[#E5E7EB]">
              <UserIcon />
            </div>
            <div className="w-[394px]">
              <p className="text-[11px] text-[#9CA3AF]">닉네임</p>
              <p className="mt-1 text-sm font-bold text-[#111111]">
                {MY_INFO.nickname}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-[#9CA3AF]">이메일</p>
              <p className="mt-1 text-sm font-bold text-[#111111]">
                {MY_INFO.email}
              </p>
            </div>
          </div>
        </section>

        {/* 내 즐겨찾기 */}
        <section className="mt-8">
          <h2 className="mb-4 text-base font-bold text-[#111111]">
            내 즐겨찾기
          </h2>
          {/* 시안처럼 242px 카드를 왼쪽부터 나열 */}
          <ul className="flex flex-wrap gap-[18px]">
            {FAVORITE_MOVIES.map((movie) => (
              <li key={movie.id} className="w-[242px]">
                {movie.posterUrl ? (
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="h-[274px] w-full rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-[274px] w-full rounded-lg bg-[#E5E7EB]" />
                )}
                <p className="mt-2 text-sm font-bold text-[#111111]">
                  {movie.title}
                </p>
                <p className="mt-0.5 text-xs text-[#9CA3AF]">
                  {movie.releaseDate}
                </p>
              </li>
            ))}
          </ul>

          {/* 페이지 번호 */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button type="button" disabled className="text-[#D1D5DB]">
              ‹
            </button>
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#111111] text-sm font-bold text-white">
              1
            </span>
            <button type="button" disabled className="text-[#D1D5DB]">
              ›
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}