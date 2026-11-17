import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { searchMovies } from "../../api/movies/search-movies";
import { BookmarkButton } from "../../components/bookmark-button";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const normalizedQuery = query?.trim() ?? "";

  // 입력창 글자 (URL의 query가 바뀌면 같이 맞춰 줘요)
  const [searchText, setSearchText] = useState(query ?? "");
  const [prevQuery, setPrevQuery] = useState(query);
  if (query !== prevQuery) {
    setPrevQuery(query);
    setSearchText(query ?? "");
  }

  const searchQuery = useQuery({
    queryKey: ["movies", "search", { query: normalizedQuery }],
    queryFn: () => searchMovies({ query: normalizedQuery }),
    enabled: normalizedQuery.length > 0,
  });

  const searchResults = searchQuery.data?.results ?? [];

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  return (
    <main className="flex-1 px-5 pt-48 pb-20">
      <div className="mx-auto w-full max-w-[790px]">
        <h1 className="text-center text-[40px] font-extrabold tracking-[-1px]">
          어떤 영화를 찾고 있나요?
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mt-10 flex h-[74px] items-center gap-3 rounded-xl border-2 border-gray-900 bg-white pr-4 pl-6 shadow-lg"
        >
          <img src="/icons/search.svg" alt="" className="size-5" />
          <input
            aria-label="검색어"
            name="query"
            placeholder="예: 스파이더맨"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            className="flex-1 text-base outline-none placeholder:text-gray-400"
          />
          <button
            type="submit"
            className="h-[42px] rounded-lg bg-gray-900 px-4 text-sm font-bold text-white"
          >
            검색
          </button>
        </form>

        {!normalizedQuery ? (
          <p className="mt-10 text-center text-gray-500">
            검색어를 입력해 주세요.
          </p>
        ) : searchQuery.isLoading ? (
          <p className="mt-10 text-center text-gray-500">
            검색 결과를 불러오는 중이에요.
          </p>
        ) : searchQuery.isError ? (
          <p className="mt-10 text-center text-red-500">
            {searchQuery.error.message}
          </p>
        ) : searchQuery.isSuccess && searchResults.length === 0 ? (
          <p className="mt-10 text-center text-gray-500">검색 결과가 없어요.</p>
        ) : (
          <section className="mt-12">
            <h2 className="text-xl font-bold">‘{normalizedQuery}’ 검색 결과</h2>
            <p className="mt-1 text-sm text-gray-500">
              영화 {searchResults.length}편
            </p>

            <ul className="mt-6 flex flex-col gap-4">
              {searchResults.map((movie) => {
                const posterUrl = getTmdbPosterUrl(movie.poster_path);

                return (
                  <li
                    key={movie.id}
                    className="flex gap-6 rounded-xl bg-white p-4 shadow-sm"
                  >
                    <div className="relative aspect-[2/3] w-[120px] shrink-0 overflow-hidden rounded-lg bg-gray-200">
                      {posterUrl ? (
                        <img
                          src={posterUrl}
                          alt={`${movie.title} 포스터`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-gray-500">
                          이미지 없음
                        </div>
                      )}
                      <BookmarkButton movieId={movie.id} />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-lg font-bold">{movie.title}</h3>
                      <p className="text-sm text-gray-500">
                        {movie.original_title}
                      </p>
                      <p className="mt-1 text-[13px] text-gray-400">
                        {movie.release_date}
                      </p>
                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-700">
                        {movie.overview}
                      </p>
                      <Link
                        to="/movies/$movieId"
                        params={{ movieId: String(movie.id) }}
                        className="mt-auto self-start pt-3 text-sm font-semibold text-[#1a66ff]"
                      >
                        상세 보기
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
