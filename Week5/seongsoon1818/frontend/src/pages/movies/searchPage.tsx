import { useEffect, useState, type SubmitEvent } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { searchMovies } from "../../api/movies/search-movies";
import type { MovieCardData } from "../../types/movie";
import { toMovieCardData } from "../../adapters/movie-adapter";
import { BookmarkButton } from "../../components/bookmark-button";
import { Pagination } from "../../components/pagination";
import { RequestError } from "../../components/request-error";
import { MAX_TMDB_PAGE } from "../../utils/movies/movie-page";

export function SearchPage() {
  const { query = "", page = 1 } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });

  function handlePageChange(nextPage: number) {
    void navigate({
      to: "/search",
      search: { query, ...(nextPage === 1 ? {} : { page: nextPage }) },
    });
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = String(new FormData(event.currentTarget).get("query") ?? "").trim();
    void navigate({
      to: "/search",
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  return (
    <main className="mx-auto w-[calc(100%-32px)] max-w-[1280px] flex-1 py-8 sm:w-[calc(100%-48px)]">
      <h1 className="text-[32px] font-bold tracking-[-0.04em]">영화 검색</h1>
      <form key={`form:${query}`} onSubmit={handleSubmit} role="search" className="mt-6 flex gap-3">
        <input
          type="search"
          name="query"
          aria-label="검색어"
          placeholder="영화 제목이나 원제를 입력하세요"
          defaultValue={query}
          className="h-12 min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-4"
        />
        <button type="submit" className="shrink-0 cursor-pointer rounded-lg bg-brand px-6 font-semibold text-white hover:bg-[#226fd1]">
          검색
        </button>
      </form>

      {query ? (
        <SearchResults key={`results:${query}`} query={query} page={page} onPageChange={handlePageChange} />
      ) : (
        <p className="py-20 text-center text-gray-500">검색어를 입력해 주세요.</p>
      )}
    </main>
  );
}

interface SearchResultsProps {
  query: string;
  page: number;
  onPageChange: (page: number) => void;
}

function SearchResults({ query, page, onPageChange }: SearchResultsProps) {

  return (
    <section className="mt-10" aria-labelledby="search-results-title">
      <h2 id="search-results-title" className="text-xl font-bold">‘{query}’ 검색 결과</h2>
      <SearchResultsPage key={page} query={query} page={page} onPageChange={onPageChange} />
    </section>
  );
}

function SearchResultsPage({
  query,
  page,
  onPageChange,
}: SearchResultsProps) {
  const [movies, setMovies] = useState<MovieCardData[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [retryCount, setRetryCount] = useState(0);

  function retry() {
    setErrorMessage(null);
    setIsLoading(true);
    setRetryCount((count) => count + 1);
  }

  useEffect(() => {
    let ignore = false;

    searchMovies({ query, page })
      .then((response) => {
        if (!ignore) {
          setMovies(response.results.map(toMovieCardData));
          setTotalResults(response.total_results);
          setTotalPages(Math.min(response.total_pages, MAX_TMDB_PAGE));
        }
      })
      .catch(() => {
        if (!ignore) setErrorMessage("검색 결과를 불러오지 못했어요.");
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => { ignore = true; };
  }, [query, page, retryCount]);

  if (isLoading) {
    return <p role="status" className="py-20 text-center text-gray-500">검색 결과를 불러오는 중이에요.</p>;
  }
  if (errorMessage) {
    return (
      <div className="py-20 text-center">
        <RequestError message={errorMessage} onRetry={retry} />
      </div>
    );
  }
  if (movies.length === 0) {
    return <p className="py-20 text-center text-gray-500">검색 결과가 없어요.</p>;
  }

  return (
    <>
      <p className="mt-2 text-sm text-gray-500">영화 {totalResults}편</p>
      <ul className="mt-6 space-y-5">
        {movies.map((movie) => {
          const posterUrl = movie.posterPath;

          return (
            <li key={movie.id}>
              <Link
                to="/movies/$movieId"
                params={{ movieId: String(movie.id) }}
                className="flex gap-5 rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md sm:gap-7 sm:p-6"
              >
                <div className="flex h-[180px] w-[120px] shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-200 text-sm text-gray-500 sm:h-[240px] sm:w-[160px]">
                  {posterUrl ? (
                    <img src={posterUrl} alt={`${movie.title} 포스터`} loading="lazy" className="size-full object-cover" />
                  ) : "이미지 없음"}
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl font-bold">{movie.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{movie.originalTitle}</p>
                  <p className="mt-3 text-sm text-gray-500">개봉일 {movie.releaseDate || "정보 없음"}</p>
                  <p className="mt-4 leading-7 break-words text-gray-700">{movie.overview || "줄거리 정보가 없어요."}</p>
                  <span className="mt-4 inline-block text-sm font-semibold text-brand">상세 보기 →</span>
                </div>
              </Link>
              <div className="mt-3 flex justify-end">
                <BookmarkButton movieId={movie.id} movieTitle={movie.title} />
              </div>
            </li>
          );
        })}
      </ul>
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={onPageChange} />
    </>
  );
}
