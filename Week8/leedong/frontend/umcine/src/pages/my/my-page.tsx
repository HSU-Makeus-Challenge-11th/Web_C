import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQueries } from "@tanstack/react-query";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { BookmarkButton } from "../../components/bookmark-button";
import Pagination from "../../components/movies/pagination";
import { useFavoritesQuery } from "../../hooks/use-favorites-query";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { useMeQuery } from "@/hooks/use-me-query";

const PAGE_SIZE = 10;

export function MyPage() {
  const [page, setPage] = useState(1);
  const meQuery = useMeQuery();
  const member = meQuery.data;

  const favoritesQuery = useFavoritesQuery();
  const favorites = favoritesQuery.data ?? [];
  const totalPages = Math.max(1, Math.ceil(favorites.length / PAGE_SIZE));
  // 마지막 페이지에서 해제해서 페이지 수가 줄어들면 마지막 페이지로 맞춰요.
  const currentPage = Math.min(page, totalPages);
  const pageFavorites = favorites.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  // 즐겨찾기 응답에는 movieId만 있어서, 제목과 포스터는 TMDB 상세 조회로 채워요.
  // 영화 상세 화면과 같은 query key를 써서 이미 본 영화는 캐시를 재사용해요.
  const movieDetailQueries = useQueries({
    queries: pageFavorites.map((favorite) => ({
      queryKey: ["movies", "detail", favorite.movieId],
      queryFn: () => getMovieDetail(favorite.movieId),
      staleTime: 30 * 1000,
    })),
  });

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
                <dd className="mt-1 text-sm font-extrabold">{member?.nickname ?? "-"}</dd>
              </div>
              <div>
                <dt className="text-[11px] text-[#969da8]">이메일</dt>
                <dd className="mt-1 text-sm font-extrabold">{member?.email ?? "-"}</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="flex flex-col gap-5 py-5">
          <h2 className="text-sm font-extrabold">내 즐겨찾기</h2>
          {favoritesQuery.isPending && <p>즐겨찾기를 불러오는 중이에요.</p>}
          {favoritesQuery.isError && <p>즐겨찾기를 불러오지 못했어요.</p>}
          {favoritesQuery.isSuccess && favorites.length === 0 && (
            <p className="text-sm text-[#606774]">즐겨찾기한 영화가 없어요.</p>
          )}
          <div className="grid grid-cols-5 gap-x-[18px] gap-y-[21px]">
            {pageFavorites.map((favorite, index) => {
              const movieQuery = movieDetailQueries[index];
              const movie = movieQuery?.data;
              const posterUrl = movie ? getTmdbPosterUrl(movie.poster_path) : null;

              return (
                <article key={favorite.favoriteId} className="flex flex-col gap-1">
                  <div className="relative h-[274px] overflow-hidden rounded-[10px] bg-[#e3e6eb]">
                    {posterUrl ? (
                      <Link
                        to="/movies/$movieId"
                        params={{ movieId: String(favorite.movieId) }}
                      >
                        <img
                          className="block h-full w-full object-cover"
                          src={posterUrl}
                          alt={`${movie?.title ?? ""} 포스터`}
                        />
                      </Link>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs font-bold text-[#606774]">
                        {movieQuery?.isError ? "정보를 불러오지 못했어요" : "불러오는 중"}
                      </div>
                    )}
                    <div className="absolute right-[10px] top-[10px]">
                      <BookmarkButton movieId={favorite.movieId} />
                    </div>
                  </div>
                  <h3 className="pt-[5px] text-[14px] font-extrabold leading-[17px]">
                    {movie?.title ?? `영화 ${favorite.movieId}`}
                  </h3>
                  <p className="text-xs leading-[14px] text-[#969da8]">
                    {movie?.release_date ?? ""}
                  </p>
                </article>
              );
            })}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </section>
      </main>
      <footer className="flex h-[57px] items-center justify-end bg-white px-20 py-4 text-xs text-[#606774]">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </footer>
    </div>
  );
}
