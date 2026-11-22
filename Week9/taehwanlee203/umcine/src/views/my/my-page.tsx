"use client";

import { useState } from "react";
import Link from "next/link";
import { useQueries, useQuery } from "@tanstack/react-query";
import { getMe } from "../../api/members/me";
import { getFavorites } from "../../api/favorites/get-favorites";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { useUpdateMeMutation } from "../../hooks/use-update-me-mutation";

export function MyPage() {
  const { data: myInfo, isPending } = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
  });

  const favoritesQuery = useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
  });

  const favoriteItems = favoritesQuery.data ?? [];

  const favoriteMovieQueries = useQueries({
    queries: favoriteItems.map((item) => ({
      queryKey: ["movies", "detail", item.movieId],
      queryFn: () => getMovieDetail(item.movieId),
      staleTime: 5 * 60 * 1000,
    })),
  });

  const updateMeMutation = useUpdateMeMutation();

  const [nickname, setNickname] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const trimmedNickname = nickname.trim();

    if (!trimmedNickname) {
      setMessage("닉네임을 입력해주세요.");
      return;
    }

    if (trimmedNickname.length < 2 || trimmedNickname.length > 12) {
      setMessage("닉네임은 2자 이상 12자 이하여야 합니다.");
      return;
    }

    if (trimmedNickname === myInfo?.nickname) {
      setMessage("변경된 닉네임이 없습니다.");
      return;
    }

    updateMeMutation.mutate(
      { nickname: trimmedNickname },
      {
        onSuccess: () => {
          setIsEditing(false);
          setMessage("");
        },
      },
    );
  }

  if (isPending || !myInfo) {
    return (
      <main className="min-h-[calc(100vh-72px)] bg-[#f5f6f8] px-6 py-8">
        <p className="py-8 text-center text-gray-500">
          회원 정보를 불러오는 중입니다.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#f5f6f8] px-6 py-8">
      <div className="mx-auto max-w-6xl">
        {!isEditing && (
          <>
            <section>
              <div className="mb-7 flex items-center justify-between">
                <h1 className="text-3xl font-extrabold text-gray-900">
                  내 정보
                </h1>

                <button
                  type="button"
                  onClick={() => {
                    setNickname(myInfo.nickname);
                    setIsEditing(true);
                    setMessage("");
                  }}
                  className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  정보 수정
                </button>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h2 className="mb-4 text-sm font-bold text-gray-900">
                  기본 정보
                </h2>

                <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-[90px_180px_1fr]">
                  <div className="flex justify-center sm:justify-start">
                    <img
                      src="/icon/person.svg"
                      alt="프로필"
                      className="h-16 w-16 rounded-full"
                    />
                  </div>

                  <div>
                    <p className="mb-1 text-xs text-gray-400">닉네임</p>
                    <p className="text-sm font-bold text-gray-900">
                      {myInfo.nickname}
                    </p>
                  </div>

                  <div>
                    <p className="mb-1 text-xs text-gray-400">이메일</p>
                    <p className="break-all text-sm font-bold text-gray-900">
                      {myInfo.email}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-8">
              <h2 className="mb-4 text-sm font-bold text-gray-900">
                내 즐겨찾기
              </h2>

              {favoritesQuery.isPending ? (
                <p className="py-10 text-sm text-gray-400">
                  즐겨찾기 목록을 불러오는 중입니다...
                </p>
              ) : favoriteItems.length === 0 ? (
                <p className="py-10 text-sm text-gray-400">
                  아직 즐겨찾기한 영화가 없습니다.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-5">
                  {favoriteMovieQueries.map((query, index) => {
                    const movie = query.data;
                    const movieId = favoriteItems[index]?.movieId;

                    if (!movie) {
                      return (
                        <div
                          key={movieId ?? index}
                          className="aspect-[2/3] animate-pulse rounded-xl bg-gray-200"
                        />
                      );
                    }

                    return (
                      <Link
                        key={movie.id}
                        href={`/movies/${movie.id}`}
                        className="group block"
                      >
                        <div className="aspect-[2/3] w-full overflow-hidden rounded-xl bg-gray-200 shadow-sm">
                          {movie.poster_path ? (
                            <img
                              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                              alt={movie.title}
                              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs text-gray-400">
                              이미지 없음
                            </div>
                          )}
                        </div>
                        <p className="mt-2 truncate text-xs font-bold text-gray-900 group-hover:text-blue-600">
                          {movie.title}
                        </p>
                        <p className="mt-0.5 text-[11px] text-gray-400">
                          {movie.release_date?.replaceAll("-", ".")}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}

        {isEditing && (
          <form onSubmit={handleSubmit}>
            <div className="mb-7 flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900">
                  내 정보 수정
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                  닉네임과 프로필 이미지만 변경할 수 있어요.
                </p>
              </div>

              <button
                type="submit"
                disabled={updateMeMutation.isPending}
                className="rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {updateMeMutation.isPending ? "저장 중..." : "변경사항 저장"}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.5fr]">
              <div className="flex flex-col items-center justify-center py-8">
                <img
                  src="/icon/person.svg"
                  alt="프로필"
                  className="h-20 w-20 rounded-full"
                />
                <p className="mt-2 text-sm font-bold text-gray-900">
                  프로필 이미지
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="nickname"
                    className="mb-2 block text-sm font-bold text-gray-900"
                  >
                    닉네임
                  </label>
                  <input
                    id="nickname"
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    maxLength={12}
                    required
                    placeholder="닉네임을 입력해주세요."
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-4 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-bold text-gray-900"
                  >
                    이메일
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={myInfo.email}
                    disabled
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-4 text-sm text-gray-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {message && (
              <p className="mt-5 text-sm text-red-500" role="status">
                {message}
              </p>
            )}

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setNickname(myInfo.nickname);
                  setIsEditing(false);
                  setMessage("");
                }}
                className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                취소
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
