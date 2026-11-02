import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { searchMovies } from "../../api/movies/search-movies";
import { BookmarkButton } from "../../components/bookmark-button";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

export function SearchPage() {
  const { query = "" } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 5주차 노션 방식 (6주차 TanStack Query에서 대체)
    setSearchText(query ?? "");
  }, [query]);

    useEffect(() => {
    let ignore = false;
    const normalizedQuery = query.trim();

    // eslint-disable-next-line react-hooks/set-state-in-effect -- 5주차 노션 방식 (6주차 TanStack Query에서 대체)
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
    <main>
      <h1>영화 검색</h1>
      <form onSubmit={handleSubmit}>
        <input
          aria-label="검색어"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />
        <button type="submit">검색</button>
      </form>

      {!query.trim() ? (
        <p>검색어를 입력해 주세요.</p>
      ) : isLoading ? (
        <p>검색 결과를 불러오는 중이에요.</p>
      ) : errorMessage ? (
        <p>{errorMessage}</p>
      ) : movies.length === 0 ? (
        <p>조건에 맞는 영화가 없어요.</p>
      ) : (
        <>
          <h2>‘{query}’ 검색 결과</h2>
          <p>영화 {movies.length}편</p>
          <ul>
            {movies.map((movie) => {
              const posterUrl = getTmdbPosterUrl(movie.poster_path);

              return (
                <li key={movie.id}>
                  {posterUrl ? (
                    <img
                      className="h-[180px] w-[120px] object-cover"
                      src={posterUrl}
                      alt={`${movie.title} 포스터`}
                    />
                  ) : (
                    <div className="flex h-[180px] w-[120px] items-center justify-center bg-[#e3e6eb] text-xs font-bold text-[#606774]">
                      이미지 없음
                    </div>
                  )}
                  <h3>{movie.title}</h3>
                  <BookmarkButton movieId={movie.id} />
                  <p>{movie.original_title}</p>
                  <p>{movie.release_date}</p>
                  <p>{movie.overview}</p>
                  <Link
                    to="/movies/$movieId"
                    params={{ movieId: String(movie.id) }}
                  >
                    상세 보기
                  </Link>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </main>
  );
}