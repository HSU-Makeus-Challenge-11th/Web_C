import { useState } from "react";
import { Link } from "@tanstack/react-router";
import Pagination from "../../components/movies/pagination";
import { movies } from "../../data/movies";

// TODO: 8주차에서 내 정보 조회 API로 교체
const MEMBER = {
  nickname: "umc_user",
  email: "name@example.com",
};

// TODO: 즐겨찾기(북마크) 목록으로 교체. 지금은 퍼블리싱용으로 영화 3편을 보여줘요.
const FAVORITE_MOVIE_IDS = [1, 2, 5];
const favoriteMovies = movies.filter((movie) =>
  FAVORITE_MOVIE_IDS.includes(movie.id),
);

export function MyPage() {
  const [page, setPage] = useState(1);

  return (
    <div className="flex min-h-[calc(100vh-91px)] flex-col bg-[#f6f7f9]">
      <main className="flex flex-1 flex-col px-20 pb-12 pt-6">
        <div className="flex items-center justify-between border-b border-[#e3e6eb] pb-5">
          <h1 className="text-[38px] font-bold leading-[44px] tracking-[-1.71px]">
            내 정보
          </h1>
          <Link
            to="/my/edit"
            className="flex h-10 items-center rounded-lg bg-[#2563eb] px-4 text-sm font-extrabold text-white"
          >
            정보 수정
          </Link>
        </div>

        <section className="flex flex-col gap-5 border-b border-[#e3e6eb] py-5">
          <h2 className="text-sm font-extrabold">기본 정보</h2>
          <div className="flex items-center gap-7">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#e3e6eb]">
              <img className="h-8 w-8" src="/icons/person.svg" alt="" />
            </div>
            <dl className="flex">
              <div className="w-[392px]">
                <dt className="text-[11px] text-[#969da8]">닉네임</dt>
                <dd className="mt-1 text-sm font-extrabold">{MEMBER.nickname}</dd>
              </div>
              <div>
                <dt className="text-[11px] text-[#969da8]">이메일</dt>
                <dd className="mt-1 text-sm font-extrabold">{MEMBER.email}</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="flex flex-col gap-5 py-5">
          <h2 className="text-sm font-extrabold">내 즐겨찾기</h2>
          <div className="grid grid-cols-5 gap-x-[18px] gap-y-[21px]">
            {favoriteMovies.map((movie) => (
              <article key={movie.id} className="flex flex-col gap-1">
                <div className="h-[274px] overflow-hidden rounded-[10px] bg-[#e3e6eb]">
                  <img
                    className="block h-full w-full object-cover"
                    src={movie.posterPath}
                    alt={`${movie.title} 포스터`}
                  />
                </div>
                <h3 className="pt-[5px] text-[14px] font-extrabold leading-[17px]">
                  {movie.title}
                </h3>
                <p className="text-xs leading-[14px] text-[#969da8]">
                  {movie.releaseDate}
                </p>
              </article>
            ))}
          </div>
          <Pagination currentPage={page} totalPages={1} onPageChange={setPage} />
        </section>
      </main>
      <footer className="flex h-[57px] items-center justify-end bg-white px-20 py-4 text-xs text-[#606774]">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </footer>
    </div>
  );
}
