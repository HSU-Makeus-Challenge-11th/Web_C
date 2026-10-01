import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

  const handleClear = () => {
    setSearchText("");
  };
  if (!normalizedQuery) {
    return (
      <main className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 -mt-40">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
          어떤 영화를 찾고 있나요?
        </h1>

        <form onSubmit={handleSubmit} className="w-full max-w-xl">
          <div className="relative flex items-center bg-white border border-gray-300 rounded-2xl p-2 pl-4 shadow-lg focus-within:border-gray-500 transition-all">
            <svg
              className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              aria-label="검색어"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="예: 스파이더맨"
              className="w-full bg-transparent focus:outline-none text-gray-900 text-base font-medium placeholder-gray-400"
            />
            <button
              type="submit"
              className="px-6 py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-semibold rounded-xl transition-colors duration-150 flex-shrink-0 ml-2"
            >
              검색
            </button>
          </div>
        </form>
      </main>
    );
  }
  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-900">영화 검색</h1>

      {/* 검색 입력창 */}
      <form onSubmit={handleSubmit} className="relative mb-10 max-w-full">
        <div className="relative flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 shadow-sm focus-within:bg-white focus-within:border-gray-400">
          <svg
            className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          <input
            aria-label="검색어"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="영화 제목을 입력해 주세요."
            className="w-full bg-transparent focus:outline-none text-gray-900 text-base font-medium placeholder-gray-400"
          />

          {searchText && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 mr-2 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}

          <button
            type="submit"
            className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-semibold rounded-lg transition-colors duration-150 flex-shrink-0 ml-2"
          >
            다시 검색
          </button>
        </div>
      </form>

      {/* 검색 결과 영역 */}
      <div className="flex justify-between items-baseline mb-6 border-b border-gray-100 pb-3">
        <h2 className="text-xl font-bold text-gray-900">‘{query}’ 검색 결과</h2>
        <span className="text-xs text-gray-400">
          영화 {searchResults.length}편 · 1페이지
        </span>
      </div>

      {searchResults.length === 0 ? (
        <p className="text-gray-500 py-12 text-center text-base">
          검색 결과가 없어요.
        </p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
          {searchResults.map((movie) => (
            <li key={movie.id} className="flex gap-4 items-start">
              <img
                src={movie.posterPath}
                alt={`${movie.title} 포스터`}
                className="w-32 h-48 object-cover rounded-xl shadow-sm flex-shrink-0 bg-gray-100"
              />

              <div className="flex flex-col flex-1 min-w-0 h-48 justify-between py-1">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 truncate mb-0.5">
                    {movie.title}
                  </h3>

                  <p className="text-xs text-gray-400 mb-3 truncate">
                    {movie.originalTitle} · {movie.releaseDate}
                  </p>

                  <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                    {movie.overview}
                  </p>
                </div>

                <Link
                  to="/movies/$movieId"
                  params={{ movieId: String(movie.id) }}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 transition-colors mt-2"
                >
                  상세 보기 <span className="text-xs">→</span>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
