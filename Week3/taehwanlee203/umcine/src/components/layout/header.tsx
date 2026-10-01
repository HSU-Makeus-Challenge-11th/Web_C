import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="w-full bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div>
              <img src="/public/icon/movie.svg" alt="" className="logo-icon" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-gray-900">
              UMCine
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-semibold">
            <Link
              to="/"
              className=" hover:text-black transition-colors"
              activeProps={{
                className:
                  "text-black font-extrabold underline underline-offset-4 decoration-1",
              }}
            >
              영화
            </Link>
            <Link
              to="/search"
              className=" hover:text-black transition-colors"
              activeProps={{
                className:
                  "text-black font-extrabold underline underline-offset-4 decoration-1",
              }}
            >
              검색
            </Link>

            <Link
              to="/"
              className="hover:text-black transition-colors"
              activeProps={{
                className:
                  "text-black font-extrabold underline underline-offset-4 decoration-1",
              }}
            >
              내 정보
            </Link>
          </nav>
        </div>

        {/* 우측: 돋보기 아이콘 + 로그인 버튼 */}
        <div className="flex items-center gap-2.5">
          {/* 돋보기 버튼 */}
          <button
            type="button"
            aria-label="검색"
            className="w-9 h-9 border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>

          {/* 로그인 버튼 */}
          <button
            type="button"
            className="h-9 px-4 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center"
          >
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}
