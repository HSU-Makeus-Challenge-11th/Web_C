import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");

  useEffect(() => {
    setSearchText(query ?? "");
  }, [query]);

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
    <main className="flex flex-col gap-5 px-20 pb-12 pt-6">
      <h1 className="text-[38px] font-bold leading-[44px] tracking-[-1.71px]">영화 검색</h1>
      <form className="flex gap-2.5" onSubmit={handleSubmit}>
        <input
          className="h-[42px] w-[400px] rounded-lg border border-[#e3e6eb] bg-white px-4 text-sm outline-none focus:border-[#2563eb]"
          aria-label="검색어"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />
        <button
          className="h-[42px] rounded-lg bg-[#2563eb] px-4 text-sm font-extrabold text-white"
          type="submit"
        >
          검색
        </button>
      </form>

      {!normalizedQuery ? (
        <p className="text-sm text-[#606774]">검색어를 입력해 주세요.</p>
      ) : (
        <>
          <div className="flex items-baseline gap-2">
            <h2 className="text-xl font-extrabold">‘{query}’ 검색 결과</h2>
            <p className="text-sm text-[#969da8]">영화 {searchResults.length}편</p>
          </div>
          {searchResults.length === 0 ? (
            <p className="text-sm text-[#606774]">검색 결과가 없어요.</p>
          ) : (
            <ul className="flex flex-col gap-4">
              {searchResults.map((movie) => (
                <li
                  key={movie.id}
                  className="flex gap-5 rounded-[10px] border border-[#e3e6eb] bg-white p-4"
                >
                  <img
                    className="h-[180px] w-[120px] shrink-0 rounded-lg object-cover"
                    src={movie.posterPath}
                    alt={`${movie.title} 포스터`}
                  />
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-extrabold">{movie.title}</h3>
                    <p className="text-sm text-[#969da8]">{movie.originalTitle}</p>
                    <p className="text-xs text-[#969da8]">{movie.releaseDate}</p>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#606774]">{movie.overview}</p>
                    <Link
                      className="mt-auto w-fit rounded-lg border border-[#e3e6eb] px-3 py-1.5 text-sm font-bold text-[#17191e]"
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
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
