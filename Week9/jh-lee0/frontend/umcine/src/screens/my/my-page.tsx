"use client";

import Link from "next/link";
import { useQueries, useQuery } from "@tanstack/react-query"; // 미션 2 추가: 서버 데이터 조회 훅 / 미션 6 추가: useQueries (여러 개 한 번에 조회)
import { getMe } from "@/api/members/me";         // 미션 2 추가: 내 정보 조회 함수 (2.2에서 만든 것)
import { movieDetailQueryOptions } from "@/api/movies/movie-queries"; // 미션 6 추가: 영화 상세 조회 설정 (6주차에 만든 것)
import { useMyFavoritesQuery } from "@/hooks/use-favorite";           // 미션 6 추가: 내 즐겨찾기 목록 훅 (미션 4)
import { getTmdbPosterUrl } from "@/utils/tmdb-image";                 // 미션 6 추가: 포스터 이미지 주소 만들기

// 미션 2: 임시 데이터 MY_INFO 삭제 → 아래 useQuery로 진짜 내 정보를 받아옴

// 미션 6: 임시 즐겨찾기 목록 FAVORITE_MOVIES 삭제 → 서버의 내 즐겨찾기 목록(GET /favorites)으로 교체

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
  // 미션 2 추가: 내 정보 조회 (헤더와 같은 이름표라 캐시를 같이 씀)
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    staleTime: 5 * 60 * 1000, // 헤더와 같은 5분
  });
  const me = meQuery.data; // 받아온 내 정보 (아직 없으면 undefined)

  // 미션 6 추가: 내 즐겨찾기 목록 (서버는 movieId만 줌)
  const favoritesQuery = useMyFavoritesQuery();
  const favorites = favoritesQuery.data ?? []; // 아직 없으면 빈 배열로

  // 미션 6 추가: 즐겨찾기한 영화마다 TMDB 상세(제목, 포스터, 개봉일)를 한 번에 조회
  // 상세 페이지와 같은 설정이라, 상세 페이지에서 본 영화는 캐시에서 바로 꺼내 씀
  const movieQueries = useQueries({
    queries: favorites.map((favorite) => movieDetailQueryOptions(favorite.movieId)),
  });

  return (
    <div className="min-h-screen bg-[#F6F7F9]">
      <div className="mx-auto max-w-[1280px] px-4 py-8">
        {/* 제목 + 정보 수정 버튼 */}
        <div className="flex items-center justify-between">
          <h1 className="text-[28px] font-bold text-[#111111]">내 정보</h1>
          <Link
            href="/my/edit"
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
                {me ? me.nickname : "불러오는 중..."} {/* 미션 2: MY_INFO.nickname → 서버 데이터 */}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-[#9CA3AF]">이메일</p>
              <p className="mt-1 text-sm font-bold text-[#111111]">
                {me ? me.email : "불러오는 중..."} {/* 미션 2: MY_INFO.email → 서버 데이터 */}
              </p>
            </div>
          </div>
        </section>

        {/* 내 즐겨찾기 */}
        <section className="mt-8">
          <h2 className="mb-4 text-base font-bold text-[#111111]">
            내 즐겨찾기
          </h2>
          {/* 미션 6 변경: 가짜 목록 → 서버의 내 즐겨찾기 + 영화별 TMDB 정보 */}
          {favoritesQuery.isPending ? (
            <p className="text-sm text-[#6B7280]">즐겨찾기를 불러오는 중이에요...</p>
          ) : favorites.length === 0 ? (
            <p className="text-sm text-[#6B7280]">아직 즐겨찾기한 영화가 없어요.</p>
          ) : (
            // 시안처럼 242px 카드를 왼쪽부터 나열
            <ul className="flex flex-wrap gap-[18px]">
              {favorites.map((favorite, index) => {
                const movie = movieQueries[index]?.data; // 같은 순서의 TMDB 영화 정보 (아직 없으면 undefined)
                const posterUrl = movie ? getTmdbPosterUrl(movie.poster_path) : null;

                return (
                  <li key={favorite.favoriteId} className="w-[242px]">
                    {/* 카드를 누르면 그 영화 상세 페이지로 이동 */}
                    <Link
                      href={`/movies/${favorite.movieId}`}
                    >
                      {posterUrl ? (
                        <img
                          src={posterUrl}
                          alt={movie?.title}
                          className="h-[274px] w-full rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-[274px] w-full rounded-lg bg-[#E5E7EB]" />
                      )}
                      <p className="mt-2 text-sm font-bold text-[#111111]">
                        {movie ? movie.title : "불러오는 중..."}
                      </p>
                      <p className="mt-0.5 text-xs text-[#9CA3AF]">
                        {movie ? movie.release_date : ""}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

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