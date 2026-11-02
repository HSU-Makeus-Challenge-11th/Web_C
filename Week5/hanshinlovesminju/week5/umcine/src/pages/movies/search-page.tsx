import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { searchMovies } from "../../api/movies/search-movies";
import { BookmarkButton } from "../../components/bookmark-button";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");
  const [prevQuery, setPrevQuery] = useState(query);

  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // URL의 query가 바뀌면(뒤로 가기 등) 입력창 내용도 맞춰 바꾸기
  if (query !== prevQuery) {
    setPrevQuery(query);
    setSearchText(query ?? "");
  }

  const trimmedQuery = query?.trim() ?? "";
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    let ignore = false;
    const normalizedQuery = (query ?? "").trim();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMovies([]);
    setErrorMessage(null);

    if (!normalizedQuery) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    searchMovies({ query: normalizedQuery })
      .then((response) => {
        if (!ignore) setMovies(response.results);
      })
      .catch(() => {
        if (!ignore) setErrorMessage("검색 결과를 불러오지 못했어요.");
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [query]);

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

        {!trimmedQuery ? (
          <p className="mt-10 text-center text-gray-500">
            검색어를 입력해 주세요.
          </p>
        ) : isLoading ? (
          <p className="mt-10 text-center text-gray-500">
            검색 결과를 불러오는 중이에요.
          </p>
        ) : errorMessage ? (
          <p className="mt-10 text-center text-red-500">{errorMessage}</p>
        ) : (
          <section className="mt-12">
            <h2 className="text-xl font-bold">‘{trimmedQuery}’ 검색 결과</h2>
            <p className="mt-1 text-sm text-gray-500">영화 {movies.length}편</p>

            {movies.length === 0 ? (
              <p className="mt-10 text-center text-gray-500">
                조건에 맞는 영화가 없어요.
              </p>
            ) : (
              <ul className="mt-6 flex flex-col gap-4">
                {movies.map((movie) => {
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
            )}
          </section>
        )}
      </div>
    </main>
  );
}
