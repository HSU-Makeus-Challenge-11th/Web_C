import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");
  const [lastQuery, setLastQuery] = useState(query);

  // URL의 query가 바뀌면(뒤로 가기 등) 입력창도 같은 값으로 맞춰요.
  if (query !== lastQuery) {
    setLastQuery(query);
    setSearchText(query ?? "");
  }

  const normalizedQuery = query?.trim().toLowerCase() ?? "";
  const searchResults = normalizedQuery
    ? movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(normalizedQuery) ||
          movie.originalTitle.toLowerCase().includes(normalizedQuery),
      )
    : [];

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
        <p className="py-20 text-center text-muted">검색어를 입력해 주세요.</p>
      ) : (
        <>
          <div className="mt-10 flex items-baseline gap-3">
            <h2 className="text-xl font-bold">‘{query}’ 검색 결과</h2>
            <p className="text-[15px] text-muted">영화 {searchResults.length}편</p>
          </div>

          {searchResults.length === 0 ? (
            <p className="py-20 text-center text-muted">검색 결과가 없어요.</p>
          ) : (
            <ul className="mt-6 flex flex-col gap-6">
              {searchResults.map((movie) => (
                <li
                  key={movie.id}
                  className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-4 sm:flex-row"
                >
                  <Link
                    to="/movies/$movieId"
                    params={{ movieId: String(movie.id) }}
                    className="shrink-0"
                  >
                    <img
                      className="h-[180px] w-[120px] rounded-lg object-cover"
                      src={movie.posterPath}
                      alt={`${movie.title} 포스터`}
                      loading="lazy"
                    />
                  </Link>

                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-semibold">
                      <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
                        {movie.title}
                      </Link>
                    </h3>
                    <p className="text-sm text-muted">{movie.originalTitle}</p>
                    <p className="text-sm text-muted">{movie.releaseDate}</p>
                    <p className="mt-2 text-sm leading-[1.6]">{movie.overview}</p>
                    <Link
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                      className="mt-auto pt-3 text-sm font-semibold text-accent"
                    >
                      상세 보기
                    </Link>
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
