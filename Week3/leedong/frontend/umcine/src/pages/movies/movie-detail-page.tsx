import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) {
    return (
      <main className="px-20 py-12 text-lg font-bold text-[#606774]">
        영화를 찾을 수 없어요.
      </main>
    );
  }

  return (
    <main>
      <div className="relative h-[420px] overflow-hidden bg-[#17191e]">
        <img
          className="h-full w-full object-cover opacity-50"
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
        />
        <Link
          to="/"
          className="absolute left-20 top-6 rounded-lg border border-white px-4 py-2 text-sm font-extrabold text-white"
        >
          영화 목록
        </Link>
      </div>
      <section className="relative -mt-[160px] flex gap-10 px-20 pb-12">
        <img
          className="h-[360px] w-[240px] shrink-0 rounded-[10px] object-cover shadow-lg"
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
        />
        <div className="flex flex-col gap-2 pt-[180px]">
          <h1 className="text-[38px] font-bold leading-[44px] tracking-[-1.71px]">{movie.title}</h1>
          <p className="text-sm text-[#969da8]">{movie.originalTitle}</p>
          <p className="text-sm text-[#606774]">
            {movie.releaseDate} · {movie.genres.join(" · ")} · {movie.runtime}
          </p>
          <h2 className="mt-4 text-lg font-extrabold">{movie.tagline}</h2>
          <p className="max-w-[720px] text-sm leading-6 text-[#606774]">{movie.overview}</p>
        </div>
      </section>
    </main>
  );
}
