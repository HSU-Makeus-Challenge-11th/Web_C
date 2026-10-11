import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import type { SubmitEvent } from "react";
import { movies } from "../../data/movies";
import { BookmarkButton } from "../../components/bookmark-button";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });

  const searchQuery = query ?? "";
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const searchResults = normalizedQuery
    ? movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(normalizedQuery) ||
          movie.originalTitle.toLowerCase().includes(normalizedQuery),
      )
    : [];

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const nextQuery = String(formData.get("query") ?? "").trim();

    void navigate({
      to: "/search",
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  return (
    <main className="mx-auto w-[calc(100%-32px)] max-w-[1280px] flex-1 py-8 sm:w-[calc(100%-48px)]">
      <h1 className="text-[32px] font-bold tracking-[-0.04em]">
        영화 검색
      </h1>

      <form
        key={searchQuery}
        onSubmit={handleSubmit}
        role="search"
        className="mt-6 flex gap-3"
      >
        <input
          type="search"
          name="query"
          aria-label="검색어"
          placeholder="영화 제목이나 원제를 입력하세요"
          defaultValue={searchQuery}
          className="h-12 min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-4"
        />

        <button
          type="submit"
          className="shrink-0 cursor-pointer rounded-lg bg-brand px-6 font-semibold text-white hover:bg-[#226fd1]"
        >
          검색
        </button>
      </form>

      {!normalizedQuery ? (
        <p className="py-20 text-center text-gray-500">
          검색어를 입력해 주세요.
        </p>
      ) : (
        <section className="mt-10" aria-labelledby="search-results-title">
          <h2 id="search-results-title" className="text-xl font-bold">
            ‘{searchQuery}’ 검색 결과
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            영화 {searchResults.length}편
          </p>

          {searchResults.length === 0 ? (
            <p className="py-20 text-center text-gray-500">
              검색 결과가 없어요.
            </p>
          ) : (
            <ul className="mt-6 space-y-5">
              {searchResults.map((movie) => (
                <li key={movie.id}>
                  <Link
                    to="/movies/$movieId"
                    params={{ movieId: String(movie.id) }}
                    className="flex gap-5 rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md sm:gap-7 sm:p-6"
                  >
                    <img
                      src={movie.posterPath}
                      alt={`${movie.title} 포스터`}
                      loading="lazy"
                      className="h-[180px] w-[120px] shrink-0 rounded-lg object-cover sm:h-[240px] sm:w-[160px]"
                    />
              
                    <div className="min-w-0">
                      <h3 className="text-xl font-bold">{movie.title}</h3>
                            
                      <p className="mt-1 text-sm text-gray-500">
                        {movie.originalTitle}
                      </p>
                            
                      <p className="mt-3 text-sm text-gray-500">
                        개봉일 {movie.releaseDate}
                      </p>
                            
                      <p className="mt-4 leading-7 break-words text-gray-700">
                        {movie.overview}
                      </p>
                            
                      <span className="mt-4 inline-block text-sm font-semibold text-brand">
                        상세 보기 →
                      </span>
                    </div>
                  </Link>
                            
                  <div className="mt-3 flex justify-end">
                    <BookmarkButton
                      movieId={movie.id}
                      movieTitle={movie.title}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </main>
  );
}