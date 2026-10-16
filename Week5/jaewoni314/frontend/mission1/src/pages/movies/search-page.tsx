import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { searchMovies } from "../../api/movies/search-movies";
import { BookmarkButton } from "../../components/movies/bookmark-button";
import { MovieImage } from "../../components/movies/movie-image";
import { StatusMessage } from "../../components/movies/status-message";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

interface SearchResult {
  query: string;
  movies: TmdbMovieListItem[];
  errorMessage: string | null;
}

export function SearchPage() {
  const { query = "" } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query);
  const [lastQuery, setLastQuery] = useState(query);

  // URL의 query가 바뀌면(뒤로 가기 등) 입력창도 같은 값으로 맞춰요.
  if (query !== lastQuery) {
    setLastQuery(query);
    setSearchText(query);
  }

  // 응답을 어떤 검색어의 결과인지와 함께 저장해요.
  const [result, setResult] = useState<SearchResult | null>(null);

  const normalizedQuery = query.trim();

  useEffect(() => {
    // 빈 검색어는 요청하지 않고 안내 문구만 보여 줘요.
    if (!normalizedQuery) return;

    let ignore = false;

    searchMovies({ query: normalizedQuery })
      .then((response) => {
        if (!ignore) {
          setResult({ query: normalizedQuery, movies: response.results, errorMessage: null });
        }
      })
      .catch(() => {
        if (!ignore) {
          setResult({
            query: normalizedQuery,
            movies: [],
            errorMessage: "검색 결과를 불러오지 못했어요.",
          });
        }
      });

    // 검색어가 바뀌면 늦게 도착한 이전 응답이 현재 결과를 덮어쓰지 않게 해요.
    return () => {
      ignore = true;
    };
  }, [normalizedQuery]);

  // 현재 검색어의 응답이 아직 없으면 로딩이에요. 이전 검색어의 결과는 보여 주지 않아요.
  const isLoading = result?.query !== normalizedQuery;
  const movies = isLoading ? [] : result.movies;
  const errorMessage = isLoading ? null : result.errorMessage;

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  return (
    <main className="mx-auto max-w-[1200px] px-6 pb-16 pt-12">
      <h1 className="text-[32px] font-bold tracking-[-0.02em]">영화 검색</h1>

      <form className="mt-6 flex gap-2" onSubmit={handleSubmit}>
        <input
          className="h-11 w-full max-w-md rounded-lg border border-line bg-surface px-4 text-[15px] placeholder:text-muted"
          aria-label="검색어"
          placeholder="영화 제목을 입력해 주세요"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />
        <button
          type="submit"
          className="h-11 rounded-lg bg-accent px-5 font-semibold text-bg hover:opacity-90"
        >
          검색
        </button>
      </form>

      {!normalizedQuery ? (
        <StatusMessage>검색어를 입력해 주세요.</StatusMessage>
      ) : (
        <>
          <div className="mt-10 flex items-baseline gap-3">
            <h2 className="text-xl font-bold">‘{normalizedQuery}’ 검색 결과</h2>
            {!isLoading && !errorMessage && (
              <p className="text-[15px] text-muted">영화 {movies.length}편</p>
            )}
          </div>

          {isLoading ? (
            <StatusMessage>검색 결과를 불러오는 중이에요.</StatusMessage>
          ) : errorMessage ? (
            <StatusMessage isError>{errorMessage}</StatusMessage>
          ) : movies.length === 0 ? (
            <StatusMessage>조건에 맞는 영화가 없어요.</StatusMessage>
          ) : (
            <ul className="mt-6 flex flex-col gap-6">
              {movies.map((movie) => (
                <li
                  key={movie.id}
                  className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-4 sm:flex-row"
                >
                  <Link
                    to="/movies/$movieId"
                    params={{ movieId: String(movie.id) }}
                    className="shrink-0"
                  >
                    <MovieImage
                      className="h-[180px] w-[120px] rounded-lg"
                      src={getTmdbPosterUrl(movie.poster_path)}
                      alt={`${movie.title} 포스터`}
                    />
                  </Link>

                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-semibold">
                      <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
                        {movie.title}
                      </Link>
                    </h3>
                    <p className="text-sm text-muted">{movie.original_title}</p>
                    <p className="text-sm text-muted">{movie.release_date || "개봉일 미정"}</p>
                    <p className="mt-2 line-clamp-3 text-sm leading-[1.6]">
                      {movie.overview || "줄거리 정보가 없어요."}
                    </p>
                    <div className="mt-auto flex items-center gap-5 pt-3">
                      <Link
                        to="/movies/$movieId"
                        params={{ movieId: String(movie.id) }}
                        className="text-sm font-semibold text-accent"
                      >
                        상세 보기
                      </Link>
                      <BookmarkButton movieId={movie.id} movieTitle={movie.title} showLabel />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  );
}
