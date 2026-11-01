import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="flex h-[91px] items-center justify-between border-b border-[#e3e6eb] bg-white px-20 py-6">
      <div className="flex items-center gap-[42px]">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-[#17191e]">
            <span className="icon icon-movie" />
          </span>
          <span className="text-xl font-black tracking-[-0.7px]">UMCine</span>
        </Link>
        <nav className="flex items-center gap-[30px]">
          <Link to="/" className="text-sm font-bold text-[#17191e] underline">영화</Link>
          <Link to="/search" className="text-sm font-bold text-[#606774]">검색</Link>
          <a href="#" className="text-sm font-bold text-[#606774]">내 정보</a>
        </nav>
      </div>
      <div className="flex items-center gap-2.5">
        <button className="flex h-[42px] w-[42px] items-center justify-center rounded-lg border border-[#e3e6eb] bg-white text-[#606774]" type="button" aria-label="영화 검색">
          <span className="icon icon-search" />
        </button>
        <button className="h-[42px] rounded-lg border border-white bg-[#2563eb] px-4 text-sm font-extrabold text-white" type="button">로그인</button>
      </div>
    </header>
  );
}