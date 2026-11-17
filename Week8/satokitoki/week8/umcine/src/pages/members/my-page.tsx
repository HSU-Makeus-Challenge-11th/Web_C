import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  useQueries,
  useQuery,
  type UseQueryResult,
} from "@tanstack/react-query";
import { tmdbClient } from "../../api/tmdb-client";
import Pagination from "../../components/movies/pagination";
import { getMe } from "../../api/members/me";
import { getFavorites } from "../../api/favorites/get-favorites";

const PAGE_SIZE = 10;
const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";

interface FavoriteMovie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
}

function getFavoriteMovie(movieId: number) {
  return tmdbClient
    .get(`movie/${movieId}`, { searchParams: { language: "ko-KR" } })
    .json<FavoriteMovie>();
}

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

export function MyPage() {
  // 내 정보 (헤더, 수정 화면과 같은 query key라 캐시를 함께 씁니다)
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  // 서버에 저장된 내 즐겨찾기 목록
  const favoritesQuery = useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
    retry: false,
  });

  const [currentPage, setCurrentPage] = useState(1);

  const favoriteMovieIds = (favoritesQuery.data ?? []).map(
    (favorite) => favorite.movieId,
  );
  const totalPages = Math.max(
    1,
    Math.ceil(favoriteMovieIds.length / PAGE_SIZE),
  );
  const safePage = Math.min(currentPage, totalPages);
  const pageMovieIds = favoriteMovieIds.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  // 현재 페이지 영화들의 포스터와 제목을 TMDB에서 한 번에 요청
  const movieQueries = useQueries({
    queries: pageMovieIds.map((movieId) => ({
      queryKey: ["movies", "favorite", movieId],
      queryFn: () => getFavoriteMovie(movieId),
    })),
  });

  return (
    <main className="min-h-[calc(100vh-64px)] bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* 제목 영역 */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-bold text-gray-900">내 정보</h1>
          <Link
            to="/my/edit"
            className="rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            정보 수정
          </Link>
        </div>

        {/* 기본 정보 */}
        <section className="border-b border-gray-200 py-6">
          <h2 className="mb-4 text-base font-bold text-gray-900">기본 정보</h2>
          <div className="flex items-center gap-7">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gray-200">
              <UserIcon />
            </div>
            <div className="grid flex-1 grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-400">닉네임</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {meQuery.data?.nickname ?? "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">이메일</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {meQuery.data?.email ?? "-"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 내 즐겨찾기 */}
        <section className="py-6">
          <h2 className="mb-4 text-base font-bold text-gray-900">
            내 즐겨찾기
          </h2>

          {favoritesQuery.isPending ? (
            <p className="py-16 text-center text-sm text-gray-500">
              즐겨찾기를 불러오는 중이에요.
            </p>
          ) : favoritesQuery.isError ? (
            <p className="py-16 text-center text-sm text-red-500">
              즐겨찾기를 불러오지 못했어요.
            </p>
          ) : favoriteMovieIds.length === 0 ? (
            <p className="py-16 text-center text-sm text-gray-500">
              아직 즐겨찾기한 영화가 없어요.
            </p>
          ) : (
            <>
              <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
                {movieQueries.map(
                  (query: UseQueryResult<FavoriteMovie>, index: number) => {
                    const movieId = pageMovieIds[index];

                    if (query.isPending) {
                      return (
                        <li key={movieId}>
                          <div className="aspect-[2/3] animate-pulse rounded-lg bg-gray-200" />
                        </li>
                      );
                    }

                    if (query.isError || !query.data) {
                      return (
                        <li key={movieId}>
                          <div className="flex aspect-[2/3] items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                            불러오지 못했어요
                          </div>
                        </li>
                      );
                    }

                    const movie = query.data;
                    return (
                      <li key={movieId}>
                        <Link
                          to="/movies/$movieId"
                          params={{ movieId: String(movie.id) }}
                        >
                          {movie.poster_path ? (
                            <img
                              src={`${POSTER_BASE_URL}${movie.poster_path}`}
                              alt={movie.title}
                              className="aspect-[2/3] w-full rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex aspect-[2/3] items-center justify-center rounded-lg bg-gray-200 text-xs text-gray-400">
                              포스터 없음
                            </div>
                          )}
                          <p className="mt-2 truncate text-sm font-semibold text-gray-900">
                            {movie.title}
                          </p>
                          <p className="mt-0.5 text-xs text-gray-400">
                            {movie.release_date
                              ? movie.release_date.replaceAll("-", ".")
                              : "개봉일 미정"}
                          </p>
                        </Link>
                      </li>
                    );
                  },
                )}
              </ul>

              <div className="mt-8">
                <Pagination
                  currentPage={safePage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
